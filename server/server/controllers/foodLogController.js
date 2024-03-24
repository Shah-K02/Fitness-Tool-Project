const db = require("../../config/db");

exports.createLog = async (req, res) => {
  const {
    food_id,
    description,
    log_time,
    protein,
    carbs,
    fats,
    calories,
    user_id,
  } = req.body;
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
