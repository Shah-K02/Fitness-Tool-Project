import React, { useState } from "react";
import {
  FaGooglePlusG,
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import "./LoginPage.css";

const LoginPage = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = (event) => {
    event.preventDefault();
    // Implement your signup logic here
    // Example:
    // setError("Signup not implemented yet.");
  };

  const handleLogin = (event) => {
    event.preventDefault();
    // Implement your login logic here
    // Example:
    // setError("Login not implemented yet.");
  };
  const toggleSignUp = () => {
    setIsSignUpActive(true);
  };

  const toggleLogin = () => {
    setIsSignUpActive(false);
  };

  return (
    <div
      className={`login-container ${isSignUpActive ? "active" : ""}`}
      id="container"
    >
      {error && <div className="error-message">{error}</div>}
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form id="signup-form" onSubmit={handleSignup}>
          <h1>Create Account</h1>
          <div className="social-icons">
            <a href="#" className="icon">
              <FaGooglePlusG />
            </a>
            <a href="#" className="icon">
              <FaFacebookF />
            </a>
            <a href="#" className="icon">
              <FaGithub />
            </a>
            <a href="#" className="icon">
              <FaLinkedinIn />
            </a>
          </div>
          <span>or use your email for registration</span>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
          />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <div className="social-icons">
            <a href="#" className="icon">
              <FaGooglePlusG />
            </a>
            <a href="#" className="icon">
              <FaFacebookF />
            </a>
            <a href="#" className="icon">
              <FaGithub />
            </a>
            <a href="#" className="icon">
              <FaLinkedinIn />
            </a>
          </div>
          <span>or use your email password</span>
          <input type="email" name="email" placeholder="Email" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <a href="#">Forgot Your Password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left" onClick={toggleLogin}>
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button className="ghost" id="signIn">
              Sign In
            </button>
          </div>
          <div className="toggle-panel toggle-right" onClick={toggleSignUp}>
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" id="signUp">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
