import React from "react";
import "./NutrientRing.css";

function NutrientRing({ values, size = 100, strokeWidth = 10, calories }) {
  const radius = size / 2 - strokeWidth * 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate lengths for each nutrient
  const total = values.protein + values.carbs + values.fats;
  const proteinLength = (values.protein / total) * circumference;
  const carbsLength = (values.carbs / total) * circumference;
  const fatsLength = (values.fats / total) * circumference;

  return (
    <div className="ring">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Protein */}
        <circle
          className="nutrient-protein"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${proteinLength} ${circumference - proteinLength}`}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Carbs */}
        <circle
          className="nutrient-carbs"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${carbsLength} ${circumference - carbsLength}`}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(${(proteinLength / circumference) * 360 - 90} ${
            size / 2
          } ${size / 2})`}
        />
        {/* Fats */}
        <circle
          className="nutrient-fats"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${fatsLength} ${circumference - fatsLength}`}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(${
            ((proteinLength + carbsLength) / circumference) * 360 - 90
          } ${size / 2} ${size / 2})`}
        />
        {/* Calories Text */}
        <text
          x="50%"
          y="50%"
          className="calories-text"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="black"
        >
          {calories} kcal
        </text>
      </svg>
      <div className="nutrient-legend">
        <p>
          <span
            className="legend-color"
            style={{ backgroundColor: "#dc0000" }}
          ></span>{" "}
          Protein
        </p>
        <p>
          <span
            className="legend-color"
            style={{ backgroundColor: "#ffa500" }}
          ></span>{" "}
          Carbs
        </p>
        <p>
          <span
            className="legend-color"
            style={{ backgroundColor: "#36454f" }}
          ></span>{" "}
          Fats
        </p>
      </div>
    </div>
  );
}

export default NutrientRing;
