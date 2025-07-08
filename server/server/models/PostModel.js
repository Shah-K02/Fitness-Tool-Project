// postModel.js
const db = require("../../config/db");

class PostModel {
  // Fetch all posts
  static async findAll(userId) {
    try {
      const [rows, fields] = await db.query(
        `
        SELECT p.*, 
               EXISTS(
                 SELECT 1 
                 FROM likes 
                 WHERE post_id = p.id AND user_id = ?
               ) as liked
        FROM posts p
      `,
        [userId]
      );
      return rows.map((post) => ({
        ...post,
        liked: post.liked === 1, // Convert to boolean for easier frontend handling
      }));
    } catch (error) {
      console.error("Database query failed:", error);
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

  // Like a post
  static async like(postId, userId) {
    try {
      const [result] = await db.query(
        "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
        [postId, userId]
      );
      return {
        message: "Post liked successfully",
        affectedRows: result.affectedRows,
      };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Post already liked by this user");
      }
      throw error;
    }
  }

  // Unlike a post
  static async unlike(postId, userId) {
    try {
      const [result] = await db.query(
        "DELETE FROM likes WHERE post_id = ? AND user_id = ?",
        [postId, userId]
      );
      if (result.affectedRows === 0) {
        throw new Error("Like not found or already removed");
      }
      return {
        message: "Post unliked successfully",
        affectedRows: result.affectedRows,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PostModel;
