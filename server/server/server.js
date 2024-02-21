// server.js is the file that contains the server logic. It uses the express framework to create the server and handle requests. It also uses the mysql package to connect to the database and the bcrypt package to hash passwords. The server listens on port 8081 and has two endpoints: /register and /login. The /register endpoint is used to register a new user, and the /login endpoint is used to log in an existing user. The server also uses the cors package to enable cross-origin resource sharing and the cookie-parser package to parse cookies. The server is started by calling the listen method on the app object, passing in the port number and a callback function to log a message when the server is running.
require("dotenv").config(); // Ensure this is at the top to load environment variables
const express = require("express");
const db = require("../config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend's origin
    credentials: true, // This allows sending cookies and credentials headers
  })
);
app.use(cookieParser());

// // Create a connection to the database
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// });

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL server.");
});
// Use routes
app.use("/api", userRoutes); // This will use your userRoutes for any '/api' endpoint

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
