import React from "react";
import { FaFacebook, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
//import "./Footer.css"; // Your global styles

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="img4.jpg" alt="Your Logo" />
        </div>

        <div className="footer-links">
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div className="footer-social">
          <ul className="social-icons">
            <li>
              <a href="#">
                <FaFacebook />
              </a>
            </li>
            <li>
              <a href="#">
                <FaTwitter />
              </a>
            </li>
            <li>
              <a href="#">
                <FaGithub />
              </a>
            </li>
            <li>
              <a href="#">
                <FaLinkedin />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Your Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
