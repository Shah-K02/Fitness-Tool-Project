import React from "react";
import { Link } from "react-router-dom";

const MacronutrientSection = () => {
  return (
    <div className="flex-container">
      <div className="macrocalculator">
        <h2>Macro Calculator</h2>
        <p>
          Use our macro calculator to find out how many calories you need to
          consume to reach your goals.
        </p>
        <img src="img4.jpg" alt="Macro Calculator" />
        <Link to="/macro-calculator">
          <button type="submit">Calculate</button>
        </Link>
      </div>
      <div className="secondimage">
        <img src="img4.jpg" alt="Image 4" />
      </div>
    </div>
  );
};

export default MacronutrientSection;
