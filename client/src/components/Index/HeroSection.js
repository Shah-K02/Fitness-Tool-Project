import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero-img.jpg";

const HeroSection = () => {
  return (
    <div className="hero-image">
      <img src={heroImage} alt="Hero" />
      <div className="hero-content">
        <h1>
          Eat <br />
          Track <br />
          Stay Fit!
        </h1>
        <p>Join us and explore the possibilities.</p>
        <div className="button-container">
          <Link to="/login" state={{ activeForm: "login" }}>
            <button className="login-button">Login</button>
          </Link>
          <Link to="/login" state={{ activeForm: "signup" }}>
            <button className="signup-button">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
