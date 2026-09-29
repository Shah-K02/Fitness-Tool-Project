import React from "react";
import { Link } from "react-router-dom";

const sampleEntries = [
  { time: "07:15", label: "Oats, blueberries, walnuts", kcal: 340 },
  { time: "12:30", label: "Grilled chicken, brown rice, greens", kcal: 510 },
  { time: "16:00", label: "Greek yoghurt, honey", kcal: 180 },
  { time: "19:45", label: "Salmon, sweet potato, broccoli", kcal: 460 },
];

const HeroSection = () => {
  const total = sampleEntries.reduce((sum, entry) => sum + entry.kcal, 0);

  return (
    <section className="cover">
      <div className="cover-plate">
        <p className="cover-kicker">Personalised Fitness Assistant</p>
        <h1>
          Eat.
          <br />
          Train.
          <br />
          Keep the record.
        </h1>
        <p className="cover-sub">
          One ledger for food, exercise, and the numbers they add up to.
        </p>
        <div className="button-container">
          <Link to="/login" state={{ activeForm: "login" }}>
            <button className="btn btn-primary">Sign In</button>
          </Link>
          <Link to="/login" state={{ activeForm: "signup" }}>
            <button className="btn btn-secondary">Open an Account</button>
          </Link>
        </div>
      </div>
      <div className="cover-sample">
        <p className="cover-sample-label">Sample day — Tuesday</p>
        <div className="ledger">
          {sampleEntries.map((entry) => (
            <div className="ledger-row" key={entry.time}>
              <span className="ledger-time num">{entry.time}</span>
              <span className="ledger-desc">{entry.label}</span>
              <span className="ledger-kcal num">{entry.kcal} kcal</span>
            </div>
          ))}
        </div>
        <div className="ledger-total">
          <span>Logged today</span>
          <span className="num is-logged">{total} kcal</span>
        </div>
        <div className="legend">
          <span className="legend-item">
            <span className="legend-swatch is-logged" /> within target
          </span>
          <span className="legend-item">
            <span className="legend-swatch is-flag" /> over target
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
