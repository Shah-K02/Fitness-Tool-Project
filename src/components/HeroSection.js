// HeroSection.js
import React from "react";
// import "./HeroSection.css"; // Assume you have CSS for the HeroSection

const HeroSection = () => {
  return (
    <div className="hero-image">
      <img src="hero-img.jpg" alt="Hero Image" />
      <div className="button-container">
        <a href="/login">
          <button className="login-button">Login</button>
        </a>
        <a href="/signup">
          <button className="signup-button">Signup</button>
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
