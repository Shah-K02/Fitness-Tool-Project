const axios = require("axios");

const EXERCISE_DB_BASE_URL = "https://exercisedb.p.rapidapi.com";
const YOUTUBE_SEARCH_BASE_URL =
  "https://youtube-search-and-download.p.rapidapi.com";
const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;

const exerciseDbHeaders = {
  "X-RapidAPI-Key": RAPID_API_KEY,
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};

// ExerciseDB no longer returns a gifUrl on exercise objects; the animation is
// served from its /image endpoint, which needs the API key. Point the client
// at our own proxy route so the key never leaves the server.
const withImageUrl = (exercise) => ({
  ...exercise,
  gifUrl: `/api/exercises/image/${exercise.id}`,
});

const getExerciseByName = async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(
      `${EXERCISE_DB_BASE_URL}/exercises/name/${encodeURIComponent(name)}`,
      { headers: exerciseDbHeaders },
    );
    res.json(response.data.map(withImageUrl));
  } catch (error) {
    console.error("Failed to fetch exercises:", error.message);
    res.status(500).json({ message: "Error fetching exercise data" });
  }
};

const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `${EXERCISE_DB_BASE_URL}/exercises/exercise/${encodeURIComponent(id)}`,
      { headers: exerciseDbHeaders },
    );
    res.json(withImageUrl(response.data));
  } catch (error) {
    console.error("Failed to fetch exercise:", error.message);
    res.status(500).json({ message: "Error fetching exercise details" });
  }
};

const getExerciseImage = async (req, res) => {
  try {
    const { id } = req.params;
    const resolution = req.query.resolution || "360";
    const response = await axios.get(`${EXERCISE_DB_BASE_URL}/image`, {
      headers: exerciseDbHeaders,
      params: { exerciseId: id, resolution },
      responseType: "arraybuffer",
    });
    res.set("Content-Type", response.headers["content-type"] || "image/gif");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error("Failed to fetch exercise image:", error.message);
    res.status(404).end();
  }
};

const getExerciseVideos = async (req, res) => {
  try {
    const { name } = req.params;
    const response = await axios.get(`${YOUTUBE_SEARCH_BASE_URL}/search`, {
      headers: {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
      },
      params: { query: `${name} exercise how to`, type: "v" },
    });
    const videos = (response.data.contents || [])
      .filter((item) => item.video && item.video.videoId)
      .slice(0, 3)
      .map(({ video }) => ({
        videoId: video.videoId,
        title: video.title,
        channelName: video.channelName,
      }));
    res.json(videos);
  } catch (error) {
    // Videos are a nice-to-have; the detail page still works without them.
    console.error("Failed to fetch exercise videos:", error.message);
    res.json([]);
  }
};

module.exports = {
  getExerciseByName,
  getExerciseById,
  getExerciseImage,
  getExerciseVideos,
};
