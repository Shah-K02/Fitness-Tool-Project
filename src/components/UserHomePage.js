import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./UserHomePage.css";
import SearchBar from "./SearchBar";
import SearchResultsList from "./SearchResultsList";

const UserHomePage = () => {
  const [results, setResults] = useState([]);
  return (
    <div>
      <h1>Home Page</h1>
      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
        <SearchResultsList results={results} />
      </div>
      <div className="home-buttons">
        <Link to="/profile">
          <button className="profile-button">Profile</button>
        </Link>
        <button className="log-food-button">Log Food</button>
        <button className="your-foods-button">Your Foods</button>
        <button className="your-exercises-button">Your Exercises</button>
        <Link to="/macro-calculator">
          <button className="macro-button" type="submit">
            Calculate Macros
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserHomePage;
