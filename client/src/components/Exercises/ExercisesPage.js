import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import SearchExercises from "./SearchExercises";
import ExerciseCard from "./ExerciseCard";

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Bumped on every submit so searching the same term again re-fetches.
  const [searchCount, setSearchCount] = useState(0);
  // Keep the search term in the URL so results survive a trip to the detail
  // page and back.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    const fetchExercises = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const endpoint = `/api/exercises/name/${encodeURIComponent(query)}`;
        const response = await axios.get(endpoint);
        if (!cancelled) setExercises(response.data);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        if (!cancelled) setError("Couldn't load exercises. Try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchExercises();
    return () => {
      cancelled = true;
    };
  }, [query, searchCount]);

  const handleSearch = (searchTerm) => {
    const term = searchTerm.trim();
    if (!term) return;
    setSearchParams({ q: term });
    setSearchCount((count) => count + 1);
  };

  return (
    <Box>
      <SearchExercises onSearch={handleSearch} initialTerm={query} />
      <Box sx={{ p: 3 }}>
        {isLoading && <p className="state-message">Loading&hellip;</p>}
        {error && <p className="state-message is-flag">{error}</p>}
        {!isLoading && !error && query && exercises.length === 0 && (
          <p className="state-message">No exercises found for &ldquo;{query}&rdquo;.</p>
        )}
        {!isLoading && !error && (
          <Grid container spacing={3}>
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ExercisesPage;
