import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ErrorMessage from "../ErrorMessage";
import { useUser } from "../../helpers/UserContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [error, setError] = useState("");
  const [errorTimestamp, setErrorTimestamp] = useState(null);
  const [userCredentials, setUserCredentials] = useState({
    signUpEmail: "",
    signUpPassword: "",
    confirmPassword: "",
    signInEmail: "",
    signInPassword: "",
  });

  useEffect(() => {
    const state = location.state?.activeForm;
    if (state === "signup") {
      setIsSignUpActive(true);
    } else if (state === "login") {
      setIsSignUpActive(false);
    }
  }, [location.state]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (userCredentials.signUpPassword !== userCredentials.confirmPassword) {
      setError("Passwords do not match.");
      setErrorTimestamp(Date.now());
      return;
    } else if (userCredentials.signUpPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setErrorTimestamp(Date.now());
      return;
    } else if (!userCredentials.signUpEmail.includes("@")) {
      setError("Invalid email address.");
      setErrorTimestamp(Date.now());
      return;
    } else {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/check-email`,
          {
            params: { email: userCredentials.signUpEmail },
          }
        );
        if (response.status === 409) {
          setError("Email is already registered.");
          setErrorTimestamp(Date.now());
          return;
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setError("Email is already registered.");
          setErrorTimestamp(Date.now());
          return;
        }
        setError("Failed to check email. Please try again.");
        setErrorTimestamp(Date.now());
        console.error("Check Email Error:", error);
      }
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/register`,
        {
          email: userCredentials.signUpEmail,
          password: userCredentials.signUpPassword,
        }
      );
      login(
        { id: response.data.userId, email: userCredentials.signUpEmail },
        response.data.token
      );
      navigate("/user-home");
      setError(null);
    } catch (error) {
      setError("Failed to sign up. Please try again.");
      setErrorTimestamp(Date.now());
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
      login(
        { id: response.data.userId, email: userCredentials.signInEmail },
        response.data.token
      );
      navigate("/user-home");
      setError(null);
      setErrorTimestamp(Date.now());
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      setError(
        "Failed to log in. Please check your credentials and try again."
      );
      setErrorTimestamp(Date.now());
      console.error("Login Error:", error);
    }
  };

  const toggleSignUp = () => setIsSignUpActive(true);
  const toggleLogin = () => setIsSignUpActive(false);
  const preventDefault = (event) => event.preventDefault();

  return (
    <div className="login-page">
      <ErrorMessage
        message={error}
        timestamp={errorTimestamp}
        data-testid="error-message"
      />
      <div
        className={`login-container ${isSignUpActive ? "active" : ""}`}
        id="container"
      >
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form id="signup-form" onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <input
              type="email"
              id="email-signup"
              name="signUpEmail"
              placeholder="Email"
              required
              aria-label="Email"
              onChange={handleInputChange}
              value={userCredentials.signUpEmail}
              data-testid="signup-email"
            />
            <input
              type="password"
              id="password-signup"
              name="signUpPassword"
              placeholder="Password"
              required
              aria-label="Password"
              onChange={handleInputChange}
              value={userCredentials.signUpPassword}
              data-testid="signup-password"
            />
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              aria-label="Confirm Password"
              onChange={handleInputChange}
              value={userCredentials.confirmPassword}
              data-testid="signup-confirm-password"
            />
            <button type="submit" data-testid="signup-submit">
              Sign Up
            </button>
          </form>
        </div>
        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <input
              type="email"
              id="email-signin"
              name="signInEmail"
              placeholder="Email"
              required
              aria-label="Email"
              onChange={handleInputChange}
              value={userCredentials.signInEmail}
              data-testid="signin-email"
            />
            <input
              type="password"
              id="password-signin"
              name="signInPassword"
              placeholder="Password"
              required
              aria-label="Password"
              onChange={handleInputChange}
              value={userCredentials.signInPassword}
              data-testid="signin-password"
            />
            <a
              href="#"
              onClick={preventDefault}
              data-testid="forgot-password-link"
            >
              Forgot Your Password?
            </a>
            <button type="submit" data-testid="signin-submit">
              Sign In
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div
              className="toggle-panel toggle-left"
              onClick={toggleLogin}
              data-testid="toggle-signin"
            >
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost" id="signIn" data-testid="button-signin">
                Sign In
              </button>
            </div>
            <div
              className="toggle-panel toggle-right"
              onClick={toggleSignUp}
              data-testid="toggle-signup"
            >
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" data-testid="button-signup">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
