import { Container, Typography } from '@mui/material'
import React from 'react'
const Description = (props) => {
  return (
    <>
        <Typography component="div"
              sx={{
                fontSize: 10,
                fontWeight: 500,
                color: "white",
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontFamily: 'Rubik',
              }}className = 'font'>
              
            {props.text}
          </Typography>
    </>
  )
}

export default Description