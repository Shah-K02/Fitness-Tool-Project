// src/components/ExerciseSearch.js
import React, { useState } from "react";
import axios from "axios";
import {
  Stack,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";

const SearchExercises = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [exercises, setExercises] = useState([]);

  const handleSearch = async () => {
    try {
      const endpoint = `/api/exercises/${searchType}/${encodeURIComponent(
        searchTerm
      )}`;
      const response = await axios.get(endpoint);
      setExercises(response.data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  return (
    <Box>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ mt: "37px", p: "20px" }}
      >
        <Typography
          fontWeight={700}
          sx={{ fontSize: { lg: "44px", xs: "30px" } }}
          mb="49px"
          textAlign="center"
        >
          Discover New Exercises
        </Typography>
        <Box position="relative" mb="72px">
          <TextField
            height="76px"
            sx={{
              input: { fontWeight: "700", border: "none", borderRadius: "4px" },
              width: { lg: "1170px", xs: "350px" },
              backgroundColor: "#fff",
              borderRadius: "40px",
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            placeholder="Search Exercises"
            type="text"
          />
          <Button
            sx={{
              bgcolor: "#FF2625",
              color: "#fff",
              textTransform: "none",
              position: "absolute",
              right: 0,
              top: 0, // Align with the top of the TextField
              width: { lg: "173px", xs: "80px" },
              height: "56px",
              fontSize: { lg: "20px", xs: "14px" },
            }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
      </Stack>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {exercises.map((exercise, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  sx={{ height: 240, objectFit: "cover" }}
                  image={exercise.gifUrl}
                  alt={`Gif showing ${exercise.name}`} // Corrected syntax for template literals
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {exercise.name}
                  </Typography>
                  <Typography color="text.secondary">
                    Body Part: {exercise.bodyPart}
                  </Typography>
                  <Typography color="text.secondary">
                    Equipment: {exercise.equipment}
                  </Typography>
                  <Typography color="text.secondary">
                    Target Muscle: {exercise.target}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SearchExercises;
