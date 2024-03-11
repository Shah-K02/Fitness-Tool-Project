// userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userInfoController = require("../controllers/userInfoController");
const authenticate = require("../middleware/authenticate");
const foodDataController = require("../controllers/foodDataController");

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/food/:id", foodDataController.getFoodDetails);

// Protected routes (use authenticate middleware)
router.get("/user/info", authenticate, userInfoController.fetchUserInfo);
router.post("/user/update", authenticate, userInfoController.updateUserInfo);

module.exports = router;
