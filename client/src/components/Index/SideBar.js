import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";

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
        <Link
          to={link.url}
          className="sidebar-link"
          key={link.name}
          onClick={close}
        >
          <FontAwesomeIcon icon={link.icon} />
          <span>{link.name}</span>
        </Link>
      ))}
      {user && (
        <div className="sidebar-link" onClick={(e) => e.stopPropagation()}>
          <FontAwesomeIcon icon={user.icon || faUser} />
          <span>{user.email}</span>
        </div>
      )}
      <a className="sidebar-link" onClick={handleLogout}>
        Logout
      </a>
    </div>
  );
};

export default SideBar;
