import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserHomePage.css";
import SearchBar from "./SearchBar/SearchBar";
import SearchResultsList from "./SearchBar/SearchResultsList";
import { useUser } from "../helpers/UserContext";

const UserHomePage = () => {
  const [results, setResults] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="content">
      <h1>Home Page</h1>
      <div className="search-bar-container">
        <SearchBar setResults={setResults} />
        {results.length > 0 && <SearchResultsList results={results} />}
      </div>
      <div className="home-buttons">
        <Link to="/profile">
          <button className="profile-button">Profile</button>
        </Link>
        <Link to="/log-food">
          <button className="log-food-button">Log Food</button>
        </Link>
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
