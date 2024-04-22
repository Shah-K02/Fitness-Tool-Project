import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const SideBar = ({ links, close, user, logout }) => {
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
          <div className="dropdown-content">
            <a onClick={logout} style={{ display: "block", width: "100%" }}>
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
