import axios from "axios";

export const exerciseOptions = {
  headers: {
    "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
  },
};

export const fetchExercises = async (url, options) => {
  const exercisesData = await axios.get(url, options);
  return exercisesData;
};
