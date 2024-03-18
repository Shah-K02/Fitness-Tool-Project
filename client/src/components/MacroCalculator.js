import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import "./Macro.css";
import BackButton from "./BackButton";

const MacroCalculator = () => {
  // Initial state for the form
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "male",
    goal: "lose",
  });
  const [results, setResults] = useState({
    bmi: "",
    protein: "",
    carbs: "",
    fats: "",
    calories: "",
  });
  // State for the chart data
  const [chartData, setChartData] = useState([0, 0, 0]);

  // Update form data
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "radio" ? value : value,
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateResults();
    calculateMacros();
  };

  // Calculate macros based on form data
  const calculateMacros = () => {
    // Example calculations, replace these with your actual macro calculation logic
    const { weight, goal } = formData;
    let protein, carbs, fats;

    switch (goal) {
      case "lose":
        protein = weight * 2.2; // Example calculation
        carbs = weight * 1.8;
        fats = weight * 0.5;
        break;
      case "gain":
        protein = weight * 2.5;
        carbs = weight * 2.0;
        fats = weight * 0.6;
        break;
      case "gain_muscle":
        protein = weight * 2.8;
        carbs = weight * 2.2;
        fats = weight * 0.7;
        break;
      case "maintain":
        protein = weight * 2;
        carbs = weight * 1.5;
        fats = weight * 0.4;
        break;
      default:
        protein = 0;
        carbs = 0;
        fats = 0;
        break;
    }
  };
  const calculateResults = () => {
    const { height, weight, age, gender, goal } = formData;
    let bmi;
    let caloriesNeeded;
    bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);
    // Calculate BMR differently for male and female
    if (gender === "male") {
      caloriesNeeded = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      caloriesNeeded = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Adjust calories based on the goal
    switch (goal) {
      case "lose":
        caloriesNeeded -= 500;
        break;
      case "gain":
        caloriesNeeded += 500;
        break;
      case "gain_muscle":
        caloriesNeeded += 500;
        break;
      case "maintain":
      default:
        break;
    }

    const proteinPercent =
      goal === "lose"
        ? 0.25
        : goal === "gain" || goal === "gain_muscle"
        ? 0.3
        : 0.3;
    const carbsPercent = goal === "lose" ? 0.45 : goal === "gain" ? 0.55 : 0.5;
    const fatsPercent = goal === "lose" ? 0.3 : goal === "gain" ? 0.15 : 0.2;

    const proteinCalories = caloriesNeeded * proteinPercent;
    const carbsCalories = caloriesNeeded * carbsPercent;
    const fatsCalories = caloriesNeeded * fatsPercent;

    const proteinGrams = proteinCalories / 4;
    const carbsGrams = carbsCalories / 4;
    const fatsGrams = fatsCalories / 9;

    setResults({
      bmi: bmi,
      protein: proteinGrams.toFixed(0),
      carbs: carbsGrams.toFixed(0),
      fats: fatsGrams.toFixed(0),
      calories: caloriesNeeded.toFixed(0),
    });
    setChartData([proteinGrams, carbsGrams, fatsGrams]);
  };

  // Initialize or update the chart
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
    <div className="macro-container">
      <BackButton className="back-button" backText="Go Back" />
      <h1>Macro Calculator</h1>
      <div className="macro-form-container">
        <form onSubmit={handleSubmit}>
          <label>
            Height (cm):
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Weight (kg):
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Gender:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <br />
          <label>Goal:</label>
          <br />
          <label>
            <input
              type="radio"
              name="goal"
              value="lose"
              checked={formData.goal === "lose"}
              onChange={handleChange}
            />
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
            />
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
            />
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
            />
            Maintain weight
          </label>
          <br />
          <button type="submit">Calculate</button>
        </form>
      </div>
      {/* Display results */}
      <div className="macro-results-container">
        <h2>Results</h2>
        <p>BMI: {results.bmi}</p>
        <p>Protein: {results.protein}g</p>
        <p>Carbs: {results.carbs}g</p>
        <p>Fats: {results.fats}g</p>
        <p>Estimated Daily Calories Needed: {results.calories} kcal</p>
      </div>
      <div
        className="macro-chart-container"
        style={{ width: 400, height: 400 }}
      >
        <canvas id="macroChart"></canvas>
      </div>
    </div>
  );
};

export default MacroCalculator;
