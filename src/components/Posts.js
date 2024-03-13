import React, { useState, useEffect } from "react";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ imageUrl: "", description: "" });
  const [file, setFile] = useState(null); // For storing the uploaded file
  const [description, setDescription] = useState("");
  useEffect(() => {
    const fetchPosts = async () => {
      // Fetching posts logic...
    };

    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append("image", file); // "image" is the key your server expects
    }
    formData.append("description", description);

    try {
      // Adjust the endpoint as necessary
      const response = await axios.post(
        "http://localhost:8081/api/posts/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Handle response, update state as before
      setFile(null); // Clear the selected file
      setDescription(""); // Clear the description
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
      {/* Form for creating a new post */}
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
