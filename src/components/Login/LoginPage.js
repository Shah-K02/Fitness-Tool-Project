import React, { useState } from "react";
import {
  FaGooglePlusG,
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import { LiaTimesSolid } from "react-icons/lia";
import "./LoginPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [error, setError] = useState(null);
  const [userCredentials, setUserCredentials] = useState({
    signUpEmail: "",
    signUpPassword: "",
    confirmPassword: "",
    signInEmail: "",
    signInPassword: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };
  const [errorVisible, setErrorVisible] = useState(false);

  const displayError = (message) => {
    setError(message);
    setErrorVisible(true); // Make the error message visible
    setTimeout(() => {
      setErrorVisible(false);
    }, 5000); // Hide after 5 seconds
  };

  const dismissError = () => {
    setError(null);
    setErrorVisible(false); // Hide the error message
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (userCredentials.signUpPassword !== userCredentials.confirmPassword) {
      displayError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/register`,
        {
          email: userCredentials.signUpEmail,
          password: userCredentials.signUpPassword,
        }
      );
      console.log(response.data);
      // Handle success (e.g., show message, redirect)

      displayError(null);
      // Optionally, redirect the user or update UI to show login
    } catch (error) {
      displayError("Failed to sign up. Please try again.");
      console.error("Sign Up Error:", error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/login`,
        {
          email: userCredentials.signInEmail,
          password: userCredentials.signInPassword,
        }
      );
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      // Handle success
      navigate("/user-home");
      displayError(null);
    } catch (error) {
      displayError(
        "Failed to log in. Please check your credentials and try again."
      );
      console.error("Login Error:", error);
    }
  };

  const toggleSignUp = () => setIsSignUpActive(true);
  const toggleLogin = () => setIsSignUpActive(false);
  const preventDefault = (event) => event.preventDefault();

  return (
    <div
      className={`login-container ${isSignUpActive ? "active" : ""}`}
      id="container"
    >
      {error && errorVisible && (
        <div className="error-message error-visible">
          {" "}
          {error}
          <button onClick={dismissError} className="dismiss-error">
            <LiaTimesSolid />
          </button>
        </div>
      )}

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
            name="signUpEmail"
            placeholder="Email"
            required
            aria-label="Email"
            onChange={handleInputChange}
            value={userCredentials.signUpEmail}
          />
          <input
            type="password"
            id="password"
            name="signUpPassword"
            placeholder="Password"
            required
            aria-label="Password"
            onChange={handleInputChange}
            value={userCredentials.signUpPassword}
          />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            aria-label="Confirm Password"
            onChange={handleInputChange}
            value={userCredentials.confirmPassword}
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
          <input
            type="email"
            name="signInEmail"
            placeholder="Email"
            required
            aria-label="Email"
            onChange={handleInputChange}
            value={userCredentials.signInEmail}
          />
          <input
            type="password"
            name="signInPassword"
            placeholder="Password"
            required
            aria-label="Password"
            onChange={handleInputChange}
            value={userCredentials.signInPassword}
          />
          <a href="#" onClick={preventDefault}>
            Forgot Your Password?
          </a>
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
