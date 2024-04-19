import React, { useState, useEffect } from "react";
import useAxios from "../helpers/useAxios";
import "./Posts.css";

const PostItem = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const axios = useAxios();

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/posts/${post.id}/comments`
      );
      setComments(response.data.data.comments || []); // Ensure comments is always an array
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]); // Set comments to an empty array in case of an error
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/posts/${post.id}/comments`,
        { text: commentText }
      );
      setComments([...comments, response.data.data.comment]);
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id]); // Added dependency on post.id to refetch comments when the post changes

  return (
    <div className="post-item">
      <img src={post.imageUrl} alt="Post" />
      <p>{post.description}</p>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">Comment</button>
      </form>
      {comments.map((comment) => (
        <div key={comment.id}>{comment.text}</div>
      ))}
    </div>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const axios = useAxios();

  useEffect(() => {
    fetchPosts();
  }, []); // Dependency array left empty to only run once on mount

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(response.data.posts || []); // Ensure posts is always an array
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]); // Set posts to an empty array in case of an error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/posts`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data && response.data.post && response.data.post.imageUrl) {
        setPosts([response.data.post, ...posts]);
      } else {
        console.error("Error uploading post:", response.data);
      }
      setFile(null);
      setDescription("");
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/posts/like`, {
        postId,
      });
      const updatedPosts = posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div className="post-container">
      <h1>Posts</h1>
      <form onSubmit={handleSubmit} className="new-post-form">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Post</button>
      </form>
      {posts.length > 0 ? (
        posts.map((post) => (
          <React.Fragment key={post.id}>
            <PostItem post={post} />
            <button onClick={() => handleLike(post.id)}>Like</button>
          </React.Fragment>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Posts;
