import React from "react";
import { Link } from "react-router-dom";
import yoga from "../assets/girlyoga.png";
import MacroCalculator from "../assets/MacroCalculator.png";

const MacronutrientSection = () => {
  return (
    <div className="flex-container">
      <div className="secondimage">
        <img src={yoga} alt="Image 4" />
      </div>
      <div className="macrocalculator">
        <h2>Macro Calculator</h2>
        <p>
          Use our macro calculator to find out how many calories you need to
          consume to reach your goals.
        </p>
        <img src={MacroCalculator} alt="Macro Calculator" />
        <Link to="/macro-calculator">
          <button type="submit">Calculate</button>
        </Link>
      </div>
    </div>
  );
};

export default MacronutrientSection;
