// HeroSection.js
import React from "react";
import { Link } from "react-router-dom";
// import "./HeroSection.css"; // Assume you have CSS for the HeroSection

const HeroSection = () => {
  return (
    <div className="hero-image">
      <img src="hero-img.jpg" alt="Hero Image" />
      <div className="hero-content">
        <h1>
          Eat <br />
          Track <br />
          Stay Fit!
        </h1>
        <p>Join us and explore the possibilities.</p>
        <div className="button-container">
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
          <Link to="/signup">
            <button className="signup-button">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
