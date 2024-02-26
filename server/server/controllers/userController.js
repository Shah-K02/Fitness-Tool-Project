const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

// Assuming db is a pool from mysql or similar package that supports promise-based interaction
const { promisify } = require("util");
const dbQuery = promisify(db.query).bind(db);

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    await db.beginTransaction();

    const insertUserResult = await dbQuery(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash]
    );
    const userId = insertUserResult.insertId;

    await dbQuery("INSERT INTO users_info (user_id, email) VALUES (?,  ?)", [
      userId,
      email,
    ]);
    await db.commit();

    res.status(201).send({ message: "User registered successfully!", userId });
  } catch (error) {
    await db.rollback();
    console.error("Registration Error:", error);
    res.status(500).send({ message: "Error registering user" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const results = await dbQuery("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (results.length === 0) {
      return res
        .status(404)
        .send({ message: "Email does not exist, please register." });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Password does not match." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).send({ message: "Login successful!", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send({ message: "Error on the server." });
  }
};
