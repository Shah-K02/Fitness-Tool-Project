// server.js
require("dotenv").config(); // Ensure this is at the top to load environment variables
const express = require("express");
const db = require("../config/db");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
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

// Use routes
app.use("/api", userRoutes); // This will use your userRoutes for any '/api' endpoint

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
