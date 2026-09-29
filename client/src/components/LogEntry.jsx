import React from "react";
import "./LogEntry.css";

const LogEntry = ({ entry }) => {
  const { id, description, log_time, protein, carbs, fats, calories } = entry;

  const displayTime = new Date(log_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="log-entry" key={id}>
      <div className="log-entry-row">
        <span className="log-entry-desc">{description}</span>
        <span className="log-entry-kcal num">{calories} kcal</span>
      </div>
      <p className="log-entry-meta">
        {displayTime} &middot; P {protein}g &middot; C {carbs}g &middot; F{" "}
        {fats}g
      </p>
    </div>
  );
};

export default LogEntry;
