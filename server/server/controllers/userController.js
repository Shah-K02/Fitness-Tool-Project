// userController.js is the file that contains the logic for registering and logging in users. It uses bcrypt to hash passwords and MySQL to store user data. The registerUser function hashes the password and inserts the user into the database. The loginUser function checks if the email exists in the database and compares the provided password with the stored hashed password. If the password matches, it can create a session or token and redirect to the user-home page or send the token as a response.
const mysql = require("mysql");
const bcrypt = require("bcryptjs"); // Make sure to install bcryptjs
const jwt = require("jsonwebtoken");

// MySQL connection (ideally, this should be in a separate database connection module)
const connection = mysql.createConnection({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Register user function
exports.registerUser = (req, res) => {
  const { username, email, password } = req.body;
  // Hash password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.status(500).send({ message: "Error hashing password" });
    } else {
      // Insert user into database
      connection.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hash],
        (error, results) => {
          if (error) {
            res.status(500).send({ message: "Error registering user" });
          } else {
            res.status(201).send({ message: "User registered successfully!" });
          }
        }
      );
    }
  });
};

// Login user function
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Check if email exists in the database
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (error, results, fields) => {
      if (error) {
        return res.status(500).send({ message: "Error on the server." });
      }

      // If the email does not exist or no users are found
      if (results.length === 0) {
        return res
          .status(404)
          .send({ message: "Email does not exist, please register." });
      }

      // Compare the provided password with the stored hashed password
      const hashedPassword = results[0].password;
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          return res
            .status(500)
            .send({ message: "Error while checking user password." });
        }

        // If the password matches
        if (isMatch) {
          // TODO: Implement logic to create a session or token here
          // For example, creating a JWT token:
          // const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

          // Redirect to user-home page or send token as a response
          // res.status(200).send({ auth: true, token: token });
          res.status(200).send({ message: "Login successful!" });
        } else {
          // If the password does not match
          res.status(401).send({ message: "Password does not match." });
        }
      });
    }
  );

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
};
