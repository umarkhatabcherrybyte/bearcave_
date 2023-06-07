import React from "react";
import Grid from "@mui/material/Grid";
import { Container, Box, Stack, Typography } from "@mui/material";
const box = {
  height: "90px",
  width: "90px",
  border: 1,
  borderRadius: '5px',
  borderColor: "white",
  "@media (min-width: 320px)": {
    height: "50px",
    width: '30px',
  },
  "@media (min-width: 760px)": {
    width: "30%",
  },
};
const Traits = () => {
  return (
    <>
      <Grid
        container
        spacing={5}
        sx={{
          alignItems: "center",
          py: '25px', 
        }}>
        <Grid item xs={4} md={4} lg={4}>
          <Typography
            sx={{ color: "white", fontSize: "12px", fontWeight: 800 }}>
            TRAITS
          </Typography>
        </Grid>
        <Grid item xs={8} md={8} lg={8}>
          <Stack
            direction="row"
            spacing={3}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}>
            <Box sx={box}></Box>
            <Box sx={box}></Box>
            <Box sx={box}></Box>
            <Box sx={box}></Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Traits;
