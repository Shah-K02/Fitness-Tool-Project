// Navbar.js
import React from "react";

const Navbar = () => {
  return (
    <nav>
      <a href="/">
        <div className="nav-icon">
          <img src="img4.jpg" alt="logo" />
        </div>
      </a>
      <ul className="nav-links">
        <li>
          <a href="#">Link 1</a>
        </li>
        <li>
          <a href="#">Link 2</a>
        </li>
        <li>
          <a href="#">Link 3</a>
        </li>
        <li>
          <a href="#">Account</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
