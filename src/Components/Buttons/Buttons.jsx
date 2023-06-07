import { Button } from "@mui/material";
import React from "react";
import './Buttons.css'
import { Typography } from '@mui/material';
const btnStyle = {
  borderRadius: "48px",
  background: "#000000",
  border: 1,
  borderColor: "white",
  m: 0,
  boxShadow: 1,
  "&:hover": {
    background: "#000000",
    border: 1,
  },
};
const Buttons = (props) => {
  return (
    <div>
      <Button sx={btnStyle} variant="contained" size="small">
     
       <p className = 'btn-text' >{props.text}</p> 
        
      </Button>
    </div>
  );
};

export default Buttons;
