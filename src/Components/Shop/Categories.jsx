import { Button, Grid } from "@mui/material";
import React from "react";

const Categories = ({ props }) => {
  console.log({ props });
  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid item xs={4} sm={2}>
        <Button variant="outlined">{props}</Button>
      </Grid>
    </Grid>
  );
};

export default Categories;
