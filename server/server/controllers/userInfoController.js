const db = require("../db");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const GENDERS = ["male", "female", "other"];
const ACTIVITY_LEVELS = [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "very_active",
  "extra_active",
];

exports.fetchUserInfo = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT name, email, birthday, gender, height, weight, bmi, activityLevel FROM users_info WHERE user_id = ?",
      [req.userId]
    );
    if (results.length === 0) {
      return res.status(404).json({ message: "Profile not found." });
    }
    res.json(results[0]);
  } catch (err) {
    console.error("Failed to fetch profile:", err.message);
    res.status(500).json({ message: "Couldn't load your profile." });
  }
};

// Optional number within a range; empty → null.
const optionalNumber = (value, min, max) => {
  if (value === null || value === undefined || value === "") return { value: null };
  const n = Number(value);
  if (!Number.isFinite(n) || n < min || n > max) return { error: true };
  return { value: Math.round(n * 100) / 100 };
};

exports.updateUserInfo = async (req, res) => {
  const { name, birthday, gender, activityLevel } = req.body;
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

  const errors = [];
  if (typeof name !== "string" || name.length > 255) errors.push("name");
  if (!EMAIL_PATTERN.test(email) || email.length > 255) errors.push("email");
  if (birthday && (!DATE_PATTERN.test(birthday) || Number.isNaN(Date.parse(birthday)) || new Date(birthday) > new Date()))
    errors.push("birthday");
  if (!GENDERS.includes(gender)) errors.push("gender");
  if (!ACTIVITY_LEVELS.includes(activityLevel)) errors.push("activity level");
  const height = optionalNumber(req.body.height, 100, 250);
  const weight = optionalNumber(req.body.weight, 30, 300);
  const bmi = optionalNumber(req.body.bmi, 5, 100);
  if (height.error) errors.push("height");
  if (weight.error) errors.push("weight");
  if (bmi.error) errors.push("BMI");

  if (errors.length > 0) {
    return res.status(400).json({ message: `Check these fields: ${errors.join(", ")}.` });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query(
      "UPDATE users_info SET name = ?, email = ?, birthday = ?, gender = ?, height = ?, weight = ?, bmi = ?, activityLevel = ? WHERE user_id = ?",
      [
        name.trim() || "Unknown",
        email,
        birthday || null,
        gender,
        height.value,
        weight.value,
        bmi.value,
        activityLevel,
        req.userId,
      ]
    );
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Profile not found." });
    }
    // Keep the sign-in email in step with the profile email.
    await connection.query("UPDATE users SET email = ? WHERE id = ?", [email, req.userId]);

    await connection.commit();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    if (connection) await connection.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "That email is already used by another account." });
    }
    console.error("Failed to update profile:", err.message);
    res.status(500).json({ message: "Couldn't save your profile." });
  } finally {
    if (connection) connection.release();
  }
};
