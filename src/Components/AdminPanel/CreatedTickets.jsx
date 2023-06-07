import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Typography from "@mui/material/Typography";
import { Box, Button, Container, Stack, Grid, Avatar } from "@mui/material";
import data from "../Data/data";
const CreatedTickets = (props) => {
  return (
    <Grid spacing={4} columns={5}>
      <Card
        sx={{
          maxWidth: 230,
          height: 470,
          background: " rgba(255, 255, 255, 0.1)",
          color: "white",
          margin: 1,
        }}
      >
        <Typography
          textTransform="uppercase"
          sx={{
            pt: 2,
            pl: 4,
            fontFamily: "Rubik",
          }}
        >
          {/* {props.title} */}
          Name
        </Typography>
        {/* <p>{props.title}</p> */}
        <CardMedia
          component="img"
          height=""
          image={data[0].img}
          //image = '/img/shop-card-img-1.svg'
          alt="Paella dish"
          sx={{
            p: 0,
          }}
        />
        <CardContent>
          {/* <table>
            <tr>
              <th>ADDRESS</th>
              <td>{props.contract}</td>
            </tr>
            <tr>
              <th>ID</th>
              <td>{props.id}</td>
            </tr>
            <tr>
              <th>ETH</th>
              <td>{props.eth}</td>
            </tr>
            <tr>
              <th>DEADLINE</th>
            </tr>
            <tr>
              <td>{props.date}</td>
              <td>{props.time}</td>
            </tr>
          </table> */}
          <table>
            <tr>
              <th>ADDRESS</th>
              <td>:</td>
              {/* currentTime.slice(0,4) +  currentTime.slice(7) */}
              <td>{props.contract.slice(0,4) + '...' + props.contract.slice(-4)}</td>
            </tr>
            <tr>
              <th>TOKEN_ID</th>
              <td>:</td>
              <td>{props.id}</td>
            </tr>
            <tr>
              <th>ETHERIUM</th>
              <td>:</td>
              <td>{props.eth}</td>

            </tr>
            <tr>
              <th>EXP.DATE</th>
              <td>:</td>
              <td>{props.date}</td>
            </tr>
            {/* <tr>
              <th>EXP.TIME</th>
              <td>:</td>
              <td>{props.time}</td>
            </tr> */}
        </table>
        </CardContent>
        <CardActions disableSpacing sx={{ pt: 0 }}>
          <Stack
            width="100%"
            direction="row"
            justifyContent="space-around"
          ></Stack>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CreatedTickets;
