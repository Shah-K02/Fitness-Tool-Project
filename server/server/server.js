// server.js is the file that contains the server logic. It uses the express framework to create the server and handle requests. It also uses the mysql package to connect to the database and the bcrypt package to hash passwords. The server listens on port 8081 and has two endpoints: /register and /login. The /register endpoint is used to register a new user, and the /login endpoint is used to log in an existing user. The server also uses the cors package to enable cross-origin resource sharing and the cookie-parser package to parse cookies. The server is started by calling the listen method on the app object, passing in the port number and a callback function to log a message when the server is running.
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
// Assuming this is in your server.js or a userController.js

// Register endpoint
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // First, check if the email is already registered
  const emailCheckQuery = "SELECT email FROM users WHERE email = ?";
  db.query(emailCheckQuery, [email], async (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error checking for existing user");
    }
    if (results.length > 0) {
      // Email already exists
      return res.status(409).send("Email already registered. Please log in.");
    }

    // If email not found, proceed with registration
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(sql, [email, hashedPassword], (insertErr, result) => {
      if (insertErr) {
        console.log(insertErr);
        return res.status(500).send("Error registering the user");
      }
      res.status(201).send("User registered successfully");
    });
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
