import React, { useEffect, useState } from "react";
import { exerciseOptions, fetchData } from "../utils/fetchData"; // Import fetchData and exerciseOptions

const SearchExercises = () => {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);

  useEffect(() => {
    const fetchExercisesData = async () => {
      const bodyPartsData = await fetchData(
        `https://exercisedb.p.rapidapi.com/exercises/bodyPartList`,
        exerciseOptions
      );
      setBodyParts(["all", ...bodyPartsData.data]);
    };

    fetchExercisesData();
  }, []);
  const handleSearch = async (e) => {
    e.preventDefault();

    if (search) {
      const exerciseData = await fetchData(
        `https://exercisedb.p.rapidapi.com/exercises`,
        exerciseOptions
      );
      const searchedExercises = exerciseData.data.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(search) ||
          exercise.target.toLowerCase().includes(search) ||
          exercise.equipment.toLowerCase().includes(search) ||
          exercise.bodyPart.toLowerCase().includes(search)
      );
      setSearch("");
      setExercises(searchedExercises);
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
      <div className="body-parts">
        {bodyParts.map((part, index) => (
          <button key={index} onClick={() => setSearch(part)}>
            {part}
          </button>
        ))}

        <button onClick={() => setExercises([])}>Clear</button>
      </div>
    </div>
  );
};

export default SearchExercises;
