// BackButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const BackButton = ({ className, backText }) => {
  const navigate = useNavigate();

  return (
    <button className={className} onClick={() => navigate(-1)}>
      <FontAwesomeIcon icon={faChevronLeft} />
      <span>{backText}</span>
    </button>
  );
};

export default BackButton;
