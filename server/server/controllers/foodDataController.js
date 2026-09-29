const axios = require("axios");

// Without a key USDA rejects every request (403). DEMO_KEY is USDA's shared
// public key: it works out of the box but is heavily rate limited, so set
// USDA_API_KEY (free from https://fdc.nal.usda.gov/api-key-signup) for real use.
const USDA_API_KEY = process.env.USDA_API_KEY || "DEMO_KEY";
const USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
const USDA_DETAIL_URL = "https://api.nal.usda.gov/fdc/v1/food/";

if (!process.env.USDA_API_KEY) {
  console.warn(
    "USDA_API_KEY is not set; food search is using USDA's rate-limited DEMO_KEY."
  );
}

exports.searchFood = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ message: "Enter a food to search for." });
    }
    const response = await axios.get(USDA_API_URL, {
      params: {
        query,
        pageSize: 15,
        api_key: USDA_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status;
    console.error("USDA FoodData Search Error:", status, error.message);
    if (status === 429) {
      return res.status(429).json({
        message: "Food search is busy right now. Try again in a few minutes.",
      });
    }
    res.status(500).json({ message: "Couldn't search foods. Try again." });
  }
};

exports.getFoodDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get the food ID from the URL params
    const response = await axios.get(`${USDA_DETAIL_URL}${id}`, {
      params: {
        api_key: USDA_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("USDA FoodData Detail Error:", error);
    res.status(500).send("Error fetching food details");
  }
};
