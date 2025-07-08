// commentModel.js
const db = require("../../config/db");

class CommentModel {
  static async findByPostId(postId) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM comments WHERE post_id = ?",
        [postId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(postId, userId, text) {
    try {
      const [result] = await db.query(
        "INSERT INTO comments (post_id, user_id, text) VALUES (?, ?, ?)",
        [postId, userId, text]
      );
      return { id: result.insertId, postId, userId, text };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CommentModel;
