import axios from "axios";

export const exerciseOptions = {
  method: "GET",

  headers: {
    "X-RapidAPI-Key": "b6a2a2f57dmshb6e6fb5c56b5b07p1cd2d8jsnd6ce99b5dc6d",
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
  },
};

export const fetchData = async (url, options) => {
  const exercisesData = await axios.get(url, options);
  return exercisesData;
};
