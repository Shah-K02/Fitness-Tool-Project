import React, { useState } from "react";
import axios from "axios";

const SearchExercises = () => {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const exerciseOptions = {
      method: "GET",
      url: "https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises",
      params: { muscle: search },
      headers: {
        "X-RapidAPI-Key": "b6a2a2f57dmshb6e6fb5c56b5b07p1cd2d8jsnd6ce99b5dc6d",
        "X-RapidAPI-Host": "exercises-by-api-ninjas.p.rapidapi.com",
      },
    };

    if (search) {
      try {
        const response = await axios.request(exerciseOptions);
        setExercises(response.data); // Update the exercises state with the fetched data
        console.log(response.data); // Log the fetched data
      } catch (error) {
        console.error(error); // Log any errors
      }
    }
  };

  return (
    <div>
      <h1>Search Exercises</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          id="search-input"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by muscle group..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Go
        </button>
      </form>
      <div>
        {exercises &&
          exercises.map((exercise, index) => (
            <div key={index} className="exercise-card">
              <h2>{exercise.name}</h2>
              <p>{exercise.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchExercises;
