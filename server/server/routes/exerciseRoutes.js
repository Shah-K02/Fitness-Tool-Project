const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");

router.get("/name/:name", exerciseController.getExerciseByName);

module.exports = router;
