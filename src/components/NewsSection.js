import React from "react";

const NewsSection = () => {
  return (
    <div className="news">
      <div className="news-heading">
        <h2>Latest News</h2>
        <p>
          Here is the latest news from our company. We have been working hard to
          bring you the best products and services.
        </p>
      </div>
      <div className="news-container">
        <div className="news-item">
          <img src="images/img4.jpg" alt="Image 1" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum,
            expedita soluta? Earum non natus vero veniam ipsa aperiam tempore
            unde, quam dolores voluptatum modi ea ducimus, quae itaque ratione
            illum!
          </p>
        </div>
        <div className="news-item">
          <img src="images/img4.jpg" alt="Image 2" />{" "}
          <a href="https://www.freepik.com/free-vector/illustration-gallery-icon_2922280.htm#query=placeholder&position=0&from_view=keyword&track=sph&uuid=a218c410-d8f6-45ef-89aa-b36719c05cdb">
            Image by rawpixel.com
          </a>{" "}
          on Freepik
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
            necessitatibus repellat temporibus provident ad ea nesciunt rem?
            Velit, eos nam accusantium assumenda ducimus asperiores,
            reprehenderit odit doloremque sapiente impedit odio.
          </p>
        </div>
        <div className="news-item">
          <img src="images/img4.jpg" alt="Image 3" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea harum
            sit eos! Impedit nam repellendus aperiam ut doloremque alias eos
            aliquam id! Ipsam numquam commodi, laudantium magnam velit
            perspiciatis doloribus!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
