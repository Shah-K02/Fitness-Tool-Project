import React, { useState } from "react";

function FoodLogPage() {
  const [foodName, setFoodName] = useState("");
  const [meal, setMeal] = useState("");
  const [servings, setServings] = useState(1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const foodData = { foodName, meal, servings };
    try {
      const token = localStorage.getItem("token"); // Retrieve the auth token
      const response = await fetch("http://localhost:8081/api/log-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify(foodData),
      });
      if (response.ok) {
        console.log("Food logged successfully!");
        // Handle successful food log here (e.g., clear form, display message)
      } else {
        console.error("Failed to log food");
        // Handle errors here
      }
    } catch (error) {
      console.error("Network error:", error);
      // Handle network errors here
    }
  };

  return (
    <div>
      <h1>Log Your Food</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          placeholder="What did you eat?"
          required
        />
        <select value={meal} onChange={(e) => setMeal(e.target.value)} required>
          <option value="">Select a meal</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
        <input
          type="number"
          value={servings}
          onChange={(e) => setServings(e.target.value)}
          min="1"
          max="10"
          required
        />
        <button type="submit">Log Food</button>
      </form>
    </div>
  );
}

export default FoodLogPage;
