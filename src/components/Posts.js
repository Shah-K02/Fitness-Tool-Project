import React, { useState, useEffect } from "react";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null); // For storing the uploaded file
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("description", description);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newPost = response.data.post;

      setPosts((currentPosts) => [newPost, ...currentPosts]);

      // Clear the form
      setFile(null);
      setDescription("");
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  return (
    <div className="news">
      <div className="news-heading">
        <h2>Posts</h2>
        <p>Explore the latest posts from our community.</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="new-post-form"
        encType="multipart/form-data"
      >
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <textarea
          placeholder="Write a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Post</button>
      </form>
      <div className="post-container">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <img src={post.imageUrl} alt="Post" />
            <p>{post.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
