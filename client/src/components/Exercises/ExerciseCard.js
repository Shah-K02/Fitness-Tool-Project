import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Stack,
} from "@mui/material";

const ExerciseCard = ({ exercise }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card
      sx={{
        border: "1px solid var(--ink)",
        borderRadius: "8px",
        boxShadow: "none",
      }}
    >
      <CardMedia
        component="img"
        loading="lazy"
        sx={{
          height: 240,
          objectFit: "cover",
          overflow: "hidden",
          aspectRatio: "1/1",
          filter: "grayscale(1) contrast(1.08)",
        }}
        image={exercise.gifUrl}
        alt={`Gif showing ${exercise.name}`}
      />
      <CardContent>
        <Stack direction="row" spacing={1}>
          <Button
            sx={{
              color: "var(--ink)",
              background: "transparent",
              border: "1px solid var(--ink)",
              fontSize: "13px",
              borderRadius: "20px",
              textTransform: "capitalize",
              "&:hover": {
                bgcolor: "var(--ink)",
                color: "var(--paper)",
              },
            }}
          >
            {exercise.bodyPart}
          </Button>
          <Button
            sx={{
              color: "var(--ink)",
              background: "transparent",
              border: "1px solid var(--ink)",
              fontSize: "13px",
              borderRadius: "20px",
              textTransform: "capitalize",
              "&:hover": {
                bgcolor: "var(--ink)",
                color: "var(--paper)",
              },
            }}
          >
            {exercise.target}
          </Button>
        </Stack>
        <Typography
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
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default ExerciseCard;
