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
      <div className="login-container">
        <div className="login-tabs tab-nav">
          <a
            className={!isSignUpActive ? "is-active" : undefined}
            onClick={toggleLogin}
            data-testid="toggle-signin"
          >
            Sign In
          </a>
          <a
            className={isSignUpActive ? "is-active" : undefined}
            onClick={toggleSignUp}
            data-testid="toggle-signup"
          >
            Create Account
          </a>
        </div>
        <ErrorMessage
          message={error}
          timestamp={errorTimestamp}
          data-testid="error-message"
        />
        {isSignUpActive ? (
          <form
            id="signup-form"
            className="login-form"
            onSubmit={handleSignup}
          >
            <h1>Create Account</h1>
            <p className="login-form-sub">
              Enter your details and start the record.
            </p>
            <label htmlFor="email-signup">Email</label>
            <input
              type="email"
              id="email-signup"
              name="signUpEmail"
              required
              onChange={handleInputChange}
              value={userCredentials.signUpEmail}
              data-testid="signup-email"
            />
            <label htmlFor="password-signup">Password</label>
            <input
              type="password"
              id="password-signup"
              name="signUpPassword"
              required
              onChange={handleInputChange}
              value={userCredentials.signUpPassword}
              data-testid="signup-password"
            />
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              required
              onChange={handleInputChange}
              value={userCredentials.confirmPassword}
              data-testid="signup-confirm-password"
            />
            <button type="submit" className="btn btn-primary" data-testid="signup-submit">
              Sign Up
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <p className="login-form-sub">
              To keep connected, sign in with your personal info.
            </p>
            <label htmlFor="email-signin">Email</label>
            <input
              type="email"
              id="email-signin"
              name="signInEmail"
              required
              onChange={handleInputChange}
              value={userCredentials.signInEmail}
              data-testid="signin-email"
            />
            <label htmlFor="password-signin">Password</label>
            <input
              type="password"
              id="password-signin"
              name="signInPassword"
              required
              onChange={handleInputChange}
              value={userCredentials.signInPassword}
              data-testid="signin-password"
            />
            <a
              href="#"
              className="forgot-password"
              onClick={preventDefault}
              data-testid="forgot-password-link"
            >
              Forgot Your Password?
            </a>
            <button type="submit" className="btn btn-primary" data-testid="signin-submit">
              Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
