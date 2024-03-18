// BackButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";

const BackButton = ({ className, backText }) => {
  const navigate = useNavigate();

  return (
    <button className={className} onClick={() => navigate(-1)}>
      {backText || "Back"}
    </button>
  );
};

export default BackButton;
