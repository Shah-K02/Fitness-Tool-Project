import React from "react";
import { Link } from "react-router-dom";
import "./SearchResult.css";

const SearchResult = ({ result }) => {
  // Find the nutrient object for Energy, which represents calories
  const calorieNutrient = result.foodNutrients.find(
    (nutrient) =>
      nutrient.nutrientName === "Energy" && nutrient.unitName === "KCAL"
  );
  // Extract the calorie value, if it exists
  const calories = calorieNutrient ? calorieNutrient.value : "N/A";

  return (
    <Link to={`/food/${result.fdcId}`} className="result">
      {result.description} - Calories: {calories} kcal
    </Link>
  );
};
export default SearchResult;
