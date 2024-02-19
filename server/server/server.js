// server.js
require("dotenv").config(); // Ensure this is at the top to load environment variables
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const saltRounds = 10; // It's better to use an explicit number for salt rounds

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend's origin
    credentials: true, // This allows sending cookies and credentials headers
  })
);
app.use(cookieParser());

// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL server.");
});

// Register endpoint
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
  db.query(sql, [email, hashedPassword], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error registering the user");
    }
    res.status(201).send("User registered successfully");
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error logging in");
    }
    if (results.length === 0) {
      return res.status(404).send("User not found");
    }
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      res.status(200).json({ token: token });
    } else {
      res.status(401).send("Password is incorrect");
    }
  });
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
