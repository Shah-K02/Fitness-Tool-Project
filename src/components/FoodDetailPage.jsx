// FoodDetailPage.js
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import "./FoodDetailPage.css";
import BackButton from "./BackButton";
import NutrientRing from "./NutrientRing";
import axios from "axios";

const FoodDetailPage = () => {
  const { id } = useParams();
  const [foodDetails, setFoodDetails] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFoodDetailsAndUserInfo = async () => {
      setIsLoading(true);
      try {
        const foodDetailsResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/food/${id}`
        );
        setFoodDetails(foodDetailsResponse.data);

        const token = localStorage.getItem("token");
        if (token) {
          const userInfoResponse = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/user/info`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserInfo(userInfoResponse.data);
        }
        setIsLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodDetailsAndUserInfo();
  }, [id]);

  const energyNutrient = foodDetails?.foodNutrients.find(
    (nutrientItem) => nutrientItem.nutrient.name === "Energy"
  );
  const nutrientValues = useMemo(() => {
    return {
      protein: 0,
      carbs: 0,
      fats: 0,
      calories:
        foodDetails?.foodNutrients.find((n) => n.nutrient.name === "Energy")
          ?.amount || 0,
    };
  }, [foodDetails]);

  if (foodDetails) {
    foodDetails.foodNutrients.forEach((nutrient) => {
      switch (nutrient.nutrient.name) {
        case "Protein":
          nutrientValues.protein = nutrient.amount;
          break;
        case "Total lipid (fat)":
          nutrientValues.fats = nutrient.amount;
          break;
        case "Carbohydrate, by difference":
          nutrientValues.carbs = nutrient.amount;
          break;
        case "Energy":
          nutrientValues.calories = nutrient.amount;
          break;
        default:
          break;
      }
    });
  }

  const logFood = async () => {
    if (!userInfo) {
      alert("Please log in to log food");
      return;
    }

    const logTimeMySQLFormat = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);
    const logDetails = {
      food_id: id,
      description: foodDetails.description,
      log_time: logTimeMySQLFormat,
      protein: nutrientValues.protein,
      carbs: nutrientValues.carbs,
      fats: nutrientValues.fats,
      calories: nutrientValues.calories,
      user_id: userInfo.id,
    };

    try {
      await axios.post("/api/log/food", logDetails, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Food logged successfully!");
    } catch (error) {
      console.error("Error logging food:", error);
      alert(error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!foodDetails) return <div>No details available</div>;

  return (
    <div>
      <BackButton className="back-button" backText=" Back" />

      <h1>{foodDetails?.description || "N/A"}</h1>
      <NutrientRing
        values={{
          protein: nutrientValues.protein,
          carbs: nutrientValues.carbs,
          fats: nutrientValues.fats,
        }}
        size={200}
        strokeWidth={15}
        calories={energyNutrient ? energyNutrient.amount : 0} // Pass the calories to the NutrientRing
      />
      <br />
      <div className="food-info">
        <p>
          <strong>Food Category:</strong>
          <br />{" "}
          {foodDetails?.wweiaFoodCategory?.wweiaFoodCategoryDescription ||
            foodDetails?.brandedFoodCategory ||
            "N/A"}
        </p>
        <p>
          <strong>Brand Name:</strong> <br /> {foodDetails?.brandName ?? "N/A"}
        </p>
        <p>
          <strong>Food Description:</strong> <br />
          {foodDetails?.description ?? "N/A"}
        </p>
        <p>
          <strong>Serving Size:</strong>
          <br />{" "}
          {foodDetails?.servingSize
            ? `${foodDetails.servingSize} ${
                foodDetails?.servingSizeUnit ?? ""
              }`.trim()
            : foodDetails?.foodPortions?.[0]?.portionDescription ?? "N/A"}
        </p>

        <button onClick={logFood} className="log-food-button2">
          Log This Food
        </button>
      </div>
      <br />
      <div className="label">
        <header>
          <h2 className="bold">Nutrients:</h2>
          <div className="divider"></div>
          <p className="bold">
            <strong>Serving Size:</strong>{" "}
            <span className="right">
              {foodDetails?.servingSize ?? "N/A"} {foodDetails.servingSizeUnit}
            </span>
          </p>
        </header>
        <div className="divider lg"></div>
        <ul>
          <div className="calories-info">
            <h2>
              {energyNutrient && (
                <p>
                  <strong>Energy:</strong>{" "}
                  <span className="right">
                    {energyNutrient.amount} {energyNutrient.nutrient.unitName}
                  </span>
                </p>
              )}
            </h2>
          </div>
          <div className="divider md"></div>
          {foodDetails.foodNutrients.map(
            (nutrientItem) =>
              nutrientItem.nutrient.name !== "Energy" && (
                <React.Fragment key={nutrientItem.nutrient.id}>
                  <p>
                    {nutrientItem.nutrient.name} (
                    {nutrientItem.nutrient.unitName}):
                    <span className="right"> {nutrientItem.amount}</span>
                  </p>
                  <div className="divider"></div>
                </React.Fragment>
              )
          )}
        </ul>
      </div>
    </div>
  );
};

export default FoodDetailPage;
