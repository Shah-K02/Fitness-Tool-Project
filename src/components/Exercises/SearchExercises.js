import React, { useState } from "react";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";

const SearchExercises = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

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
              bgcolor: "#dc0000",
              color: "#36454f",
              textTransform: "none",
              position: "absolute",
              right: 0,
              top: 0,
              width: { lg: "173px", xs: "80px" },
              height: "56px",
              fontSize: { lg: "20px", xs: "14px" },
              "&:hover": {
                bgcolor: "#ffa500",
                color: "#ffff",
              },
            }}
            onClick={() => onSearch(searchTerm)}
          >
            Search
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default SearchExercises;
