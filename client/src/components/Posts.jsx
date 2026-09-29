import React, { useCallback, useEffect, useState } from "react";
import useAxios from "../helpers/useAxios";
import "./Posts.css";
import { useUser } from "../helpers/UserContext";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = "image/jpeg,image/png,image/gif,image/webp";

const errorMessage = (error, fallback) => error.response?.data?.message || fallback;

const PostItem = ({ post, onDelete }) => {
  const { user } = useUser();
  const axios = useAxios();
  const [comments, setComments] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [error, setError] = useState(null);
  const isOwner = user && Number(user.id) === Number(post.user_id);

  const toggleComments = async () => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments === null) {
      try {
        const response = await axios.get(`/api/posts/${post.id}/comments`);
        setComments(response.data.data.comments || []);
      } catch (err) {
        setComments([]);
        setError(errorMessage(err, "Couldn't load comments."));
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    setError(null);
    try {
      await axios.post(`/api/posts/${post.id}/comments`, { text });
      const response = await axios.get(`/api/posts/${post.id}/comments`);
      setComments(response.data.data.comments || []);
      setCommentText("");
    } catch (err) {
      setError(errorMessage(err, "Couldn't post your comment."));
    }
  };

  const toggleLike = async () => {
    setError(null);
    // Update immediately, roll back if the server refuses.
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((count) => count + (wasLiked ? -1 : 1));
    try {
      if (wasLiked) await axios.delete(`/api/posts/${post.id}/unlike`);
      else await axios.post(`/api/posts/${post.id}/like`);
    } catch (err) {
      setLiked(wasLiked);
      setLikeCount((count) => count + (wasLiked ? 1 : -1));
      setError(errorMessage(err, "Couldn't update your like."));
    }
  };

  return (
    <article className="post-item">
      <img src={`${API_BASE}/${post.image}`} alt={post.description || "Post image"} loading="lazy" />
      {post.author_name && <p className="post-author">{post.author_name}</p>}
      {post.description && <p>{post.description}</p>}
      <div className="post-actions">
        <span>
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
        <button type="button" className="like-button" onClick={toggleLike} aria-pressed={liked}>
          {liked ? "Unlike" : "Like"}
        </button>
        <button type="button" className="like-button" onClick={toggleComments} aria-expanded={showComments}>
          {showComments ? "Hide comments" : "Comments"}
        </button>
        {isOwner && (
          <button type="button" className="like-button post-delete" onClick={() => onDelete(post)}>
            Delete
          </button>
        )}
      </div>
      {error && (
        <p className="post-error" role="alert">
          {error}
        </p>
      )}
      {showComments && (
        <div className="post-comments">
          {comments === null ? (
            <p className="post-muted">Loading comments&hellip;</p>
          ) : comments.length === 0 ? (
            <p className="post-muted">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <p key={comment.id}>
                <strong>{comment.userName}:</strong> {comment.text}
              </p>
            ))
          )}
          <form onSubmit={submitComment}>
            <label className="visually-hidden" htmlFor={`comment-${post.id}`}>
              Add a comment
            </label>
            <input
              id={`comment-${post.id}`}
              className="comment-input"
              type="text"
              maxLength={1000}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
            />
            <button className="submit-comment-button" type="submit" disabled={!commentText.trim()}>
              Post comment
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

const Posts = () => {
  const axios = useAxios();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [description, setDescription] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get("/api/posts");
      setPosts(response.data.data.posts || []);
      setLoadError(null);
    } catch (error) {
      setLoadError(errorMessage(error, "Couldn't load posts."));
    } finally {
      setIsLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleImageChange = (e) => {
    const chosen = e.target.files[0];
    setFormError(null);
    if (!chosen) return;
    if (!IMAGE_TYPES.split(",").includes(chosen.type)) {
      setFormError("Choose a JPEG, PNG, GIF or WebP image.");
      return;
    }
    if (chosen.size > MAX_IMAGE_BYTES) {
      setFormError("Images must be 5 MB or smaller.");
      return;
    }
    setFile(chosen);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(chosen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description.trim());

    setIsPosting(true);
    setFormError(null);
    try {
      await axios.post("/api/posts", formData);
      setFile(null);
      setDescription("");
      setImagePreview("");
      setFileInputKey((key) => key + 1);
      await fetchPosts();
    } catch (error) {
      setFormError(errorMessage(error, "Couldn't publish your post. Please try again."));
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (post) => {
    try {
      await axios.delete(`/api/posts/${post.id}`);
      setPosts((current) => current.filter((p) => p.id !== post.id));
    } catch (error) {
      setLoadError(errorMessage(error, "Couldn't delete that post."));
    }
  };

  return (
    <div className="post-container">
      <div className="post-heading">
        <h1>Posts</h1>
        <strong>Share your progress or your meals with the community!</strong>
      </div>
      <form onSubmit={handleSubmit} className="new-post-form">
        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
        <label className="visually-hidden" htmlFor="post-image">
          Image
        </label>
        <input
          key={fileInputKey}
          id="post-image"
          type="file"
          accept={IMAGE_TYPES}
          onChange={handleImageChange}
          required
        />
        <label className="visually-hidden" htmlFor="post-description">
          Description
        </label>
        <textarea
          id="post-description"
          value={description}
          maxLength={2000}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description to your post..."
        />
        {formError && (
          <p className="post-error" role="alert">
            {formError}
          </p>
        )}
        <button type="submit" disabled={!file || isPosting}>
          {isPosting ? "Posting…" : "Post"}
        </button>
      </form>
      {loadError && (
        <p className="post-error" role="alert">
          {loadError}
        </p>
      )}
      {isLoading ? (
        <p className="post-muted">Loading posts&hellip;</p>
      ) : posts.length > 0 ? (
        posts.map((post) => <PostItem key={post.id} post={post} onDelete={handleDelete} />)
      ) : (
        !loadError && <p className="post-muted">No posts yet. Be the first to share one.</p>
      )}
    </div>
  );
};

export default Posts;
