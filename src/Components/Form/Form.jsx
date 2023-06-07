import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { Typography, Grid } from "@mui/material";
const Form = (props) => {
  const {setValue, setValue2} =  props
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          // alignItems: "center",
        }}>
        <Grid item xs={4} md={4} lg={4} sx={{}}>
          <Typography
            sx={{
              pt: '6px',
              color: "white",
              fontSize: "12px",
              fontWeight: 800,
              fontFamily: 'Rubik',
            }}className = 'font'>
            {props.firstInput}
          </Typography>
        </Grid>
        <Grid
          item
          xs={8}
          md={8}
          lg={8}
          sx={{
            pt: 0,
          }}>
          <TextField className = 'font'
            id="filled-basic"
            label=""
            variant="filled"
            //onChange={() ser}
            fullWidth
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              input: {
                outline: "none",
                border: "none",
                border: "1px solid white",
                background: "#BABABA",
                padding: 0,
                pt: 0,
                borderRadius: "5px",
                color: 'black',
                fontFamily: 'Rubik',
                height: 28,
              },
              color: 'white',
            }}
          />
        </Grid>
        <Grid item xs={4} md={4} lg={4}>
          <Typography
            sx={{
              pt: '2rem',
              color: "white",
              fontSize: "12px",
              fontWeight: 800,
              fontFamily: 'Rubik',
            }}className = 'font'>
            {props.secondInput}
          </Typography>
        </Grid>
        <Grid item xs={8} md={8} lg={8}>
          <TextField
            id="filled-multiline-static"
            multiline
            rows={4}
            variant="filled"
            fullWidth
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              // px: "0px !important",
              textArea: {
                border: "1px solid white",
                background: "#BABABA",
                borderRadius: "5px",
                padding: "0 !important",
                color: 'black',
                fontFamily: 'Rubik',
              },
              "& .fROKwd":{
                px:"0 !important"
              }
            }}
          />
        </Grid>
      </Grid>

      {/*<Grid direction="column" spacing={2}>
        <Stack direction="row" spacing={12}>
          
          
        </Stack>
        <Stack direction="row" spacing={12}>
          

          
        </Stack>
      </Grid> */}
    </>
  );
};

export default Form;
