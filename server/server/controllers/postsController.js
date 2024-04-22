const Post = require("../models/postModel");
const CommentModel = require("../models/commentModel");
const db = require("../../config/db");

exports.createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const image = req.file.path; // Path where the image is saved
    const userId = req.userId;

    const [result] = await db.query(
      "INSERT INTO posts (description, image, user_id) VALUES (?, ?, ?)",
      [description, image, userId]
    );

    res.status(201).json({
      status: "success",
      data: {
        post: {
          id: result.insertId,
          description,
          image,
          userId,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Fetch all posts
exports.getAllPosts = async (req, res) => {
  const userId = req.userId;
  try {
    const posts = (await Post.findAll(userId)) || [];
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: { posts },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Fetch a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "No post found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "No post found with that ID",
      });
    }
    res.status(204).json({
      status: "success",
      data: null, // 204 No Content
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.createComment = async (req, res) => {
  const { text, userId } = req.body;
  const { postId } = req.params;

  if (!text || !userId || !postId) {
    return res.status(400).json({
      status: "fail",
      message:
        "Missing required fields. Ensure text, userId, and postId are provided.",
    });
  }

  try {
    const comment = await CommentModel.create(postId, userId, text);
    return res.status(201).json({
      status: "success",
      data: { comment },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({
      status: "fail",
      message: "Server error while creating comment: " + error.message,
    });
  }
};

exports.getCommentsByPostId = async (req, res) => {
  const postId = req.params.postId;
  try {
    const [comments] = await db.query(
      `SELECT c.id, c.postId, c.userId, c.text, c.createdAt, ui.name AS userName
      FROM comments c
      JOIN users_info ui ON c.userId = ui.user_id
      WHERE c.postId = ?`,
      [postId]
    );
    // Ensure comments is always an array
    res.status(200).json({
      status: "success",
      data: { comments: comments || [] },
    });
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    res.status(500).json({
      status: "fail",
      message: "Error retrieving comments: " + error.message,
    });
  }
};

// In postsController.js
exports.likePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.userId;

  try {
    const result = await Post.like(postId, userId);
    res
      .status(201)
      .json({ status: "success", message: "Liked successfully", data: result });
  } catch (error) {
    console.error("Failed to like post:", error);
    if (error.message === "Post already liked by this user") {
      res.status(409).json({ status: "fail", message: error.message });
    } else {
      res
        .status(500)
        .json({ status: "fail", message: "Server error: " + error.message });
    }
  }
};

exports.unlikePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.userId;

  try {
    const result = await Post.unlike(postId, userId);
    res.status(204).json({
      status: "success",
      message: "Unliked successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error unliking the post:", error);
    res
      .status(500)
      .json({ status: "fail", message: "Failed to unlike the post." });
  }
};

// Get like count for a post
exports.getLikeCount = async (req, res) => {
  const postId = req.params.postId;

  try {
    const [likes] = await db.query(
      "SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?",
      [postId]
    );
    res.status(200).json({ status: "success", data: likes[0] });
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};
