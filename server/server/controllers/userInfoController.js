const mysql = require("mysql");
const db = require("../../config/db");
// Convert birthday to MySQL format
function convertDateToMySQLFormat(dateString) {
  // Assuming dateString is in the format DD/MM/YYYY
  const parts = dateString.split("/");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to YYYY-MM-DD
  } else {
    throw new Error("Invalid date format");
  }
}

exports.fetchUserInfo = (req, res) => {
  const userId = req.userId;
  const query =
    "SELECT name, email, birthday, gender, height, weight, bmi, activityLevel FROM users_info WHERE user_id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Failed to fetch user info:", err);
      return res.status(500).send("Failed to fetch user info");
    }
    if (result.length > 0) {
      return res.json(result[0]);
    } else {
      return res.json({
        name: "",
        email: "",
        birthday: "",
        gender: "",
        height: "",
        weight: "",
        bmi: "",
        activityLevel: "",
      });
    }
  });
};

exports.updateUserInfo = (req, res) => {
  let { name, email, birthday, gender, height, weight, bmi, activityLevel } =
    req.body;
  const userId = req.userId;
  birthday = convertDateToMySQLFormat(birthday);

  const query =
    "UPDATE users_info SET name = ?, email = ?, birthday = ?, gender = ?, height = ?, weight = ?, bmi = ?, activityLevel = ? WHERE user_id = ?";
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
