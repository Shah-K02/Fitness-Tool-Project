import React from "react";

const NutritionTips = () => {
  return (
    <div className="news">
      <div className="news-heading">
        <h1>Today's Nutrition Tips</h1>
      </div>
      <div className="news-container">
        <div className="news-item">
          <h2>Incorporate a Variety of Foods</h2>
          <p>
            Aim to include a diverse range of foods in your diet to ensure you
            get a broad spectrum of nutrients. Different colored fruits and
            vegetables provide various vitamins and minerals, while whole
            grains, lean proteins, and healthy fats are essential for overall
            health. This variety helps in covering the wide range of nutrients
            your body needs.
          </p>
        </div>
        <div className="news-item">
          <h2>Stay Hydrated</h2>
          <p>
            Water is crucial for your body's functions, including digestion,
            absorption, circulation, creation of saliva, transportation of
            nutrients, and maintenance of body temperature. Drinking enough
            water can also help with weight management by keeping you full and
            reducing the likelihood of mistaking thirst for hunger. Aim for
            about 8 glasses a day.
          </p>
        </div>
        <div className="news-item">
          <h2>Limit Added Sugars</h2>
          <p>
            Foods high in added sugars and heavily processed foods can be high
            in calories but low in nutrients, contributing to weight gain,
            cardiovascular diseases, and other health issues. Try to minimize
            the intake of sugary drinks, sweets, and processed snacks, focusing
            instead on whole foods that are as close to their natural state as
            possible
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutritionTips;
