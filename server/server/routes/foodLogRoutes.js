const express = require("express");
const router = express.Router();
const foodLogController = require("../controllers/foodLogController");
const authenticate = require("../middleware/authenticate");

router.post("/log/food", authenticate, foodLogController.createLog);

module.exports = router;
