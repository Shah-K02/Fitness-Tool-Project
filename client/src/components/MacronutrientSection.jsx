import React from "react";
import { Link } from "react-router-dom";
import yoga from "../assets/macro-yoga.jpg";
import MacroCalculator from "../assets/macro-calculator-photo.jpg";

const MacronutrientSection = () => {
  return (
    <div className="flex-container">
      <div className="secondimage">
        <img src={yoga} alt="A woman meditating on a mat in a forest clearing" />
      </div>
      <div className="macrocalculator">
        <h2>Macro Calculator</h2>
        <p>
          Use our macro calculator to find out how many calories you need to
          consume to reach your goals.
        </p>
        <img
          src={MacroCalculator}
          alt="A hand placing a bowl on a kitchen scale to weigh food"
        />
        <Link to="/macro-calculator">
          <button type="submit" className="btn btn-primary">
            Calculate
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MacronutrientSection;
