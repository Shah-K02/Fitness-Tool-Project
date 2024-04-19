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

const moment = require("moment");

exports.getLogsByDate = async (req, res) => {
  const userId = req.userId;
  const date = req.params.date;

  // Validate date format
  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).send("Invalid date format. Please use YYYY-MM-DD.");
  }

  console.log(`Fetching logs for user ${userId} and date ${date}`);

  try {
    const logs = await FoodLog.findByDate(userId, date);
    console.log(`Found logs: ${logs.length}`);
    res.json(logs);
  } catch (error) {
    console.error("Error fetching food logs:", error);
    res.status(500).send("Error fetching food logs");
  }
};
