import React, { useState } from "react";

function FoodLogPage({ onSubmit }) {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ foodName, calories });
    setFoodName("");
    setCalories("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        placeholder="Food Name"
        required
      />
      <input
        type="number"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        placeholder="Calories"
        required
      />
      <button type="submit">Log Food</button>
    </form>
  );
}

export default FoodLogPage;
