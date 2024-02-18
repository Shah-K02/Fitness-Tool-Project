import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  FaGooglePlusG,
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import "./LoginPage.css";

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const handleAuth0Login = () => {
    loginWithRedirect({
      screen_hint: "login",
    });
  };

  const handleAuth0Signup = () => {
    loginWithRedirect({
      screen_hint: "signup",
    });
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
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form id="signup-form" onSubmit={handleAuth0Signup}>
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
          <button type="button" onClick={handleAuth0Signup}>
            Sign Up
          </button>
        </form>
      </div>
      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleAuth0Login}>
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
          <button type="button" onClick={handleAuth0Login}>
            Sign In
          </button>
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
