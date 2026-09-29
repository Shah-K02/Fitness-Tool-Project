const axios = require("axios");

const EXERCISE_DB_BASE_URL = "https://exercisedb.p.rapidapi.com";
const YOUTUBE_SEARCH_BASE_URL =
  "https://youtube-search-and-download.p.rapidapi.com";
const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY;

const exerciseDbHeaders = {
  "X-RapidAPI-Key": RAPID_API_KEY,
  "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
};

// ExerciseDB returns at most 10 exercises per request on the current plan,
// whatever `limit` is sent, so results are paged with `offset`.
const PAGE_SIZE = 10;
// Upper bound on upstream pages fetched for one search when a difficulty
// filter discards some results, so a single search can't drain the quota.
const MAX_PAGES_PER_SEARCH = 5;
const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

// The RapidAPI plan has a small monthly request quota, so identical upstream
// requests are cached in memory. Exercise data rarely changes.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;
const cache = new Map();

const cached = async (key, load) => {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await load();
  if (cache.size >= MAX_CACHE_ENTRIES) {
    // Maps iterate in insertion order, so this evicts the oldest entry.
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
  return value;
};

const fetchExerciseDb = (path, params = {}) =>
  cached(`json:${path}:${JSON.stringify(params)}`, async () => {
    const response = await axios.get(`${EXERCISE_DB_BASE_URL}${path}`, {
      headers: exerciseDbHeaders,
      params,
    });
    return response.data;
  });

// ExerciseDB no longer returns a gifUrl on exercise objects; the animation is
// served from its /image endpoint, which needs the API key. Point the client
// at our own proxy route so the key never leaves the server.
const withImageUrl = (exercise) => ({
  ...exercise,
  gifUrl: `/api/exercises/image/${exercise.id}`,
});

// Upstream listing endpoint for each kind of search. Difficulty has no
// endpoint of its own, so it pages through every exercise and filters.
const SEARCH_SOURCES = {
  name: (value) => `/exercises/name/${encodeURIComponent(value)}`,
  bodyPart: (value) => `/exercises/bodyPart/${encodeURIComponent(value)}`,
  equipment: (value) => `/exercises/equipment/${encodeURIComponent(value)}`,
  difficulty: () => "/exercises",
};

const searchExercises = async (req, res) => {
  const by = req.query.by || "name";
  const q = (req.query.q || "").trim().toLowerCase();
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
  const difficulty =
    by === "difficulty" ? q : (req.query.difficulty || "").toLowerCase();

  if (!SEARCH_SOURCES[by] || !q) {
    return res.status(400).json({ message: "Invalid search" });
  }
  if (difficulty && !DIFFICULTIES.includes(difficulty)) {
    return res.status(400).json({ message: "Invalid difficulty" });
  }

  try {
    const path = SEARCH_SOURCES[by](q);
    const results = [];
    let nextOffset = offset;
    let exhausted = false;

    for (let page = 0; page < MAX_PAGES_PER_SEARCH; page++) {
      const exercises = await fetchExerciseDb(path, { offset: nextOffset });
      nextOffset += exercises.length;
      results.push(
        ...exercises.filter((e) => !difficulty || e.difficulty === difficulty)
      );
      if (exercises.length < PAGE_SIZE) {
        exhausted = true;
        break;
      }
      if (results.length >= PAGE_SIZE) break;
    }

    res.json({
      results: results.map(withImageUrl),
      nextOffset: exhausted ? null : nextOffset,
    });
  } catch (error) {
    console.error("Failed to search exercises:", error.message);
    res.status(500).json({ message: "Error fetching exercise data" });
  }
};

const getSearchOptions = async (req, res) => {
  try {
    const [bodyParts, equipment] = await Promise.all([
      fetchExerciseDb("/exercises/bodyPartList"),
      fetchExerciseDb("/exercises/equipmentList"),
    ]);
    res.json({ bodyParts, equipment, difficulties: DIFFICULTIES });
  } catch (error) {
    console.error("Failed to fetch search options:", error.message);
    res.status(500).json({ message: "Error fetching search options" });
  }
};

const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await fetchExerciseDb(
      `/exercises/exercise/${encodeURIComponent(id)}`
    );
    res.json(withImageUrl(exercise));
  } catch (error) {
    console.error("Failed to fetch exercise:", error.message);
    res.status(500).json({ message: "Error fetching exercise details" });
  }
};

const getExerciseImage = async (req, res) => {
  try {
    const { id } = req.params;
    const resolution = req.query.resolution || "360";
    const image = await cached(`image:${id}:${resolution}`, async () => {
      const response = await axios.get(`${EXERCISE_DB_BASE_URL}/image`, {
        headers: exerciseDbHeaders,
        params: { exerciseId: id, resolution },
        responseType: "arraybuffer",
      });
      return {
        contentType: response.headers["content-type"] || "image/gif",
        body: Buffer.from(response.data),
      };
    });
    res.set("Content-Type", image.contentType);
    res.set("Cache-Control", "public, max-age=86400");
    res.send(image.body);
  } catch (error) {
    console.error("Failed to fetch exercise image:", error.message);
    res.status(404).end();
  }
};

const getExerciseVideos = async (req, res) => {
  try {
    const { name } = req.params;
    const videos = await cached(`videos:${name}`, async () => {
      const response = await axios.get(`${YOUTUBE_SEARCH_BASE_URL}/search`, {
        headers: {
          "X-RapidAPI-Key": RAPID_API_KEY,
          "X-RapidAPI-Host": "youtube-search-and-download.p.rapidapi.com",
        },
        params: { query: `${name} exercise how to`, type: "v" },
      });
      return (response.data.contents || [])
        .filter((item) => item.video && item.video.videoId)
        .slice(0, 3)
        .map(({ video }) => ({
          videoId: video.videoId,
          title: video.title,
          channelName: video.channelName,
        }));
    });
    res.json(videos);
  } catch (error) {
    // Videos are a nice-to-have; the detail page still works without them.
    console.error("Failed to fetch exercise videos:", error.message);
    res.json([]);
  }
};

module.exports = {
  searchExercises,
  getSearchOptions,
  getExerciseById,
  getExerciseImage,
  getExerciseVideos,
};
