const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseController");

router.get("/search", exerciseController.searchExercises);
router.get("/search-options", exerciseController.getSearchOptions);
router.get("/image/:id", exerciseController.getExerciseImage);
router.get("/videos/:name", exerciseController.getExerciseVideos);
router.get("/:id", exerciseController.getExerciseById);

module.exports = router;
