import { width } from "@mui/system";
import React from "react";
import { Container, Box, Stack, Typography, Grid } from "@mui/material";
const LogHistory = () => {
  return (
    <>
      <Grid
        container
        spacing={5}
        sx={{
          alignItems: "center",
          py: 5,
        }}>
        <Grid item xs={4} md={4} lg={4}>
          <Typography
            sx={{ color: "white", fontSize: "11px", fontWeight: 800 }}>
            BEAR LOG HISTORY
          </Typography>
        </Grid>
        <Grid item xs={8} md={8} lg={8}>
          <Box
            sx={{
              width: "100%",
              border: 1,
              borderColor: "white",
              height: "40px",
            }}></Box>
        </Grid>
      </Grid>
    </>
  );
};

export default LogHistory;
