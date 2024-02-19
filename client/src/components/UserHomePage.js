import React from "react";
import { Link } from "react-router-dom";
import "./UserHomePage.css";

const UserHomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <div className="search-container">
        <form
          className="search-form"
          onSubmit={(event) => event.preventDefault()}
          role="search"
        >
          <label htmlFor="search">Search for stuff</label>
          <input
            id="search"
            type="search"
            placeholder="Search..."
            autoFocus
            required
          />
          <button type="submit">Go</button>
        </form>
      </div>

      <div className="home-buttons">
        <Link to="/profile">
          <button className="profile-button">Profile</button>
        </Link>
        <button className="log-food-button">Log Food</button>
        <button className="your-foods-button">Your Foods</button>
      </div>
    </div>
  );
};

export default UserHomePage;
