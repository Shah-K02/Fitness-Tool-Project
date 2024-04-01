// postModel.js
const db = require("../../config/db");

class PostModel {
  // Fetch all posts
  static async findAll() {
    try {
      const [rows] = await db.query("SELECT * FROM posts");
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Find a post by ID
  static async findById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new post
  static async create({ description, image, userId }) {
    try {
      const [result] = await db.query(
        "INSERT INTO posts (description, image, user_id) VALUES (?, ?, ?)",
        [description, image, userId]
      );
      return { id: result.insertId, description, image, userId };
    } catch (error) {
      throw error;
    }
  }

  // Update a post by ID
  static async updateById(id, { description, image }) {
    try {
      await db.query(
        "UPDATE posts SET description = ?, image = ? WHERE id = ?",
        [description, image, id]
      );
      return { id, description, image };
    } catch (error) {
      throw error;
    }
  }

  // Delete a post by ID
  static async deleteById(id) {
    try {
      await db.query("DELETE FROM posts WHERE id = ?", [id]);
      return { message: "Post deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PostModel;
