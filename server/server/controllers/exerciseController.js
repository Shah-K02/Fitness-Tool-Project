const axios = require("axios");

const EXERCISE_DB_BASE_URL = "https://exercisedb.p.rapidapi.com";
const EXERCISE_DB_API_KEY = process.env.REACT_APP_RAPID_API_KEY;

const getExerciseByName = async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(
      `${EXERCISE_DB_BASE_URL}/exercises/name/${name}`,
      {
        headers: {
          "X-RapidAPI-Key": EXERCISE_DB_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    res.status(500).json({ message: "Error fetching exercise data" });
  }
};

module.exports = {
  getExerciseByName,
};
