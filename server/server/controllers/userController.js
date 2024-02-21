const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db"); // Adjust the path as necessary

exports.registerUser = (req, res) => {
  const { username, email, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).send({ message: "Error hashing password" });
      return;
    }
    db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hash],
      (error, results) => {
        if (error) {
          res.status(500).send({ message: "Error registering user" });
          return;
        }
        const userId = results.insertId;
        db.query(
          "INSERT INTO users_info (user_id, name, email) VALUES (?, ?, ?)",
          [userId, "", email],
          (error, results) => {
            if (error) {
              db.rollback();
              res.status(500).send({ message: "Error initializing user info" });
              return;
            }
            res.status(201).send({ message: "User registered successfully!" });
          }
        );
      }
    );
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
    if (error) {
      res.status(500).send({ message: "Error on the server." });
      return;
    }
    if (results.length === 0) {
      res
        .status(404)
        .send({ message: "Email does not exist, please register." });
      return;
    }
    const hashedPassword = results[0].password;
    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err || !isMatch) {
        res.status(401).send({ message: "Password does not match." });
        return;
      }
      // Implement token creation and response here
      res.status(200).send({ message: "Login successful!" });
    });
  });
};
