const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const config = require("../config");

const BCRYPT_ROUNDS = 12;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 72; // bcrypt ignores anything past 72 bytes
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normaliseEmail = (email) =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

const validEmail = (email) => email.length <= 255 && EMAIL_PATTERN.test(email);

const signToken = (userId) =>
  jwt.sign({ userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

// Compared against when the email doesn't exist, so a missing account takes
// as long to reject as a wrong password.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_ROUNDS);

exports.loginUser = async (req, res) => {
  const email = normaliseEmail(req.body.email);
  const { password } = req.body;

  if (!email || typeof password !== "string" || !password) {
    return res.status(400).send({ message: "Email and password are required." });
  }

  try {
    const [results] = await db.query(
      "SELECT id, password FROM users WHERE email = ?",
      [email]
    );
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    if (!user || !isMatch) {
      return res.status(401).send({ message: "Email or password is incorrect." });
    }

    res
      .status(200)
      .send({ message: "Login successful!", token: signToken(user.id), userId: user.id });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).send({ message: "Couldn't sign you in. Please try again." });
  }
};

exports.registerUser = async (req, res) => {
  const email = normaliseEmail(req.body.email);
  const { password } = req.body;

  if (!validEmail(email)) {
    return res.status(400).send({ message: "Enter a valid email address." });
  }
  if (
    typeof password !== "string" ||
    password.length < PASSWORD_MIN ||
    Buffer.byteLength(password) > PASSWORD_MAX
  ) {
    return res.status(400).send({
      message: `Password must be between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters.`,
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const [insertUserResult] = await connection.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash]
    );
    const userId = insertUserResult.insertId;

    await connection.query(
      "INSERT INTO users_info (user_id, email) VALUES (?, ?)",
      [userId, email]
    );

    // Sign before committing so a signing failure rolls the new user back
    // instead of leaving an account the person was told wasn't created.
    const token = signToken(userId);
    await connection.commit();

    res.status(201).send({ message: "User registered successfully!", token, userId });
  } catch (error) {
    if (connection) await connection.rollback();
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).send({ message: "Email is already registered." });
    }
    console.error("Registration error:", error.message);
    res.status(500).send({ message: "Couldn't create your account. Please try again." });
  } finally {
    if (connection) connection.release();
  }
};

exports.checkEmail = async (req, res) => {
  const email = normaliseEmail(req.query.email);
  if (!validEmail(email)) {
    return res.status(400).send({ message: "Enter a valid email address." });
  }

  try {
    const [results] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (results.length > 0) {
      return res.status(409).send({ message: "Email is already registered." });
    }
    res.status(200).send({ message: "Email is available." });
  } catch (error) {
    console.error("Check email error:", error.message);
    res.status(500).send({ message: "Couldn't check that email. Please try again." });
  }
};
