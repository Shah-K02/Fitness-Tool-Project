const express = require("express");
const router = express.Router();
const foodLogController = require("../controllers/foodLogController");
const authenticate = require("../middleware/authenticate");
// Routes for food log management (CRUD) and fetching logs by date for a user
router.post("/log/food", authenticate, foodLogController.createLog);
router.get("/logs/:date", authenticate, foodLogController.getLogsByDate);

module.exports = router;
