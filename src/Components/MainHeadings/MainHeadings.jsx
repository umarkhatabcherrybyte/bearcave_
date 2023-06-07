import { Typography, Box, Container } from "@mui/material";
import React from "react";
const MainHeadings = (props) => {
  return (
    // <Container maxWidth = "md"
    // sx = {{
    //   pt: "7rem",
    // }}>
    <Typography component="div" className="font">
      <Box
        sx={{
          fontSize: "1.7em",
          fontWeight: 500,
          color: "white",
        }}
        className="font"
      >
        <span className="font">{props.heading}</span>
      </Box>
      {/* <Box
              sx={{
                fontSize: 36,
                fontWeight: 500,
                color: "white",
              }}>
              {props.heading}
            </Box> */}
    </Typography>
    // </Container>
  );
};

export default MainHeadings;
