import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

export const SEARCH_MODES = [
  { value: "name", label: "Name" },
  { value: "bodyPart", label: "Body part" },
  { value: "equipment", label: "Equipment" },
  { value: "difficulty", label: "Difficulty" },
];

const fieldSx = {
  "& .MuiInputBase-root": {
    fontWeight: 600,
    backgroundColor: "var(--paper)",
    borderRadius: "4px",
    textTransform: "capitalize",
  },
  "& fieldset": { border: "1px solid var(--ink)" },
  "& .MuiInputBase-root.Mui-focused fieldset": { borderColor: "var(--ink)" },
};

const toggleSx = {
  "& .MuiToggleButton-root": {
    color: "var(--ink)",
    borderColor: "var(--ink)",
    textTransform: "none",
    fontWeight: 600,
    px: { xs: 1.25, sm: 2 },
  },
  "& .MuiToggleButton-root.Mui-selected, & .MuiToggleButton-root.Mui-selected:hover": {
    bgcolor: "var(--ink)",
    color: "var(--paper)",
  },
};

const menuItemSx = { textTransform: "capitalize" };

const SearchExercises = ({
  onSearch,
  options = { bodyParts: [], equipment: [], difficulties: [] },
  initialSearch = {},
}) => {
  const [by, setBy] = useState(initialSearch.by || "name");
  const [searchTerm, setSearchTerm] = useState(initialSearch.q || "");
  const [difficulty, setDifficulty] = useState(initialSearch.difficulty || "");

  // Keep the form in step with the URL, e.g. after pressing Back.
  useEffect(() => {
    setBy(initialSearch.by || "name");
    setSearchTerm(initialSearch.q || "");
    setDifficulty(initialSearch.difficulty || "");
  }, [initialSearch.by, initialSearch.q, initialSearch.difficulty]);

  const submit = (next = {}) => {
    const search = { by, q: searchTerm, difficulty, ...next };
    if (search.by === "difficulty") search.difficulty = "";
    if (search.q.trim()) onSearch(search);
  };

  const changeMode = (_, mode) => {
    if (!mode || mode === by) return;
    setBy(mode);
    setSearchTerm("");
    if (mode === "difficulty") setDifficulty("");
  };

  const listForMode = {
    bodyPart: options.bodyParts,
    equipment: options.equipment,
    difficulty: options.difficulties,
  }[by];

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
            mb: "32px",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            color: "var(--ink)",
          }}
        >
          Exercises
        </Typography>

        <Box
          component="form"
          role="search"
          mb="56px"
          sx={{ width: "100%", maxWidth: "860px" }}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
            mb={2}
          >
            <Typography
              id="search-by-label"
              sx={{ fontWeight: 600, color: "var(--ink-soft)", fontSize: "0.9rem" }}
            >
              Search by
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={by}
              onChange={changeMode}
              aria-labelledby="search-by-label"
              sx={toggleSx}
            >
              {SEARCH_MODES.map((mode) => (
                <ToggleButton key={mode.value} value={mode.value}>
                  {mode.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
            {by === "name" ? (
              <TextField
                sx={{ ...fieldSx, flex: 1 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                placeholder="Search Exercises"
                type="search"
                inputProps={{ "aria-label": "Search exercises by name" }}
              />
            ) : (
              <TextField
                select
                sx={{ ...fieldSx, flex: 1 }}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  submit({ q: e.target.value });
                }}
                SelectProps={{
                  displayEmpty: true,
                  inputProps: {
                    "aria-label": `Choose ${SEARCH_MODES.find((m) => m.value === by).label.toLowerCase()}`,
                  },
                }}
              >
                <MenuItem value="" disabled sx={menuItemSx}>
                  Choose {SEARCH_MODES.find((m) => m.value === by).label.toLowerCase()}
                </MenuItem>
                {listForMode.map((item) => (
                  <MenuItem key={item} value={item} sx={menuItemSx}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {by !== "difficulty" && (
              <TextField
                select
                sx={{ ...fieldSx, minWidth: { md: "190px" } }}
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  submit({ difficulty: e.target.value });
                }}
                SelectProps={{
                  displayEmpty: true,
                  inputProps: { "aria-label": "Filter by difficulty" },
                }}
              >
                <MenuItem value="" sx={menuItemSx}>
                  Any difficulty
                </MenuItem>
                {options.difficulties.map((item) => (
                  <MenuItem key={item} value={item} sx={menuItemSx}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <Button
              type="submit"
              sx={{
                bgcolor: "var(--ink)",
                color: "var(--paper)",
                textTransform: "none",
                fontWeight: "600",
                borderRadius: "4px",
                minWidth: "140px",
                height: "56px",
                fontSize: "16px",
                "&:hover": {
                  bgcolor: "var(--logged)",
                },
              }}
            >
              Search
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default SearchExercises;
