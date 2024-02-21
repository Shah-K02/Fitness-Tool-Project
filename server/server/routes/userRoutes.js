// userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userInfoController = require("../controllers/userInfoController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/user/info", userInfoController.fetchUserInfo); // Removed /api
router.post("/user/update", userInfoController.updateUserInfo); // Removed /api

module.exports = router;
