import { Typography, Box, Container, Stack, Paper } from "@mui/material";
import React, { useState, useEffect } from "react";
import Buttons from "../Buttons/Buttons";
import Description from "../Description/Description";
import MainHeadings from "../MainHeadings/MainHeadings";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import "./Feeds.css";
import FeedCard from "../FeedCard/FeedCard";
import { nftArray } from "../NFTs_data/NFTs_data";
import axios from "axios";
import { getLoreData } from "../../APIRequests/LoreAPICalls";
import { useLocation, useNavigate } from "react-router-dom";
import { base_url } from "../../base_urls";
import CircularProgress from "@mui/material/CircularProgress";
import { nftsAddress } from "../../APIRequests/nftsData";
import { LoginSharp } from "@mui/icons-material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  padding: theme.spacing(1),
}));
const Feeds = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loreData, setLoreData] = useState([]);
  const [loreAndLogData, setLoreAndLogData] = useState([]);
  const [logData, setLogData] = useState([]);
  const [mainArray, setMainArray] = useState([]);
  const nfts = [
    {
      img: "",
      lore: "",
      loreTraits: "",
      date: "",
      logEntry: "",
      logTraits: "",
      logHistory: "",
    },
  ];

  function includes(arr,element){
    for (let j = 0; j < arr.length; j++) {
      const obj = arr[j];
      if(obj.id==element.id){
        return true;
      }
    }

    return false;
  }
  const getLoreAndLogData = async () => {
    const { data } = await axios.get(`${base_url}/logandloredata`);
    // setTimeout(async() => {
    const { data: hello } = await axios.get(`${base_url}/logandloredata`);
    let lores=[];
    let logs=[];
    for (let j = 0; j < hello.length; j++) {
      const obj = hello[j];
      if(obj.title=="Bear Lore"){
        if(includes(lores,obj)==false){
          lores.push(obj);
        }
      }
      else{
        logs.push(obj);
      }
      
    }
let filteredData=[];
filteredData=lores.slice();
filteredData = filteredData.concat(logs);
console.log("log and lore data ",filteredData);
    
    setLoreAndLogData(filteredData);

    // }, 2000);

    
    // console.log(hello);
  };
  // const getLores = async () => {
  //   const { data } = await axios.get(`${base_url}/data`);
  //   setLoreAndLogData(data.lores);
  //   console.log(loreData);
  // };
  // const getLogData = async () => {
  //   const { data } = await axios.get(`${base_url}/bearlogdata`);
  //   const { data: hello } = await axios.get(`${base_url}/bearlogdata`);

  //   setLoreAndLogData(hello.logData);
  // };
  function handleClick(id) {
    navigate(`/feed-detail/${id}`);
  }

  useEffect(() => {
    setIsLoading(true);
    console.log("useEffect running");
    getLoreAndLogData();
  }, []);
  useEffect(() => {
    setTimeout(async () => {
      setIsLoading(false);
    }, 1000);
  }, [loreAndLogData]);
  return (
    <div>
      <Container

        maxWidth="100%"

        sx={{
          mt: "7rem",
          mb: "0rem",
          // width: "100vw"
        }}

      >
        <Grid
          //  container 
          spacing={1}>
          <Grid item xs={12} sm={9.5} md={9.5}>
            <MainHeadings heading="CAVE CLUB FEED" className="main-heading" />
            <Description
              text="Description / Helper text"
              className="description-text"
            />
          </Grid>
        </Grid>
      </Container>
      <Container
        sx={{
          pt: "2rem", width: "100%"
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        ) : (
          <Grid

          >
            {loreAndLogData &&
              loreAndLogData.length > 0 &&
              loreAndLogData.map((obj) => {
                return (
                  <Grid display={"flex"} width={"100%"} justifyContent={"center"} alignItems={"space-around"}>
                    <FeedCard
                      image={obj.imageAddress}
                      id={obj.id}
                      name={obj.name}
                      title={obj.title}
                      detail={obj.detail}
                      dateTime={obj.timestamp}
                      contractaddress={nftsAddress}
                    />
                  </Grid>
                );
              })}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Feeds;
