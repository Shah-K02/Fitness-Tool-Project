const fs = require("fs");
const path = require("path");
const Post = require("../models/postModel");
const CommentModel = require("../models/commentModel");
const db = require("../db");
const config = require("../config");

const DESCRIPTION_MAX = 2000;
const COMMENT_MAX = 1000;

const fail = (res, status, message) => res.status(status).json({ status: "fail", message });

const validId = (value) => /^\d+$/.test(String(value));

const removeUpload = (imagePath) => {
  if (!imagePath) return;
  // Only ever delete inside the uploads folder.
  const file = path.join(config.uploadsDir, path.basename(imagePath));
  fs.unlink(file, () => {});
};

exports.createPost = async (req, res) => {
  const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
  if (!req.file) return fail(res, 400, "Choose an image to post.");
  if (description.length > DESCRIPTION_MAX) {
    removeUpload(req.file.filename);
    return fail(res, 400, `Keep the description under ${DESCRIPTION_MAX} characters.`);
  }

  // Stored as a URL path the client can load: uploads/<file>.
  const image = `uploads/${req.file.filename}`;
  try {
    const post = await Post.create({ description, image, userId: req.userId });
    res.status(201).json({ status: "success", data: { post } });
  } catch (error) {
    removeUpload(req.file.filename);
    console.error("Failed to create post:", error.message);
    fail(res, 500, "Couldn't create your post. Please try again.");
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll(req.userId);
    res.status(200).json({ status: "success", results: posts.length, data: { posts } });
  } catch (error) {
    console.error("Failed to fetch posts:", error.message);
    fail(res, 500, "Couldn't load posts.");
  }
};

exports.getPostById = async (req, res) => {
  if (!validId(req.params.postId)) return fail(res, 404, "Post not found.");
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return fail(res, 404, "Post not found.");
    res.status(200).json({ status: "success", data: { post } });
  } catch (error) {
    console.error("Failed to fetch post:", error.message);
    fail(res, 500, "Couldn't load that post.");
  }
};

exports.deletePost = async (req, res) => {
  if (!validId(req.params.postId)) return fail(res, 404, "Post not found.");
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return fail(res, 404, "Post not found.");
    // Only the author can delete their post.
    if (post.user_id !== req.userId) return fail(res, 403, "You can only delete your own posts.");

    await Post.deleteById(post.id);
    removeUpload(post.image);
    res.status(204).end();
  } catch (error) {
    console.error("Failed to delete post:", error.message);
    fail(res, 500, "Couldn't delete that post.");
  }
};

exports.createComment = async (req, res) => {
  const { postId } = req.params;
  const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

  if (!validId(postId)) return fail(res, 404, "Post not found.");
  if (!text) return fail(res, 400, "Write a comment first.");
  if (text.length > COMMENT_MAX) return fail(res, 400, `Keep comments under ${COMMENT_MAX} characters.`);

  try {
    // The author is always the signed-in user, never a value from the request.
    const comment = await CommentModel.create(postId, req.userId, text);
    res.status(201).json({ status: "success", data: { comment } });
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") return fail(res, 404, "Post not found.");
    console.error("Failed to create comment:", error.message);
    fail(res, 500, "Couldn't post your comment.");
  }
};

exports.getCommentsByPostId = async (req, res) => {
  if (!validId(req.params.postId)) return fail(res, 404, "Post not found.");
  try {
    const [comments] = await db.query(
      `SELECT c.id, c.postId, c.userId, c.text, c.createdAt, ui.name AS userName
       FROM comments c
       JOIN users_info ui ON c.userId = ui.user_id
       WHERE c.postId = ?
       ORDER BY c.createdAt`,
      [req.params.postId]
    );
    res.status(200).json({ status: "success", data: { comments } });
  } catch (error) {
    console.error("Failed to fetch comments:", error.message);
    fail(res, 500, "Couldn't load comments.");
  }
};

exports.likePost = async (req, res) => {
  if (!validId(req.params.postId)) return fail(res, 404, "Post not found.");
  try {
    const result = await Post.like(req.params.postId, req.userId);
    res.status(201).json({ status: "success", message: "Liked successfully", data: result });
  } catch (error) {
    if (error.message === "Post already liked by this user") return fail(res, 409, error.message);
    if (error.code === "ER_NO_REFERENCED_ROW_2") return fail(res, 404, "Post not found.");
    console.error("Failed to like post:", error.message);
    fail(res, 500, "Couldn't like that post.");
  }
};

exports.unlikePost = async (req, res) => {
  if (!validId(req.params.postId)) return fail(res, 404, "Post not found.");
  try {
    await Post.unlike(req.params.postId, req.userId);
    res.status(204).end();
  } catch (error) {
    if (error.message === "Like not found or already removed") return fail(res, 404, error.message);
    console.error("Failed to unlike post:", error.message);
    fail(res, 500, "Couldn't unlike that post.");
  }
};

exports.getLikeCount = async (req, res) => {
  if (!validId(req.params.postId)) return fail(res, 404, "Post not found.");
  try {
    const [likes] = await db.query(
      "SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?",
      [req.params.postId]
    );
    res.status(200).json({ status: "success", data: likes[0] });
  } catch (error) {
    console.error("Failed to count likes:", error.message);
    fail(res, 500, "Couldn't load likes.");
  }
};
