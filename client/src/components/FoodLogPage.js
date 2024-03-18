import React, { useState, useEffect } from "react";
import "./FoodLogPage.css";
import SearchBar from "./SearchBar/SearchBar";
import SearchResultList from "./SearchBar/SearchResultsList";
import BackButton from "./BackButton";

function FoodLogPage() {
  const [foodName, setFoodName] = useState("");
  const [meal, setMeal] = useState("breakfast");
  const [servings, setServings] = useState(1);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [foodLogEntries, setFoodLogEntries] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
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

  // Placeholder: Fetch food log entries for the selected day
  const fetchFoodLogForDay = async (date) => {
    console.log("Fetching food logs for ", date.toDateString());
    setFoodLogEntries([]);
    // Here, I would fetch food log entries from my backend
  };

  useEffect(() => {
    fetchFoodLogForDay(currentDay);
  }, [currentDay]);

  const dateRange = generateDateRange();

  const handleLogFood = (hour) => {
    if (selectedHour === hour) {
      setShowSearch(!showSearch);
    } else {
      setShowSearch(true);
    }
    setSelectedHour(hour);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const foodData = {
      foodName,
      meal,
      servings,
      date: currentDay.toISOString().split("T")[0],
    };
    console.log(foodData);
    // Here, I would send the foodData to my backend to log the food
    // Reset form fields/state as necessary after submission
    setFoodName("");
    setMeal("breakfast");
    setServings(1);
    setShowSearch(false); // Hide the search/log form again
  };

  return (
    <div>
      <BackButton className="back-button" backText="Go Back" />
      <div className="food-log-page">
        <h1 className="food-log-title">Log Your Food</h1>
        <div className="date-navigation">
          {dateRange.map((date, index) => (
            <button
              key={index}
              className={`date-button ${
                date.toDateString() === currentDay.toDateString()
                  ? "active"
                  : ""
              }`}
              onClick={() => setCurrentDay(date)}
            >
              {date.getDate()}/{date.getMonth() + 1}
            </button>
          ))}
        </div>
        <div className="hour-logs-container">
          {Array.from({ length: 24 }, (_, index) => formatHour(index)).map(
            (formattedHour, index) => (
              <React.Fragment key={index}>
                <div className="hour-log">
                  <span className="hour-text">{formattedHour}</span>
                  <button
                    className="log-button"
                    onClick={() => handleLogFood(index)}
                  >
                    +
                  </button>
                </div>
                {showSearch && selectedHour === index && (
                  <div className="search-bar-container">
                    <form
                      className="food-search-form"
                      onSubmit={(e) => handleSubmit(e, index)}
                    >
                      <SearchBar className="search-bar" />
                      <select
                        className="meal-select"
                        value={meal}
                        onChange={(e) => setMeal(e.target.value)}
                        required
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                      <input
                        className="servings-input"
                        type="number"
                        value={servings}
                        onChange={(e) =>
                          setServings(parseInt(e.target.value, 10))
                        }
                        min="1"
                        max="10"
                        required
                      />
                      <button className="submit-button" type="submit">
                        Submit
                      </button>
                    </form>
                  </div>
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodLogPage;
