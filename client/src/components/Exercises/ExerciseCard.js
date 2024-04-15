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
    <Card>
      <CardMedia
        component="img"
        loading="lazy"
        sx={{ height: 240, objectFit: "cover" }}
        image={exercise.gifUrl}
        alt={`Gif showing ${exercise.name}`}
      />
      <CardContent>
        <Stack direction="row">
          <Button
            sx={{
              ml: "21px",
              color: "#ffff",
              background: "#dc0000",
              fontSize: "14px",
              borderRadius: "20px",
              textTransform: "capitalize",
              "&:hover": {
                bgcolor: "grey",
              },
            }}
          >
            {exercise.bodyPart}
          </Button>
          <Button
            sx={{
              ml: "21px",
              color: "#36454f",
              background: "#ffa500",
              fontSize: "14px",
              borderRadius: "20px",
              textTransform: "capitalize",
              "&:hover": {
                bgcolor: "grey",
              },
            }}
          >
            {exercise.target}
          </Button>
        </Stack>
        <Typography
          ml="21px"
          color="#36454f"
          fontWeight="bold"
          sx={{ fontSize: { lg: "24px", xs: "20px" } }}
          mt="11px"
          pb="10px"
          textTransform="capitalize"
        >
          {exercise.name}
        </Typography>
        <Typography
          ml="21px"
          color="#36454f"
          fontWeight="bold"
          sx={{ fontSize: { lg: "15px", xs: "12px" } }}
          mt="11px"
          pb="10px"
          textTransform="capitalize"
        >
          Equipment: {exercise.equipment}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

export default ExerciseCard;
