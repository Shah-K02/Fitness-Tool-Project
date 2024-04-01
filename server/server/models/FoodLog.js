const db = require("../../config/db");

class FoodLog {
  static async create(logData) {
    const {
      food_id,
      description,
      log_time,
      protein,
      carbs,
      fats,
      calories,
      user_id,
    } = logData;

    const query = `
      INSERT INTO food_logs (food_id, description, log_time, protein, carbs, fats, calories, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const result = await db.query(query, [
        food_id,
        description,
        log_time,
        protein,
        carbs,
        fats,
        calories,
        user_id,
      ]);
      console.log(result);
      return result;
    } catch (error) {
      console.error("Failed to create food log:", error);
      throw error; // Rethrow the error to be caught in the controller
    }
  }

  static async findByDate(userId, date) {
    const query = `
      SELECT * FROM food_logs
      WHERE user_id = ? AND DATE(log_time) = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [userId, date], (error, results) => {
        if (error) {
          console.error("Failed to execute query:", error);
          reject(error);
        } else {
          console.log("Query result:", results);
          resolve(results);
        }
      });
    });
  }
}

module.exports = FoodLog;
