const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodLogController");
const authenticate = require("../middleware/authenticate");

router.post("/log/food", authenticate, foodController.createLog);

module.exports = router;
