import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideBar = ({ links, close }) => {
  return (
    <div className="sidebar" onClick={close}>
      {links.map((link) => (
        <a className="sidebar-link" key={link.name}>
          <FontAwesomeIcon icon={link.icon} />
          {link.name}{" "}
        </a>
      ))}
    </div>
  );
};

export default SideBar;
