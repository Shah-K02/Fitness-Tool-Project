// FoodDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const FoodDetailPage = () => {
  const { id } = useParams();
  const [foodDetails, setFoodDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFoodDetails = async () => {
      console.log(foodDetails);

      setIsLoading(true);
      try {
        const response = await fetch(`/api/food/${id}`);
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
      <h1>{foodDetails.description}</h1>
      <p>
        <strong>Food Category:</strong> {foodDetails.foodCategory}
      </p>
      <p>
        <strong>Additional Descriptions:</strong>{" "}
        {foodDetails.additionalDescriptions}
      </p>
      <h2>Nutrients:</h2>
      <ul>
        {foodDetails.foodNutrients.map((nutrientItem) => (
          <li key={nutrientItem.nutrient.id}>
            {nutrientItem.nutrient.name} ({nutrientItem.nutrient.unitName}):{" "}
            {nutrientItem.amount}
          </li>
        ))}
      </ul>
      {/* Add more details here using the same pattern */}
    </div>
  );
};

export default FoodDetailPage;
