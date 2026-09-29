import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import SearchExercises, { SEARCH_MODES } from "./SearchExercises";
import ExerciseCard from "./ExerciseCard";

const fetchPage = async ({ by, q, difficulty }, offset) => {
  const response = await axios.get("/api/exercises/search", {
    params: { by, q, difficulty: difficulty || undefined, offset },
  });
  return response.data;
};

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [nextOffset, setNextOffset] = useState(null);
  const [options, setOptions] = useState({
    bodyParts: [],
    equipment: [],
    difficulties: ["beginner", "intermediate", "advanced"],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  // Bumped on every submit so running the same search again re-fetches.
  const [searchCount, setSearchCount] = useState(0);

  // Keep the search in the URL so results survive a trip to the detail page
  // and back.
  const [searchParams, setSearchParams] = useSearchParams();
  const search = {
    by: searchParams.get("by") || "name",
    q: searchParams.get("q") || "",
    difficulty: searchParams.get("difficulty") || "",
  };

  useEffect(() => {
    axios
      .get("/api/exercises/search-options")
      .then((response) => setOptions(response.data))
      .catch((err) => console.error("Error fetching search options:", err));
  }, []);

  useEffect(() => {
    if (!search.q) return;
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPage(search, 0);
        if (cancelled) return;
        setExercises(data.results);
        setNextOffset(data.nextOffset);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        if (!cancelled) setError("Couldn't load exercises. Try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.by, search.q, search.difficulty, searchCount]);

  const handleSearch = ({ by, q, difficulty }) => {
    const term = q.trim();
    if (!term) return;
    const params = { by, q: term };
    if (difficulty) params.difficulty = difficulty;
    setSearchParams(params);
    setSearchCount((count) => count + 1);
  };

  const loadMore = async () => {
    setIsLoadingMore(true);
    try {
      const data = await fetchPage(search, nextOffset);
      setExercises((current) => {
        const seen = new Set(current.map((e) => e.id));
        return [...current, ...data.results.filter((e) => !seen.has(e.id))];
      });
      setNextOffset(data.nextOffset);
    } catch (err) {
      console.error("Error fetching more exercises:", err);
      setError("Couldn't load more exercises. Try again.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const modeLabel = (
    SEARCH_MODES.find((m) => m.value === search.by) || SEARCH_MODES[0]
  ).label.toLowerCase();

  return (
    <Box>
      <SearchExercises
        onSearch={handleSearch}
        options={options}
        initialSearch={search}
      />
      <Box sx={{ p: 3 }}>
        {isLoading && <p className="state-message">Loading&hellip;</p>}
        {error && <p className="state-message is-flag">{error}</p>}
        {!isLoading && !error && search.q && exercises.length === 0 && (
          <p className="state-message">
            No exercises found for {modeLabel} &ldquo;{search.q}&rdquo;
            {search.difficulty && ` at ${search.difficulty} difficulty`}.
          </p>
        )}
        {!isLoading && (
          <Grid container spacing={3}>
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </Grid>
        )}
        {!isLoading && !error && nextOffset !== null && exercises.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              onClick={loadMore}
              disabled={isLoadingMore}
              sx={{
                color: "var(--ink)",
                border: "1px solid var(--ink)",
                borderRadius: "4px",
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                "&:hover": { bgcolor: "var(--ink)", color: "var(--paper)" },
              }}
            >
              {isLoadingMore ? "Loading…" : "Load more"}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ExercisesPage;
