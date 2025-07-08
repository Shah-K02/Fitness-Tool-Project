const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
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

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const hash = await bcrypt.hash(password, 10);
    const insertUserResult = await connection.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash]
    );
    const userId = insertUserResult[0].insertId;

    await connection.query(
      "INSERT INTO users_info (user_id, email) VALUES (?, ?)",
      [userId, email]
    );

    await connection.commit();
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    connection.release();
    res
      .status(201)
      .send({ message: "User registered successfully!", token, userId });
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Registration Error:", error);
    res.status(500).send({ message: "Error registering user." });
  }
};

exports.checkEmail = async (req, res) => {
  const { email } = req.query;

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length > 0) {
      return res.status(409).send({ message: "Email is already registered." });
    }

    res.status(200).send({ message: "Email is available." });
  } catch (error) {
    console.error("Check Email Error:", error);
    res.status(500).send({ message: "Error checking email." });
  }
};
