import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Stack,
} from "@mui/material";

const tagSx = {
  color: "var(--ink)",
  border: "1px solid var(--ink)",
  fontSize: "13px",
  borderRadius: "20px",
  textTransform: "capitalize",
  px: "12px",
  py: "4px",
};

const ExerciseCard = ({ exercise }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        border: "1px solid var(--ink)",
        borderRadius: "8px",
        boxShadow: "none",
        height: "100%",
      }}
    >
      <CardActionArea
        component={Link}
        to={`/exercises/${exercise.id}`}
        sx={{ height: "100%", "&:hover .exercise-card-name": { color: "var(--logged)" } }}
      >
        <CardMedia
          component="img"
          loading="lazy"
          sx={{
            height: 240,
            objectFit: "contain",
            backgroundColor: "#fff",
            aspectRatio: "1/1",
            filter: "grayscale(1) contrast(1.08)",
          }}
          image={exercise.gifUrl}
          alt={`Animation showing ${exercise.name}`}
        />
        <CardContent>
          <Stack direction="row" spacing={1}>
            <Box component="span" sx={tagSx}>
              {exercise.bodyPart}
            </Box>
            <Box component="span" sx={tagSx}>
              {exercise.target}
            </Box>
          </Stack>
          <Typography
            className="exercise-card-name"
            color="var(--ink)"
            fontWeight="700"
            sx={{ fontSize: { lg: "22px", xs: "18px" }, fontFamily: "var(--font-body)" }}
            mt="11px"
            pb="6px"
            textTransform="capitalize"
          >
            {exercise.name}
          </Typography>
          <Typography
            color="var(--ink-soft)"
            fontWeight="500"
            sx={{ fontSize: { lg: "14px", xs: "12px" } }}
            textTransform="capitalize"
          >
            Equipment: {exercise.equipment}
            {exercise.difficulty && ` · ${exercise.difficulty}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
);

export default ExerciseCard;
