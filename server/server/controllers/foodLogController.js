const db = require("../db");
const FoodLog = require("../models/FoodLog");

const LOG_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})(?::(\d{2}))?$/;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// True when the matched parts form a real calendar date and time
// (rejects e.g. 2026-02-30 or 25:00).
const isRealDateTime = (match) => {
  if (!match) return false;
  const [, y, mo, d, h = "0", mi = "0", s = "0"] = match;
  const date = new Date(Date.UTC(+y, +mo - 1, +d));
  return (
    date.getUTCFullYear() === +y &&
    date.getUTCMonth() === +mo - 1 &&
    date.getUTCDate() === +d &&
    +h < 24 &&
    +mi < 60 &&
    +s < 60
  );
};

// Non-negative amount up to a sanity cap; missing → 0, invalid → null.
const amount = (value, max) => {
  if (value === undefined || value === null || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= max ? Math.round(n * 100) / 100 : null;
};

exports.createLog = async (req, res) => {
  const { food_id, description, log_time } = req.body;
  const nutrients = {
    protein: amount(req.body.protein, 2000),
    carbs: amount(req.body.carbs, 2000),
    fats: amount(req.body.fats, 2000),
    calories: amount(req.body.calories, 20000),
  };

  if (
    !food_id ||
    String(food_id).length > 255 ||
    typeof description !== "string" ||
    !description.trim() ||
    description.length > 255 ||
    typeof log_time !== "string" ||
    !isRealDateTime(log_time.match(LOG_TIME_PATTERN)) ||
    Object.values(nutrients).some((n) => n === null)
  ) {
    return res.status(400).json({ message: "That food entry isn't valid." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO food_logs (food_id, description, log_time, protein, carbs, fats, calories, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        String(food_id),
        description.trim(),
        log_time,
        nutrients.protein,
        nutrients.carbs,
        nutrients.fats,
        nutrients.calories,
        req.userId,
      ]
    );
    res.status(201).json({ message: "Food logged successfully", id: result.insertId });
  } catch (err) {
    console.error("Failed to log food:", err.message);
    res.status(500).json({ message: "Couldn't log that food. Please try again." });
  }
};

exports.deleteLog = async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(404).json({ message: "Entry not found" });
  }
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
    console.error("Failed to delete food log:", err.message);
    res.status(500).json({ message: "Couldn't remove that entry." });
  }
};

exports.getLogsByDate = async (req, res) => {
  const { date } = req.params;
  if (!isRealDateTime(String(date).match(DATE_PATTERN))) {
    return res.status(400).json({ message: "Use a date in YYYY-MM-DD format." });
  }

  try {
    const logs = await FoodLog.findByDate(req.userId, date);
    res.json(logs);
  } catch (error) {
    console.error("Error fetching food logs:", error.message);
    res.status(500).json({ message: "Couldn't load your food log." });
  }
};
