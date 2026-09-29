const db = require("../../config/db");
const FoodLog = require("../models/FoodLog");

exports.createLog = async (req, res) => {
  const { food_id, description, log_time, protein, carbs, fats, calories } =
    req.body;
  const user_id = req.userId;
  const query =
    "INSERT INTO food_logs (food_id, description, log_time, protein, carbs, fats, calories, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  try {
    const [result] = await db.query(query, [
      food_id,
      description,
      log_time,
      protein,
      carbs,
      fats,
      calories,
      user_id,
    ]);
    res
      .status(201)
      .json({ message: "Food logged successfully", id: result.insertId });
  } catch (err) {
    console.error("Failed to log food:", err);
    res.status(500).send("Failed to log food");
  }
};

exports.deleteLog = async (req, res) => {
  try {
    // Scoped to the signed-in user so nobody can delete another user's entry.
    const [result] = await db.query(
      "DELETE FROM food_logs WHERE id = ? AND user_id = ?",
      [req.params.id, req.userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(204).end();
  } catch (err) {
    console.error("Failed to delete food log:", err);
    res.status(500).json({ message: "Failed to delete entry" });
  }
};

const moment = require("moment");

exports.getLogsByDate = async (req, res) => {
  const userId = req.userId;
  const date = req.params.date;

  // Validate date format
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).send("Invalid date format. Please use YYYY-MM-DD.");
  }

  try {
    const logs = await FoodLog.findByDate(userId, date);
    res.json(logs);
  } catch (error) {
    console.error("Error fetching food logs:", error);
    res.status(500).send("Error fetching food logs");
  }
};
