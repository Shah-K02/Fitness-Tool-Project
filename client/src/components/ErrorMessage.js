import React, { useState, useEffect } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import "./ErrorMessage.css";

const ErrorMessage = ({ message, timestamp }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message && timestamp) {
      setVisible(true); // Show the message when there's a message and a timestamp
      const timer = setTimeout(() => {
        setVisible(false); // Hide after 5 seconds
      }, 5000);

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [message, timestamp]); // React to changes in message or timestamp

  if (!visible) return null;

  return (
    <div className="error-message error-visible">
      {message}
      <button onClick={() => setVisible(false)} className="dismiss-error">
        <LiaTimesSolid />
      </button>
    </div>
  );
};

export default ErrorMessage;
