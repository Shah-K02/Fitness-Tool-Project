import React from "react";

const NewsSection = () => {
  return (
    <div className="news">
      <div className="news-heading">
        <h1>Latest News</h1>
        <strong>
          Here is the latest news from our company. We have been working hard to
          bring you the best products and services.
        </strong>
      </div>
      <div className="news-container">
        <div className="news-item">
          <img src="NewsImg1.jpg" alt="Image 1" />
          <h2>
            Study Finds High-Intensity Interval Training (HIIT) Most Effective
            for Rapid Fitness Gains
          </h2>
        </div>
        <div className="news-item">
          <img src="Mediterrenean-food.jpg" alt="Image 2" />
          <a href="https://www.freepik.com/free-vector/illustration-gallery-icon_2922280.htm#query=placeholder&position=0&from_view=keyword&track=sph&uuid=a218c410-d8f6-45ef-89aa-b36719c05cdb"></a>{" "}
          <h2>
            Major Study Reveals the Long-Term Benefits of Mediterranean Diet on
            Heart Health
          </h2>
        </div>
        <div className="news-item">
          <img src="NewsImg3.jpg" alt="Image 3" />
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
