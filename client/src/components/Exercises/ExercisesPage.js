import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import axios from "axios";
import SearchExercises from "./SearchExercises";
import ExerciseCard from "./ExerciseCard";

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const handleSearch = async (searchTerm) => {
    try {
      const endpoint = `/api/exercises/name/${encodeURIComponent(searchTerm)}`;
      const response = await axios.get(endpoint);
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  return (
    <Box>
      <SearchExercises onSearch={handleSearch} />
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ExercisesPage;
