const FoodLog = require("../models/FoodLog");

exports.createLog = async (req, res) => {
  try {
    const logData = req.body;
    // Add logic to validate logData

    await FoodLog.create(logData);
    res.status(201).json({ message: "Food log created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating food log" });
  }
};

exports.getLogsByDate = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const logs = await FoodLog.findByDate(userId, date);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching food logs" });
  }
};
