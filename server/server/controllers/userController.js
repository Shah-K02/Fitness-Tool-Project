const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");

const { promisify } = require("util");
const dbQuery = promisify(db.query).bind(db);

exports.registerUser = (req, res) => {
  const { email, password } = req.body;

  db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      return res.status(500).send({ message: "Error connecting to database" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error("Error starting transaction:", err);
        return res.status(500).send({ message: "Error starting transaction" });
      }

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
          });
          console.error("Error hashing password:", err);
          return res.status(500).send({ message: "Error hashing password" });
        }

        connection.query(
          "INSERT INTO users (email, password) VALUES (?, ?)",
          [email, hash],
          (err, insertUserResult) => {
            if (err) {
              connection.rollback(() => {
                connection.release();
              });
              console.error("Error inserting user:", err);
              return res
                .status(500)
                .send({ message: "Error registering user" });
            }

            const userId = insertUserResult.insertId;
            connection.query(
              "INSERT INTO users_info (user_id, email) VALUES (?, ?)",
              [userId, email],
              (err) => {
                if (err) {
                  connection.rollback(() => {
                    connection.release();
                  });
                  console.error("Error inserting user info:", err);
                  return res
                    .status(500)
                    .send({ message: "Error inserting user info" });
                }

                connection.commit((err) => {
                  if (err) {
                    connection.rollback(() => {
                      connection.release();
                    });
                    console.error("Error committing transaction:", err);
                    return res
                      .status(500)
                      .send({ message: "Error committing transaction" });
                  }
                  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
                    expiresIn: "1h",
                  });

                  connection.release();
                  res.status(201).send({
                    message: "User registered successfully!",
                    token,
                    userId,
                  });
                });
              }
            );
          }
        );
      });
    });
  });
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
