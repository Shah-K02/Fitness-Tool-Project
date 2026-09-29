import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "./LogEntry.css";

const formatGrams = (value) => {
  const n = Number(value || 0);
  return `${Number.isInteger(n) ? n : n.toFixed(1)} g`;
};

const LogEntry = ({ entry, onRemove }) => {
  const { description, log_time, protein, carbs, fats, calories } = entry;

  const displayTime = new Date(log_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="log-entry">
      <time className="log-entry-time num" dateTime={log_time}>
        {displayTime}
      </time>
      <div className="log-entry-body">
        <span className="log-entry-desc">{description}</span>
        <span className="log-entry-meta num">
          <span>Protein {formatGrams(protein)}</span>
          <span>Carbs {formatGrams(carbs)}</span>
          <span>Fat {formatGrams(fats)}</span>
        </span>
      </div>
      <span className="log-entry-kcal num">
        {Math.round(Number(calories || 0))} kcal
      </span>
      {onRemove && (
        <button
          type="button"
          className="log-entry-remove"
          onClick={() => onRemove(entry)}
          aria-label={`Remove ${description}`}
          title="Remove"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </div>
  );
};

export default LogEntry;
