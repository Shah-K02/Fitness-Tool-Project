import React, { useState, useEffect, useRef } from "react";
import SideBar from "./SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../helpers/UserContext";
import logo from "../../assets/logo-mark.svg";
import { useNavigate, Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
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
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.url}
                title={link.name}
                className={({ isActive }) => (isActive ? "is-active" : undefined)}
                end={link.url === "/" || link.url === "/user-home"}
              >
                {link.icon && <FontAwesomeIcon icon={link.icon} />}
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link to="/" className="nav-brand">
          <img src={logo} alt="" className="nav-logo" />
          <span className="nav-wordmark">Personalised Fitness Assistant</span>
        </Link>

        <div className="nav-right">
          {user && (
            <div className="account-dropdown" ref={dropdownRef}>
              <div
                className="dropdown-icon"
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
            </div>
          )}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={isOpen ? "burger active" : "burger"}
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </nav>
      {isOpen && (
        <SideBar
          close={() => setIsOpen(false)}
          links={links}
          user={user}
          logout={handleLogout}
        />
      )}
    </>
  );
};

export default Navbar;
