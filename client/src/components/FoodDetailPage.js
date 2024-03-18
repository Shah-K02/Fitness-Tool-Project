// FoodDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./FoodDetailPage.css";
import BackButton from "./BackButton";

const FoodDetailPage = () => {
  const { id } = useParams();
  const [foodDetails, setFoodDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const energyNutrient = foodDetails?.foodNutrients.find(
    (nutrientItem) => nutrientItem.nutrient.name === "Energy"
  );

  console.log(foodDetails);
  useEffect(() => {
    const fetchFoodDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/food/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch food details");
        }
        const data = await response.json();
        setFoodDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!foodDetails) return <div>No details available</div>;

  return (
    <div>
      <BackButton className="back-button" backText=" Back" />
      <h1>{foodDetails.description}</h1>
      <p>
        <strong>Food Category:</strong> {foodDetails.foodCategory}
      </p>
      <p>
        <strong>Additional Descriptions:</strong>{" "}
        {foodDetails.additionalDescriptions}
      </p>

      <div className="label">
        <header>
          <h2 className="bold">Nutrients:</h2>
          <div className="divider"></div>
          <p className="bold">
            <strong>Serving Size:</strong>{" "}
            <span className="right">
              {foodDetails.servingSize} {foodDetails.servingSizeUnit}
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
        {/* Add more details here using the same pattern */}
      </div>
    </div>
  );
};

export default FoodDetailPage;
