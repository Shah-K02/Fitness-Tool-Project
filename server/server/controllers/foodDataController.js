const axios = require("axios");

const USDA_API_KEY = process.env.USDA_API_KEY;
const USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";

exports.searchFood = async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.get(USDA_API_URL, {
      params: {
        query: query,
        api_key: USDA_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error searching USDA FoodData:", error);
    res.status(500).send("Internal Server Error");
  }
};
