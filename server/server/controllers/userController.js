const mysql = require("mysql");
const bcrypt = require("bcryptjs"); // Make sure to install bcryptjs

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
};
