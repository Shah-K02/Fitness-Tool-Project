import React, { useState, useEffect } from "react";
import "./FoodLogPage.css";
import SearchBar from "./SearchBar/SearchBar";
import BackButton from "./BackButton";
import LogEntry from "./LogEntry";
import axios from "axios";

function FoodLogPage() {
  const [currentDay, setCurrentDay] = useState(new Date());
  const [foodLogEntries, setFoodLogEntries] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [error, setError] = useState(null);
  // Function to format hour in 12-hour format with AM/PM
  const formatHour = (hour) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = ((hour + 11) % 12) + 1 + suffix; // Converts 0-23 hour format to 12-hour format with AM/PM
    return formattedHour;
  };

  // Generate an array of dates for 3 days in the past and 3 days in the future
  const generateDateRange = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const newDate = new Date(currentDay);
      newDate.setDate(currentDay.getDate() + i);
      dates.push(newDate);
    }
    return dates;
  };

  // useEffect hook to fetch food logs
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const formattedDate = currentDay.toISOString().split("T")[0]; // YYYY-MM-DD format
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/logs/${formattedDate}`;
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          setFoodLogEntries(response.data);
        } else {
          throw new Error("No logs found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [currentDay]); // Dependency array to control effect triggering

  const dateRange = generateDateRange();

  const handleLogFood = (hour) => {
    if (selectedHour === hour) {
      setShowSearch(!showSearch);
    } else {
      setShowSearch(true);
    }
    setSelectedHour(hour);
  };

  if (isLoading) {
    return (
      <div className="food-log-page">
        <BackButton className="back-button" backText=" Back" />
        <h1 className="food-log-title">Log Your Food</h1>
        <p className="state-message">Loading&hellip;</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="food-log-page">
        <BackButton className="back-button" backText=" Back" />
        <h1 className="food-log-title">Log Your Food</h1>
        <p className="state-message is-flag">
          Couldn&rsquo;t load today&rsquo;s log: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="food-log-page">
      <BackButton className="back-button" backText=" Back" />
      <h1 className="food-log-title">Log Your Food</h1>
      <div className="date-navigation">
        {dateRange.map((date, index) => (
          <button
            key={index}
            className={`date-button ${
              date.toDateString() === currentDay.toDateString() ? "active" : ""
            }`}
            onClick={() => setCurrentDay(date)}
          >
            {date.getDate()}/{date.getMonth() + 1}
          </button>
        ))}
      </div>
      <div className="hour-logs-list ledger">
        {Array.from({ length: 24 }, (_, index) => formatHour(index)).map(
          (formattedHour, index) => {
            const entriesForHour = foodLogEntries.filter(
              (entry) => new Date(entry.log_time).getHours() === index
            );
            return (
              <div className="hour-log" key={index}>
                <span className="hour-text num">{formattedHour}</span>
                <div className="log-entries-container">
                  {entriesForHour.length > 0 ? (
                    entriesForHour.map((entry) => (
                      <LogEntry key={entry.id} entry={entry} />
                    ))
                  ) : (
                    <p className="hour-empty">&mdash;</p>
                  )}
                  {showSearch && selectedHour === index && (
                    <div className="search-bar-container">
                      <SearchBar />
                    </div>
                  )}
                </div>
                <button
                  className="log-button"
                  onClick={() => handleLogFood(index)}
                  aria-label={`Log food at ${formattedHour}`}
                >
                  +
                </button>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export default FoodLogPage;
