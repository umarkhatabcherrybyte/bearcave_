import React, { useEffect, useState } from "react";
import { Typography, Box, Container, Stack, Paper, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { useLocation, useNavigate } from "react-router-dom";
import data from "../Data/data";
import "./FeedCard.css";
import { nftArray } from "../NFTs_data/NFTs_data";
import { embedGateway } from "../../APIRequests/IPFS";
const FeedCard = (props) => {
  const navigate = useNavigate();
  let date = new Date();
  date = date.toDateString();
  function handleClick(id) {
    navigate(`/feed-detail/${props.id}/${props.contractaddress}`);
  }
  let img = embedGateway(props.image)
  // console.log("feedcard image ", img);

  return (
    <>
      <Box
        sx={{
          background: "transparent",
          color: "white",
          borderRadius: "12px",
          border: "1px solid white",
          width: "95%",
          mt: "20px"
        }}
      >
        <Grid container spacing={3} alignItems="start">
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2 }}>
              <CardMedia
                onClick={() => {
                  let id = props.id;
                  handleClick(id);
                }}
                component="img"
                sx={{
                  objectFit: "contain",
                  borderRadius: "20px",
                  cursor: "pointer",
                  width: "200px",
                }}
                image={img}
                alt="Live from space album cover"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent
              sx={{
                flex: "1 2 auto",
                mx: "auto",
              }}
            >
              <div className="font">
                <div>
                  <h1 style={{
                    fontSize: "1.5em"
                  }}>
                    OBYC #{props.id} :: {props.title}
                  </h1>
                </div>
                <div >
                  <h3 style={{
                    fontSize: "1em"
                  }}>{props.name}</h3>

                  <p style={{
                    fontSize: "0.8em"
                  }}>{props.detail}</p>
                  <b style={{
                    fontSize: "0.8em"
                  }}>{props.date}</b>
                </div>
              </div>
            </CardContent>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default FeedCard;
