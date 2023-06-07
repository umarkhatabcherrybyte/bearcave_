import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Typography from "@mui/material/Typography";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useConnect, useDisconnect, useSigner } from "wagmi";

import "./ShopCard.css";
import {
  Box,
  Button,
  Container,
  Stack,
  Grid,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
} from "@mui/material";
import {
  addRaffleParticipant,
  deleteRaffle,
  updateRaffle,
} from "../../APIRequests/RaffleAPICalls";
import { Label, VerticalAlignBottom } from "@mui/icons-material";
import Web3 from "web3";
import { Contract, ethers, providers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { updateRaffleParticipant } from "../../APIRequests/RaffleAPICalls";
import { nftABI } from "../../APIRequests/nftsData";
import axios from "axios";
import { embedGateway } from "../../APIRequests/IPFS";
import { Link } from "react-router-dom";
import { adminAddress } from "../../APIRequests/Addresses";
import RewardInformationInstance from "./RewardInformationInstance";
const cardItems = [
  {
    img: "/img/shop-card-img-1.svg",
    name: "Raffle Eth",
  },
  {
    img: "/img/shop-card-img-2.svg",
    name: "Raffle Eth",
  },
  {
    img: "/img/shop-card-img-3.svg",
    name: "Raffle Eth",
  },
  {
    img: "/img/shop-card-img-4.svg",
    name: "Raffle Eth",
  },
  {
    img: "/img/shop-card-img-4.svg",
    name: "Raffle Eth",
  },
];

const btnStyle = {
  borderRadius: 48,
  background: "#000000",
  border: 0,
  boxShadow: "0 0 2px",
  borderColor: "white",
  m: 0,
  minWidth: "35px",
  height: "30px",
  "&:hover": {
    background: "#000000",
    border: 1,
  },
};
let iconStyles = {
  height: "30px",
  borderRadius: "50%",
  background: "white",
  border: "0.1px solid black",
  backgroundSize: "cover",
};
const ShopCard = (props) => {
  let raffleInstance = props.raffle;
  useEffect(() => {}, [props]);
  //console.log(props, "props");
  // console.log("raffle is ", props.item);
  // const { signer } = useSigner();
  const { address, isConnected } = useAccount();
  const [participants, setParticipants] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [walletAddress, setWalletAddress] = useState();
  const [participateCount, setParticipateCount] = useState(0);
  const [deleteIntent, setDeleteIntent] = useState(false);
  const [updateIntent, setUpdateIntent] = useState(false);
  const [updatedPrice, setUpdatedPrice] = useState(raffleInstance.etherium);
  const [updatedParticipants, setUpdatedParticipants] = useState(
    raffleInstance.maxParticipants
  );
  const [updatedDeadline, setUpdatedDeadline] = useState(
    raffleInstance.deadlineDate
  );

  const Update = async () => {
    let epochDate = new Date(updatedDeadline).getTime();

    const data = {
      ...raffleInstance,
      etherium: parseFloat(updatedPrice),
      maxParticipants: parseInt(updatedParticipants),
      deadlineDate: epochDate,
      //deadlineTime: time,
    };
    console.log("updated raffle is ", data);
    await updateRaffle(raffleInstance._id, data);
    console.log("Raffle updated !");
    await props.updator();
    setUpdateIntent(false);
  };
  const Delete = async () => {
    let raffleInstance = props.raffle;
    await deleteRaffle(raffleInstance._id);
    console.log("Raffle Deleted !");
    setDeleteIntent(false);
  };

  const cardText = {
    fontFamily: "Rubik",
    fontSize: 10,
  };

  async function connectWallet() {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const web3Provider = new providers.Web3Provider(window.ethereum);

      // If user is not connected to the Mumbai network, let them know and throw an error
      const { chainId } = await web3Provider.getNetwork();

      const signer = web3Provider.getSigner();
      console.log("Signer obtained ", signer);

      return signer;
    } catch (e) {
      return null;
    }
  }

  async function getImage() {
    if (raffleInstance.isERC721 == false) return 0;
    let signer = await connectWallet();
    if (!signer) return 0;
    let _contractAddress = props.contractAddress;
    let _tokenId = props.tokenId;
    // console.log({ _contractAddress, _tokenId });
    // console.log("creating it ..");
    let tokenImage =
      "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png";
    // try {
    let _theContract = new Contract(_contractAddress, nftABI, signer);
    // console.log("getting tokenURI", _theContract);
    let tokenUri = await _theContract.tokenURI(_tokenId);
    let _data = await axios.get(embedGateway(tokenUri));
    console.log("token data", _data);

    _data = _data.data;
    // console.log({ _data });
    // console.log(_data);
    tokenImage = embedGateway(_data.image);
    console.log("image is ", tokenImage);
    // } catch (e) {
    // console.log(e);
    // }
    setImageURL(tokenImage);
  }

  async function connectWallet() {
    const web3Provider = new providers.Web3Provider(window.ethereum);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 1) {
      window.alert("Change the network to Mainnet");
      throw new Error("Change network to Mainnet");
    }

    const signer = web3Provider.getSigner();
    let adr = await signer.getAddress();

    //console.log("Signer obtained ", signer, adr);
    return signer;
  }
  // const handlePartipation = async(participants, id, participantID, deadline){
  //   if(participants < 1 || deadline < Date.now()){
  //     console.log('No more participations left or it is expired!')
  //   }
  //   else{
  //     console.log('address.....',address,'doc;;;;;;;;;',docId);
  //   const data = {
  //    participantID: address,
  //   }
  //   setParticipantCount(false)
  //   const addParticipant = await addRaffleParticipant(docId, data);
  //   setParticipantCount(true)
  //   }
  // }

  async function addEntry() {
    console.log("adding entry ", { participateCount });
    if (participateCount >= 1) {
      await props.addToCart({
        id: props.id,
        image: imageURL,
        participateCount,
        priceToPay: props.price * participateCount,
      });
      await props.updator();
      alert("Added to cart ✅");
    } else {
      alert("Participate at least once !");
    }
  }

  useEffect(() => {
    setWalletAddress(address);
    // console.log(address, "acc");
    getImage();
  }, [address]);
  useEffect(() => {
    setParticipants(props.participants);
  }, []);

  function range(start, end) {
    var ans = [0];
    for (let i = 1; i <= end; i++) {
      ans.push(i);
    }
    return ans;
  }
  let timeLeft = props.deadline - Date.now();
  timeLeft = 100000;
  console.log("participants left", props.participants);
  return (
    <>
      {deleteIntent == false && updateIntent == false && (
        <Grid spacing={4} columns={4}>
          <Card
            sx={{
              height: "fit-content",
              background: "rgba(255, 255, 255, 0.1)",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              margin: "20px",
            }}
          >
            <Typography
              textTransform="uppercase"
              sx={{
                fontFamily: "Rubik",
              }}
            >
              {props.title}
            </Typography>
            {/* <p>{props.title}</p> */}
            <Box display={"flex"} justifyContent={"center"} width={"100%"}>
              <CardMedia
                component="img"
                image={
                  raffleInstance.isERC721 == undefined ||
                  raffleInstance.isERC721 == true
                    ? imageURL
                    : raffleInstance.image
                }
                //image = '/img/shop-card-img-1.svg'
                alt={props.contractAddress}
                sx={{
                  p: 0,
                  borderRadius: "20px",
                  // pb:"20px",
                  marginBottom: "20px",
                  // objectFit: "contain",
                  height: "200px",
                  width: "200px",
                }}
              />
            </Box>
            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              {
                // raffleInstance.webiteLink &&
                <Link
                  to={
                    raffleInstance.websiteLink
                      ? raffleInstance.websiteLink
                      : "#"
                  }
                >
                  <img
                    style={iconStyles}
                    src="https://cdn-icons-png.flaticon.com/512/93/93618.png"
                    alt="website link"
                  />
                </Link>
              }
              {
                // raffleInstance.discordLink &&
                <Link
                  to={
                    raffleInstance.discordLink
                      ? raffleInstance.discordLink
                      : "#"
                  }
                >
                  <img
                    style={iconStyles}
                    src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-round-line-black-icon.svg"
                    alt="discord link"
                  />
                </Link>
              }
              {
                // raffleInstance.twitterLink &&
                <Link
                  to={
                    raffleInstance.twitterLink
                      ? raffleInstance.twitterLink
                      : "#"
                  }
                >
                  <img
                    style={iconStyles}
                    src="https://www.shareicon.net/data/128x128/2016/07/09/118334_twitter_512x512.png"
                    alt="twitter link"
                  />
                </Link>
              }

              {
                // raffleInstance.marketplaceLink &&
                <Link
                  to={
                    raffleInstance.marketplaceLink
                      ? raffleInstance.marketplaceLink
                      : "#"
                  }
                >
                  <img
                    style={{
                      ...iconStyles,
                      background: "none",
                      border: "none",
                    }}
                    src="https://openseauserdata.com/files/cbc0504995e1d015ff6fdc4e6a9afbdf.svg"
                    alt="marketplace link"
                  />
                </Link>
              }
            </CardActions>
            <CardContent>
              <table
                style={
                  {
                    // display: "flex",
                    // flexDirection: "column",
                    // justifyContent: "center",
                    // width: "100%",
                  }
                }
              >
                {/* <RewardInformationInstance
                  title={"Category"}
                  value={props.ctg}
                />
                 */}
                <RewardInformationInstance
                  title={"Price"}
                  value={props.price}
                />
                <RewardInformationInstance
                  title={"Available"}
                  value={props.participants == 0 ? "No" : "Yes"}
                />
                {timeLeft > 0 ? (
                  <RewardInformationInstance
                    title={"Expires"}
                    value={new Date(props.deadline * 1).toLocaleDateString()}
                  />
                ) : (
                  <Typography sx={cardText}>Expred</Typography>
                )}

                {/* <tr
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "400px",
                  }}
                >
                  <td style={{ width: "100px" }}>
                    <Typography sx={cardText}>Available</Typography>
                  </td>
                  <td>:</td>
                  <td style={{ width: "200px" }}>

                    <Typography sx={cardText}>{props.participants ==0 ? "No" : "Yes"}</Typography>


                  </td>
                </tr>
                <tr>
                  {timeLeft > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "400px",
                      }}
                    >
                      <td style={{ width: "100px" }}>
                        <Typography sx={cardText}>Expires</Typography>
                      </td>
                      <td>:</td>
                      <td
                        className="font"
                        style={{ width: "200px", fontSize: 10 }}
                      >
                        {new Date(props.deadline * 1).toLocaleDateString()}
                      </td>
                    </div>
                  )}

                  <td>
                    <Typography sx={cardText}>{cardItems.deadline}</Typography>
                  </td>
                </tr>
                 */}
              </table>
            </CardContent>
            {timeLeft > 0 ? (
              <CardActions
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box
                  sx={{
                    minWidth: 120,
                    background: "black",
                    color: "white",
                  }}
                >
                  <FormControl
                    sx={{
                      color: "white",
                    }}
                    fullWidth
                  >
                    <InputLabel
                      sx={{
                        color: "white",
                      }}
                      id="demo-simple-select-label"
                    >
                      Count
                    </InputLabel>
                    <Select
                      sx={{
                        color: "white",
                        height: "40px",
                      }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={participateCount}
                      label="Age"
                      onChange={(e) => setParticipateCount(e.target.value)}
                    >
                      {range(0, props.participants).map((item) => {
                        return <MenuItem value={item}>{item}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  variant="contained"
                  color={timeLeft > 0 && participants == 0 ? "info" : "success"}
                  onClick={async (e) => {
                    if (timeLeft > 0 && participants == 0) {
                      return 0;
                    }

                    await addEntry();
                  }}
                >
                  {/* {props.deadline < Date.now() || props.participants < 1? "CANT PARTICIPATE" : "PARTICIPATE"}             */}
                  <span className="font">
                    {timeLeft <= 0
                      ? "Expired"
                      : participants == 0
                      ? "Filled"
                      : "Add To Cart"}
                  </span>
                </Button>
              </CardActions>
            ) : (
              <Typography sx={cardText}> The Raffle is Expired</Typography>
            )}
            {walletAddress == adminAddress && (
              <CardActions
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {" "}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={(e) => setDeleteIntent(true)}
                >
                  {/* {props.deadline < Date.now() || props.participants < 1? "CANT PARTICIPATE" : "PARTICIPATE"}             */}
                  <span className="font">Delete</span>
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={(e) => setUpdateIntent(true)}
                >
                  {/* {props.deadline < Date.now() || props.participants < 1? "CANT PARTICIPATE" : "PARTICIPATE"}             */}
                  <span className="font">Update</span>
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
      )}

      {deleteIntent == true && (
        <>
          <Box
            color={"White"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            position={"absolute"}
            top={"0"}
            left={"0"}
            width={"100vw"}
            height={"100vh"}
            zIndex={"30"}
            style={{ background: "rgba(0,0,0,0.9)" }}
          >
            {" "}
            <Box
              color={"White"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              width={"70vw"}
              height={"70vh"}
              borderRadius={"20px"}
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <Typography fontSize={"3em"}>
                Confirm Delete Operation !
              </Typography>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
              >
                <Button
                  style={{ marginRight: "20px" }}
                  variant="contained"
                  color={"error"}
                  onClick={(e) => {
                    Delete();
                  }}
                >
                  Confirm
                </Button>
                <Button
                  variant="contained"
                  color={"warning"}
                  onClick={(e) => {
                    setDeleteIntent(false);
                  }}
                >
                  No
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      )}
      {updateIntent == true && (
        <>
          <Box
            color={"White"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            position={"absolute"}
            top={"0"}
            left={"0"}
            width={"100vw"}
            minHeight={"100vh"}
            height={"fit-content"}
            zIndex={"30"}
            style={{ background: "rgba(0,0,0,0.9)" }}
          >
            {" "}
            <Box
              color={"White"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"70vw"}
              height={"70vh"}
              borderRadius={"20px"}
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <Typography fontSize={"2.5em"}>Update the Reward</Typography>

              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"space-between"}
                height={"100%"}
                padding={"20px"}
                spacing={10}
              >
                <label for={"price"}>Enter Updated Price</label>
                <Input
                  defaultValue={updatedPrice}
                  onChange={(e) => setUpdatedPrice(e.target.value)}
                  id={"price"}
                  type="text"
                />
                <label for={"participants"}>Enter Updated Particpants</label>
                <Input
                  defaultValue={updatedParticipants}
                  onChange={(e) => setUpdatedParticipants(e.target.value)}
                  id={"participants"}
                  type="number"
                />
                <label for={"deadline"}>Enter new Deadline</label>
                <Input
                  defaultValue={new Date(updatedDeadline)}
                  onChange={(e) => setUpdatedDeadline(e.target.value)}
                  style={{ color: "white" }}
                  id={"deadline"}
                  type="date"
                />
                <Box display={"flex"}>
                  <Button
                    style={{ marginRight: "20px" }}
                    color={"primary"}
                    variant={"contained"}
                    onClick={Update}
                  >
                    Update
                  </Button>
                  <Button
                    color={"error"}
                    variant={"contained"}
                    onClick={(e) => {
                      setUpdateIntent(false);
                    }}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default ShopCard;
