import React, { useState, useEffect, useRef } from "react";
import SideBar from "./SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faDumbbell } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isLoggedIn = localStorage.getItem("token") !== null;
  const [currentUserName, setCurrentUserName] = useState("");

  const links = [
    { name: " Home", url: isLoggedIn ? "/user-home" : "/", icon: faHome },
    { name: " Workouts", url: "/searchexercises", icon: faDumbbell },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function closeSideBar() {
    setIsOpen(false);
  }

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    // If user confirms logout
    if (confirmLogout) {
      // Clear the token from localStorage
      localStorage.removeItem("token");

      // Redirect the user to the home page or login page
      window.location.href = "/";
    }
    // If user cancels, do nothing (the confirmation dialog will close on its own)
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/user/info`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update the state with the fetched name
        setCurrentUserName(response.data.name);
      } catch (error) {
        console.error(
          "Failed to fetch user info:",
          error.response ? error.response.data : error.message
        );
      }
    };

    if (isLoggedIn) {
      fetchUserInfo();
    }
  }, [isLoggedIn]);

  return (
    <>
      <nav>
        <a href="/">
          <div className="nav-icon">
            <img src={logo} alt="logo" />
          </div>
        </a>
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.name}>
              <a href={link.url} title={link.name}>
                {link.icon && <FontAwesomeIcon icon={link.icon} />}
                {link.name}
              </a>
            </li>
          ))}
          {isLoggedIn && (
            <li className="account-dropdown" ref={dropdownRef}>
              <div
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                title="Account"
              >
                <FontAwesomeIcon icon={faUser} />
              </div>
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <div className="dropdown-item">{currentUserName}</div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              )}
            </li>
          )}
        </ul>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={isOpen ? "burger active" : "burger"}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </nav>
      {isOpen && <SideBar close={closeSideBar} links={links} />}
    </>
  );
};

export default Navbar;
