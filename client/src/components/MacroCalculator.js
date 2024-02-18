import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";

const MacroCalculator = () => {
  // State hooks for form inputs including goals
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "male",
    goal: "lose", // Default goal
  });

  // State hook for chart data
  const [chartData, setChartData] = useState([0, 0, 0]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Function to calculate macros (placeholder - implement actual logic)
  const calculateMacros = () => {
    // Implement calculation logic based on formData
    // This is a placeholder function
    // Update chartData based on the calculation
    setChartData([20, 30, 50]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateMacros();
  };

  // Initialize or update the chart when chartData changes
  useEffect(() => {
    const ctx = document.getElementById("macroChart").getContext("2d");
    const macroChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Protein", "Carbs", "Fats"],
        datasets: [
          {
            label: "Macronutrient Distribution",
            data: chartData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: "right",
        },
      },
    });
    return () => macroChart.destroy(); // Cleanup the chart on component unmount
  }, [chartData]);

  return (
    <div>
      <h1>Macro Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="height">Height (cm):</label>
        <input
          type="number"
          id="height"
          name="height"
          value={formData.height}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="weight">Weight (kg):</label>
        <input
          type="number"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <br />

        <fieldset>
          <legend>Goal:</legend>
          <label>
            <input
              type="radio"
              name="goal"
              value="lose"
              checked={formData.goal === "lose"}
              onChange={handleChange}
            />{" "}
            Lose weight
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="goal"
              value="gain"
              checked={formData.goal === "gain"}
              onChange={handleChange}
            />{" "}
            Gain weight
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="goal"
              value="gain_muscle"
              checked={formData.goal === "gain_muscle"}
              onChange={handleChange}
            />{" "}
            Gain muscle
          </label>
          <br />
          <label>
            <input
              type="radio"
              name="goal"
              value="maintain"
              checked={formData.goal === "maintain"}
              onChange={handleChange}
            />{" "}
            Maintain weight
          </label>
          <br />
        </fieldset>

        <button type="submit">Calculate</button>
      </form>
      <div style={{ width: 400, height: 400 }}>
        <canvas id="macroChart"></canvas>
      </div>
    </div>
  );
};

export default MacroCalculator;
