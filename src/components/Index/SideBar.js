import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const SideBar = ({ links, close, user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="sidebar">
      {links.map((link) => (
        <a
          href={link.url}
          className="sidebar-link"
          key={link.name}
          onClick={close}
          style={{ display: "block", width: "100%" }}
        >
          <FontAwesomeIcon icon={link.icon} />
          <span>{link.name}</span>
        </a>
      ))}
      {user && (
        <div className="sidebar-link" onClick={(e) => e.stopPropagation()}>
          <FontAwesomeIcon icon={user.icon || faUser} />
          <span>{user.email}</span>
        </div>
      )}
      <a
        className="sidebar-link"
        onClick={handleLogout}
        style={{ display: "block", width: "100%" }}
      >
        {" "}
        Logout
      </a>
    </div>
  );
};

export default SideBar;
