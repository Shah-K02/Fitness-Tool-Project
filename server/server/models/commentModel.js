// commentModel.js
const db = require("../db");

// The comments table uses camelCase columns (postId, userId, createdAt).
class CommentModel {
  static async findByPostId(postId) {
    const [rows] = await db.query("SELECT * FROM comments WHERE postId = ?", [postId]);
    return rows;
  }

  static async create(postId, userId, text) {
    const [result] = await db.query(
      "INSERT INTO comments (postId, userId, text) VALUES (?, ?, ?)",
      [postId, userId, text]
    );
    return { id: result.insertId, postId: Number(postId), userId, text };
  }
}

module.exports = CommentModel;
