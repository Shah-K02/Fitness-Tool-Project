// userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userInfoController = require("../controllers/userInfoController");
const authenticate = require("../middleware/authenticate");

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected routes (use authenticate middleware)
router.get("/user/info", authenticate, userInfoController.fetchUserInfo);
router.post("/user/update", authenticate, userInfoController.updateUserInfo);

module.exports = router;
