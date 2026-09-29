import React from "react";
import NewsImg1 from "../../assets/news-hiit.jpg";
import NewsImg2 from "../../assets/news-mediterranean.jpg";
import NewsImg3 from "../../assets/news-fitness-challenge.jpg";

const NewsSection = () => {
  return (
    <div className="news">
      <div className="news-heading">
        <h1>Clippings</h1>
        <strong>
          Here is the latest news from our company. We have been working hard to
          bring you the best products and services.
        </strong>
      </div>
      <div className="news-container">
        <div className="news-item">
          <img src={NewsImg1} alt="Woman lifting a dumbbell during a strength workout" />
          <h2>
            Study Finds High-Intensity Interval Training (HIIT) Most Effective
            for Rapid Fitness Gains
          </h2>
        </div>
        <div className="news-item">
          <img src={NewsImg2} alt="A Mediterranean spread of flatbread, olives, and tomatoes" />
          <h2>
            Major Study Reveals the Long-Term Benefits of Mediterranean Diet on
            Heart Health
          </h2>
        </div>
        <div className="news-item">
          <img src={NewsImg3} alt="A group of runners competing in an outdoor marathon" />
          <h2>
            Global Fitness Challenge Promotes Physical Activity with Charitable
            Giving
          </h2>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
