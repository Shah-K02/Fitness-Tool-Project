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
  try {
    const posts = (await Post.findAll()) || [];
    console.log("Posts fetched:", posts); // Check the content of posts
    console.log("Sending posts data:", {
      status: "success",
      results: posts.length,
      data: { posts },
    });
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (error) {
    console.log("Error fetching posts:", error);
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
  try {
    const { text } = req.body;
    const postId = req.params.postId;
    const userId = req.userId;

    const comment = await CommentModel.create(postId, userId, text);
    res.status(201).json({ status: "success", data: { comment } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await CommentModel.findByPostId(postId);
    res.status(200).json({ status: "success", data: { comments } });
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};

// Additional controller functions (e.g., updatePost) can be implemented here.
