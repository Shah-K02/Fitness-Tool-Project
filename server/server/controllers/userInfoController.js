const mysql = require("mysql");
const db = require("./config/db");

exports.fetchUserInfo = (req, res) => {
  const userId = req.userId; // Make sure to implement authentication to set this
  const query =
    "SELECT name, email, birthday, gender, height, weight, bmi, activityLevel FROM users_info WHERE id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Failed to fetch user info:", err);
      return res.status(500).send("Failed to fetch user info");
    }
    if (result.length > 0) {
      return res.json(result[0]);
    } else {
      return res.status(404).send("User not found");
    }
  });
};

exports.updateUserInfo = (req, res) => {
  const { name, email, birthday, gender, height, weight, bmi, activityLevel } =
    req.body;
  const userId = req.userId; // Make sure to implement authentication to set this

  const query =
    "UPDATE users_info SET name = ?, email = ?, birthday = ?, gender = ?, height = ?, weight = ?, bmi = ?, activityLevel = ? WHERE id = ?";
  db.query(
    query,
    [name, email, birthday, gender, height, weight, bmi, activityLevel, userId],
    (err, result) => {
      if (err) {
        console.error("Failed to update user info:", err);
        return res.status(500).send("Failed to update user info");
      }
      return res.send("Profile updated successfully");
    }
  );
};
