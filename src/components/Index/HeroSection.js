// HeroSection.js
import React from "react";
import { Link } from "react-router-dom";
// import "./HeroSection.css"; // Assume you have CSS for the HeroSection

const HeroSection = () => {
  return (
    <div className="hero-image">
      <img src="hero-img.jpg" alt="Hero Image" />
      <div className="button-container">
        <Link to="/login">
          <button className="login-button">Login</button>
          <button className="signup-button">Signup</button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
