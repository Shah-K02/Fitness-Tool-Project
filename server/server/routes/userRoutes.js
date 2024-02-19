// userRoutes.js is the file that contains the routes for registering and logging in users. It uses the userController.js file to handle the logic for registering and logging in users. The register route calls the registerUser function from the userController.js file to hash the password and insert the user into the database. The login route calls the loginUser function from the userController.js file to check if the email exists in the database and compare the provided password with the stored hashed password. If the password matches, it can create a session or token and redirect to the user-home page or send the token as a response.
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Controller to handle logic

// Register route
router.post("/register", userController.registerUser);

// Login route
router.post("/login", userController.loginUser);

module.exports = router;
