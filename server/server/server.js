// server.js
require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authenticate = require("./middleware/authenticate");
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // This allows sending cookies and credentials headers
  })
);
app.use(cookieParser());

app.use("/api", userRoutes);

app.use("/api/user", authenticate);

app.use("/api", foodRoutes);

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
