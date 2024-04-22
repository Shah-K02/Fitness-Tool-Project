import React, { useState, useEffect } from "react";
import useAxios from "../helpers/useAxios";
import "./Posts.css";
import { useUser } from "../helpers/UserContext";

const PostItem = ({ post, onLike }) => {
  const [comments, setComments] = useState([]);
  const { user } = useUser();
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showCommentInput, setShowCommentInput] = useState(false); // Added state to toggle comments visibility
  const axios = useAxios();

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/posts/${post.id}/comments`
      );

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.comments)
      ) {
        setComments(response.data.data.comments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() === "") {
      alert("Comment cannot be empty!");
      return;
    }

    if (!user) {
      alert("You must be logged in to comment!");
      return;
    }

    const payload = { text: commentText, userId: user.id };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/posts/${post.id}/comments`,
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data && response.data.data && response.data.data.comment) {
        setComments([...comments, response.data.data.comment]);
        setCommentText("");
        setShowCommentInput(false);
      } else {
        console.error(
          "Comment was not returned from the server:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const toggleCommentsVisibility = () => {
    setShowCommentInput(!showCommentInput);
    if (!showCommentInput && comments.length === 0) {
      fetchComments();
    }
  };

  const checkIfLiked = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/posts/${post.id}/likes`
      );
      setLiked(response.data.data.liked);
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/posts/${post.id}/likes`
      );
      setLikeCount(response.data.data.likeCount);
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  // In PostItem component
  const handleLike = async (postId) => {
    try {
      if (!liked) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}/like`
        );
        if (response.status === 201) {
          setLiked(true);
          setLikeCount(likeCount + 1);
        }
      } else {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/api/posts/${postId}/unlike`
        );
        if (response.status === 204) {
          setLiked(false);
          setLikeCount(likeCount - 1);
        }
      }
    } catch (error) {
      console.error(
        "Error processing like/unlike:",
        error.response?.data?.message || "Network error"
      );
    }
  };

  useEffect(() => {
    fetchComments();
    checkIfLiked();
    fetchLikeCount();
  }, [post.id]); // Added dependency on post.id to refetch comments when the post changes

  return (
    <div className="post-item">
      <div>
        <img
          src={`${process.env.REACT_APP_API_BASE_URL}/${post.image}`}
          alt="Post"
        />
        <p>{post.description}</p>
        <span>{likeCount} likes</span>
        <button className="like-button" onClick={() => handleLike(post.id)}>
          {liked ? "Unlike" : "Like"}
        </button>
      </div>
      <button className="like-button" onClick={toggleCommentsVisibility}>
        Comment
      </button>
      {showCommentInput && (
        <form onSubmit={handleCommentSubmit}>
          <input
            className="comment-input"
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
          />
          <button
            className="submit-comment-button"
            type="submit"
            disabled={!user}
          >
            Submit
          </button>
        </form>
      )}
      {Array.isArray(comments) &&
        comments.map((comment) => (
          <div key={comment.id}>
            <p>
              <strong>{comment.userName}:</strong> {comment.text}
            </p>
          </div>
        ))}
    </div>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // Added state to preview image before uploading
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
      setPosts(response.data.data.posts || []); // Ensure posts is always an array
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
      setImagePreview("");
    } catch (error) {
      console.error("Error uploading post:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="image-preview" />
        )}
        <input type="file" onChange={handleImageChange} required />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Add a description to your post..."
        />
        <button type="submit" disabled={!file}>
          Post
        </button>
      </form>
      {posts.length > 0 ? (
        posts.map((post) => (
          <React.Fragment key={post.id}>
            <PostItem post={post} onLike={handleLike} />
          </React.Fragment>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Posts;
