import React, { useState, useEffect, useRef } from "react";
import SideBar from "./SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faDumbbell } from "@fortawesome/free-solid-svg-icons";
import useAxios from "../../helpers/useAxios";
import { useUser } from "../../helpers/UserContext";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const axios = useAxios();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const links = [
    { name: "Home", url: user ? "/user-home" : "/", icon: faHome },
    { name: "Workouts", url: "/exercisespage", icon: faDumbbell },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/");
    }
  };

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
          {user && (
            <li className="account-dropdown" ref={dropdownRef}>
              <div
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                title="Account"
              >
                <FontAwesomeIcon icon={faUser} />
              </div>
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <div className="dropdown-item">{user.email}</div>
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
      {isOpen && <SideBar close={() => setIsOpen(false)} links={links} />}
    </>
  );
};

export default Navbar;
