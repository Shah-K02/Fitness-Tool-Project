const express = require("express");
const router = express.Router();
const foodDataController = require("../controllers/foodDataController");

router.post("/food/search", foodDataController.searchFood);

module.exports = router;
