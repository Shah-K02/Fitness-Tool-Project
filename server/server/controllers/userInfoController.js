const mysql = require("mysql");
const db = require("../../config/db");
// Convert birthday to MySQL format

exports.fetchUserInfo = (req, res) => {
  const userId = req.userId;
  const query =
    "SELECT name, email, birthday, gender, height, weight, bmi, activityLevel FROM users_info WHERE user_id = ?";
  // Fetch user info from the database
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Failed to fetch user info:", err);
      return res.status(500).send("Failed to fetch user info");
    }
    if (result.length > 0) {
      return res.json(result[0]);
    } else {
      return res.json({
        // Return an empty object if no user info is found
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
  // Validate the gender and activity level values
  const validGenders = ["male", "female", "other"];
  const validActivityLevels = [
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ];

  if (!validGenders.includes(gender)) {
    return res
      .status(400)
      .send("Invalid gender value. Please select a valid option.");
  }

  if (!validActivityLevels.includes(activityLevel)) {
    return res
      .status(400)
      .send("Invalid activity level value. Please select a valid option.");
  }
  // Update the user info in the database
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
