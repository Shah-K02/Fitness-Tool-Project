const axios = require("axios");

const USDA_API_KEY = process.env.USDA_API_KEY; // Make sure to set this in your .env file
const USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
const USDA_DETAIL_URL = "https://api.nal.usda.gov/fdc/v1/food/";

exports.searchFood = async (req, res) => {
  try {
    const { query } = req.body;
    const response = await axios.get(USDA_API_URL, {
      params: {
        query,
        api_key: USDA_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("USDA FoodData Search Error:", error);
    res.status(500).send("Error fetching food data");
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
