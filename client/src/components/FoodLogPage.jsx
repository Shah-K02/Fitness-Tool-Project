import React, { useState, useEffect } from "react";
import "./FoodLogPage.css";
import SearchBar from "./SearchBar/SearchBar";
import SearchResultList from "./SearchBar/SearchResultsList";
import BackButton from "./BackButton";
import LogEntry from "./LogEntry";
import axios from "axios";

function FoodLogPage({ userId }) {
  const [currentDay, setCurrentDay] = useState(new Date());
  const [foodLogEntries, setFoodLogEntries] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);

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
      const token = localStorage.getItem("token");
      const formattedDate = currentDay.toISOString().split("T")[0]; // YYYY-MM-DD format
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/api/logs/${formattedDate}`;
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFoodLogEntries(response.data);
      } catch (error) {
        console.error(
          "Error fetching food logs:",
          error.response ? error.response.data : error.message
        );
      }
    };
    if (userId) {
      fetchLogs();
    }
  }, [currentDay, userId]);

  const dateRange = generateDateRange();

  const handleLogFood = (hour) => {
    if (selectedHour === hour) {
      setShowSearch(!showSearch);
    } else {
      setShowSearch(true);
    }
    setSelectedHour(hour);
  };

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
      <div className="hour-logs-list">
        {" "}
        {Array.from({ length: 24 }, (_, index) => formatHour(index)).map(
          (formattedHour, index) => (
            <div className="hour-log" key={index}>
              {" "}
              <span className="hour-text">{formattedHour}</span>
              <button
                className="log-button"
                onClick={() => handleLogFood(index)}
              >
                +
              </button>
              <div className="log-entries-container">
                {foodLogEntries.length > 0 ? (
                  foodLogEntries.map((entry) => (
                    <LogEntry key={entry.id} entry={entry} />
                  ))
                ) : (
                  <p>No food logs for this day.</p>
                )}
              </div>
              {showSearch && selectedHour === index && (
                <div className="search-bar-container">
                  <SearchBar setResults={setResults} />
                  {results.length > 0 && <SearchResultList results={results} />}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default FoodLogPage;
