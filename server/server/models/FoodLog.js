const db = require("../../config/db");

class FoodLog {
  static async create(logData) {
    const { userId, date, meal, foods } = logData;

    const query = {
      text: `
            INSERT INTO food_logs (user_id, date, meal, foods)
            VALUES ($1, $2, $3, $4)
        `,
      values: [userId, date, meal, foods],
    };

    await db.query(query);
    console.log(result);
  }

  static async findByDate(userId, date) {
    const query = {
      text: `
            SELECT * FROM food_logs
            WHERE user_id = $1 AND date = $2
        `,
      values: [userId, date],
    };

    const result = await db.query(query);
    console.log(result);
    return result.rows;
  }
}

module.exports = FoodLog;
