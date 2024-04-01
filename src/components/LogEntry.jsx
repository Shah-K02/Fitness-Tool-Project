// LogEntry.js
import React from "react";

const LogEntry = ({ entry }) => {
  const { id, description, log_time, protein, carbs, fats, calories } = entry;

  const displayTime = new Date(log_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="log-entry" key={id}>
      <h4>{description}</h4>
      <p>Logged at: {displayTime}</p>
      <ul>
        <li>Protein: {protein}g</li>
        <li>Carbs: {carbs}g</li>
        <li>Fats: {fats}g</li>
        <li>Calories: {calories} kcal</li>
      </ul>
    </div>
  );
};

export default LogEntry;
