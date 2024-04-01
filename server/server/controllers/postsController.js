const path = require("path");
const Post = require("../models/postModel");
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
  try {
    const [posts] = await db.query("SELECT * FROM posts");

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: {
        posts,
      },
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

// Additional controller functions (e.g., updatePost) can be implemented here.
