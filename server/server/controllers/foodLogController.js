const db = require("../../config/db");
const FoodLog = require("../models/FoodLog");

exports.createLog = async (req, res) => {
  const { food_id, description, log_time, protein, carbs, fats, calories } =
    req.body;
  const user_id = req.userId;
  const query =
    "INSERT INTO food_logs (food_id, description, log_time, protein, carbs, fats, calories, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [food_id, description, log_time, protein, carbs, fats, calories, user_id],
    (err, result) => {
      if (err) {
        console.error("Failed to log food:", err);
        return res.status(500).send("Failed to log food");
      }
      res.status(201).json({ message: "Food logged successfully" });
    }
  );
};

exports.getLogsByDate = async (req, res) => {
  const user_id = req.userId;
  const date = req.params.date;

  try {
    const logs = await FoodLog.findByDate(
      user_id,
      date.toISOString().split("T")[0]
    );
    res.json(
      logs.map((logs) => {
        return {
          ...logs,
          log_time: new Date(log.log_time).toISOString(),
        };
      })
    );
  } catch (error) {
    res.status(500).send("Error fetching food logs");
  }
};
