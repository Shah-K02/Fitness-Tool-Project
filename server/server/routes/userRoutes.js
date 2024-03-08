const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userInfoController = require("../controllers/userInfoController");
const foodDataController = require("../controllers/foodDataController"); // Import the new controller
const authenticate = require("../middleware/authenticate");

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.registerUser);

// Food search route
router.post("/food/search", foodDataController.searchFood);

// Protected routes (use authenticate middleware)
router.get("/user/info", authenticate, userInfoController.fetchUserInfo);
router.post("/user/update", authenticate, userInfoController.updateUserInfo);

module.exports = router;
