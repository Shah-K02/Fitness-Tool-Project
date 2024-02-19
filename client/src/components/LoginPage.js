import React, { useState } from "react";
import {
  FaGooglePlusG,
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import "./LoginPage.css";
import axios from "axios";

const LoginPage = () => {
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

  const handleSignup = async (event) => {
    event.preventDefault();
    if (userCredentials.signUpPassword !== userCredentials.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/register", {
        email: userCredentials.signUpEmail,
        password: userCredentials.signUpPassword,
      });
      console.log(response.data);
      // Handle success (e.g., show message, redirect)
      setError(null);
      // Optionally, redirect the user or update UI to show login
    } catch (error) {
      setError("Failed to sign up. Please try again.");
      console.error("Sign Up Error:", error);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8081/login", {
        email: userCredentials.signInEmail,
        password: userCredentials.signInPassword,
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.token); // Adjust based on your API response
      // Handle success (e.g., redirect to dashboard)
      setError(null);
    } catch (error) {
      setError(
        "Failed to log in. Please check your credentials and try again."
      );
      console.error("Login Error:", error);
    }
  };

  const toggleSignUp = () => setIsSignUpActive(true);
  const toggleLogin = () => setIsSignUpActive(false);
  const preventDefault = (event) => event.preventDefault();

  // Component's JSX follows...

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
