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
          fontWeight="700"
          sx={{
            fontSize: { lg: "40px", xs: "28px" },
            mb: "49px",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            color: "var(--ink)",
          }}
        >
          Exercises
        </Typography>
        <Box position="relative" mb="72px">
          <TextField
            height="76px"
            sx={{
              input: {
                fontWeight: "600",
                border: "none",
                borderRadius: "4px 0 0 4px",
                backgroundColor: "var(--paper)",
              },
              "& fieldset": { border: "1px solid var(--ink)", borderRadius: "4px 0 0 4px" },
              width: { lg: "1170px", xs: "280px" },
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            placeholder="Search Exercises"
            type="text"
          />
          <Button
            sx={{
              bgcolor: "var(--ink)",
              color: "var(--paper)",
              textTransform: "none",
              fontWeight: "600",
              borderRadius: "0 4px 4px 0",
              position: "absolute",
              right: 0,
              top: 0,
              width: { lg: "150px", xs: "80px" },
              height: "56px",
              fontSize: { lg: "16px", xs: "14px" },
              "&:hover": {
                bgcolor: "var(--logged)",
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
