const db = require("../../config/db");

exports.fetchUserInfo = async (req, res) => {
  const userId = req.userId;
  console.log("Attempting to fetch user info for userID:", userId);
  const query =
    "SELECT name, email, birthday, gender, height, weight, bmi, activityLevel FROM users_info WHERE user_id = ?";

  try {
    const [results] = await db.query(query, [userId]);
    console.log("User info retrieved:", results);
    if (results.length > 0) {
      return res.json(results[0]);
    } else {
      console.log("No user info found for userID:", userId);
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
  } catch (err) {
    console.error(
      "Failed to fetch user info for userID:",
      userId,
      "Error:",
      err
    );
    return res.status(500).send("Failed to fetch user info");
  }
};

// Update user info using promises
exports.updateUserInfo = async (req, res) => {
  const { name, email, birthday, gender, height, weight, bmi, activityLevel } =
    req.body;
  const userId = req.userId;
  console.log("Updating user info for userID:", userId);

  const validGenders = ["male", "female", "other"];
  const validActivityLevels = [
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extra_active",
  ];

  if (!validGenders.includes(gender)) {
    console.log("Invalid gender:", gender);
    return res
      .status(400)
      .send("Invalid gender value. Please select a valid option.");
  }

  if (!validActivityLevels.includes(activityLevel)) {
    console.log("Invalid activity level:", activityLevel);
    return res
      .status(400)
      .send("Invalid activity level value. Please select a valid option.");
  }

  const query =
    "UPDATE users_info SET name = ?, email = ?, birthday = ?, gender = ?, height = ?, weight = ?, bmi = ?, activityLevel = ? WHERE user_id = ?";

  try {
    const [result] = await db.query(query, [
      name,
      email,
      birthday,
      gender,
      height,
      weight,
      bmi,
      activityLevel,
      userId,
    ]);
    if (result.affectedRows === 0) {
      console.log("No user found to update for userID:", userId);
      return res.status(404).send("User not found");
    }
    console.log("User info updated successfully for userID:", userId);
    return res.send("Profile updated successfully");
  } catch (err) {
    console.error(
      "Failed to update user info for userID:",
      userId,
      "Error:",
      err
    );
    return res.status(500).send("Failed to update user info");
  }
};
