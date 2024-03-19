const express = require("express");
const router = express.Router();
const foodLogController = require("../controllers/foodLogController");

router.post("/log", foodLogController.createLog);
router.get("/logs/:userId/:date", foodLogController.getLogsByDate);

module.exports = router;
