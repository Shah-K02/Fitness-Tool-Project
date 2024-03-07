// Navbar.js
import React from "react";
import { useState } from "react";
import SideBar from "./SideBar";
import { faHome, faList, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { name: "Home", url: "/", icon: faHome },
    { name: "Link 2", url: "/link2", icon: faList },
    { name: "Link 3", url: "/link3", icon: faList },
    { name: "Account", url: "/account", icon: faUser },
  ];

  function closeSideBar() {
    setIsOpen(false);
  }
  return (
    <>
      <nav>
        <a href="/">
          <div className="nav-icon">
            <img src="logo.png" alt="logo" />
          </div>
        </a>
        <ul className="nav-links">
          {links.map((link) => (
            <li key={link.name}>
              {/* Conditional rendering for the Account icon only */}
              {link.name === "Account" ? (
                <a href={link.url} title={link.name}>
                  <FontAwesomeIcon icon={link.icon} />
                </a>
              ) : (
                <a href={link.url} title={link.name}>
                  {link.name}
                </a>
              )}
            </li>
          ))}
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
