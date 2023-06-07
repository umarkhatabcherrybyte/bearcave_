import React, { useEffect, useState } from "react";
import axios from "axios";
import { base_url } from "../../base_urls";
import {
  Box,
  Button,
  Container,
  Stack,
  Grid,
  Avatar,
  Typography,
  TextField,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MainHeadings from "../MainHeadings/MainHeadings";
import data from "../Data/data";
import Description from "../Description/Description";
import Web3 from "web3";
import { useAccount, useSigner } from "wagmi";
import { getNFTs } from "../../APIRequests/Alchemi";
import { embedGateway } from "../../APIRequests/IPFS";
import { nftsAddress } from "../../APIRequests/nftsData";
import { useNavigate } from "react-router-dom";
//import { CircularProgress } from "@mui/material/CircularProgress";
import { Contract, providers } from "ethers/lib";
import { getRaffle } from "../../APIRequests/RaffleAPICalls";
import {
  searchProfile,
  createProfile,
  updateProfile,
} from "../../APIRequests/ProfileAPICalls";
import ProfileInstance from "./ProfileInstance";
const Collection = () => {
  const { signer } = useSigner();
  const [profile, setProfile] = useState([]);
  const [name, setName] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [solAddress, setSolAddress] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [editName, setEditName] = useState(false);
  const [editEthAddress, setEditEthAddress] = useState(false);
  const [editSolAddress, setEditSolAddress] = useState(false);
  const [editDiscordId, setEditDiscordId] = useState(false);
  const { address, isConnected, isDisconnected } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNFTs] = useState([]);
  const [latestNFTs, setLatestNFTs] = useState([]);
  const [balance, setBalance] = useState();
  const [participatedNFTs, setParticipatedNFTs] = useState([]);
  const navigate = useNavigate();
  const subAddress =
    address.substring(0, 3) +
    `...` +
    address.substring(address.length - 4, address.length - 1);
  console.log(subAddress);
  let contractAddress = "0xEf47244421a91942683c3C54385eb673f3d96023";
  let bearriesABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "Admin",
          type: "address",
        },
        {
          internalType: "address",
          name: "_platformAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_nftContractAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokensPerNFT",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "contractAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "Claim",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [],
      name: "DAILY_REWARD_DURATION",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "_lastClaim",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "airdrop",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "calculateTokensToClaim",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[]",
          name: "tokenIds",
          type: "uint256[]",
        },
      ],
      name: "claimTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "nftContractAddress",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "tokensPerNFT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  useEffect(() => {
    getNFTsOfUser();
  }, [address, isConnected, profile]);

  useEffect(() => {
    if (latestNFTs.length < nfts.length) {
      hanldeNftLoad();
    }
  }, [address, isConnected, nfts]);

  useEffect(() => {
    searchProfileData();
    getBalance();
    getRaffles();
  }, []);
  const getRaffles = async () => {
    let raf = await getRaffle();
    console.log(raf);
    var arr = [];

    for (let i = 0; i < raf.length; i++) {
      console.log("Raffle # " + i, raf[i]);
      for (let j = 0; j < raf[i].participantIDs.length; j++) {
        console.log(
          "Raffle # " + [i],
          "Participant # " + [j],
          raf[i].participantIDs[j]
        );
        // console.log("current address: " + address);
        arr.push(raf[i]);

        if (raf[i].participantIDs[j] == address) {
          console.log("You own: " + raf[i].participantIDs[j]);
          // setParticipatedNFTs(raf[i]);
          arr.push(raf[i]);
        }
      }
      // for (let j = 0; j < raf.participantIDs.length(); j++) {
      //   console.log(raf[i].participantIDs[j]);
      //   if (address == raf.participantIDs[j]) {
      //     console.log(
      //       `The raffle ${raf[i]} is participated by ${raf.participantIDs[j]}`
      //     );
      //   } else {
      //   }
      // }
    }
    setParticipatedNFTs(arr);
  };
  function setProfileData(res) {
    setProfile([
      {
        id: 0,
        name: "discordID",
        value: res.data.discordID,
      },
      {
        id: 1,

        name: "ethAddress",
        value: res.data.ethAddress,
      },
      {
        id: 2,

        name: "solAddress",
        value: res.data.solAddress,
      },
      {
        id: 4,
        name: "name",
        value: res.data.name,
      },
    ]);
  }

  const createProfileData = async (data) => {
    await axios
      .post(`${base_url}/profile`, data)
      .then((res) => {
        setProfileData(res);
        console.log("profile is ", res.data);

        // setName(res.name);
        // console.log();
        // setDiscordId(res.data.discordID);
        // setEthAddress(res.data.ethAddress);
        // console.log();
        // setSolAddress(res.data.solAddress);
        // setName(res.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const searchProfileData = async () => {
    await axios
      .get(`${base_url}/searchprofile/` + address)
      .then((res) => {
        setProfileData(res);

        //
      })
      .catch((err) => {
        let profileData = {
          walletAddress: address,
          name: "no data to show",
          ethAddress: "no data to show",
          solAddress: "no data to show",
          discordID: "no data to show",
        };
        createProfileData(profileData);
      });
  };
  const updateProfileData = async (data) => {
    await axios
      .put(`${base_url}/updateprofile/` + address, data)
      .then((res) => {
        searchProfileData();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  async function handleSave() {
    let profileData = {
      walletAddress: address,
      name: name,
      ethAddress: ethAddress,
      solAddress: solAddress,
      discordID: discordId,
    };
    await updateProfileData(profileData);
    // searchProfileData();
    // setEditName(false);
  }
  async function getNFTsOfUser() {
    getNFTs(address, nftsAddress).then((res) => {
      if (res.length === 0) {
        setIsLoading(false);
      } else {
        setNFTs(res);
      }
    });
  }

  async function hanldeNftLoad() {
    let nft = nfts.map((item) => {
      let img = item.rawMetadata.image
        ? embedGateway(item.rawMetadata.image)
        : "https://www.flop.cl/wp-content/uploads/2022/09/woocommerce-placeholder.png";

      return {
        ...item,
        image: img,
      };
    });

    setLatestNFTs(nft);
    setIsLoading(false);
  }
  async function connectWallet() {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(window.ethereum);
      console.log(window.web3);
      return true;
    }
    return false;
  }
  async function getBalance() {
    if (!address) {
      return 0;
    }
    // let signer = await connectWallet();

    let _theContract = new Contract(contractAddress, bearriesABI, signer);
    let res = await _theContract.balanceOf(address);
    res = parseInt(res / 10 ** 18);
    console.log("balance is ", res);
    setBalance(res);
  }
  console.log("participated", participatedNFTs);
  function getMinimal(arr, start = 0, _last) {
    let last = 0;
    if (!_last) last = arr.length;
    let length = arr.length;
    return (
      arr.toString().slice(start, 3) +
      "..." +
      arr.toString().slice(length - 2, last)
    );
  }

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          pt: 15,
        }}
      >
        <MainHeadings heading="YOUR COLLECTION" />
        <Description text="THIS IS YOUR PERSONAL  BEAR CAVE DASHBOARD. HERE YOU CAN ACCESS FEATURES LIKE THE SHOP, CREATIVE LORE, PUBLIC FEED & MORE!" />
      </Container>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pt: 10,
          }}
        >
          {/* <CircularProgress sx={{ color: "white" }} /> */}
        </Box>
      ) : (
        <Grid>
          {latestNFTs.length == 0 ? (
            <Container
              sx={{
                flexDirection: "column",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pt: 10,
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  fontSize: "3em",
                  color: "white",
                  fontFamily: "Rubik",
                  fontStyle: "normal",
                  fontWeight: "500",
                  fontSize: "40px",
                  lineHeight: "41px",
                  letterSpacing: "0.01em",
                  textTransform: "uppercase",
                  p: 1,
                }}
              >
                OBYC NFT required to access this page
              </Box>
              <Button
                sx={{
                  textAlign: "center",
                  fontSize: "3em",
                  color: "white",
                  fontFamily: "Rubik",
                  fontStyle: "normal",
                  fontWeight: "500",
                  fontSize: "40px",
                  lineHeight: "41px",
                  letterSpacing: "0.01em",
                  textTransform: "uppercase",
                  background: "#FFA370;",
                  p: 1,
                }}
                href={"https://opensea.io/collection/okaybearsyachtclub"}
              >
                GET NFT
              </Button>
            </Container>
          ) : (
            <Container
              maxWidth="lg"
              sx={{
                pt: 10,
              }}
            >
              <Box
                p={2}
                sx={{
                  background: "transparent",
                  color: "white",
                  borderRadius: "12px",
                  border: "1px solid white",
                  mb: 2,
                  overflow: "scroll",
                }}
              >
                <Grid item display="flex" justifyContent="center">
                  PROFILE
                </Grid>
                {profile.length > 0 &&
                  profile.map((item) => {
                    return (
                      <ProfileInstance
                        key={item.id + item.name}
                        updator={updateProfileData}
                        profile={profile}
                        item={item}
                      />
                    );
                  })}
              </Box>
              {/* 
              <Grid container spacing={0} direction="row">
                {latestNFTs.map((item) => (
                  <Grid
                    spacing={2}
                    key={item.contract.address + item.tokenId}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                  >
                    <img
                      style={{
                        width: "320px",
                        height: "320px",
                        objectFit: "contain",
                        borderRadius: "20px",
                      }}
                      src={item.image}
                    />
                  </Grid>
                ))}

              </Grid>
               */}
            </Container>
          )}
          {participatedNFTs ? (
            <Container maxWidth="lg">
              <Box
                p={2}
                sx={{
                  background: "transparent",
                  color: "white",
                  borderRadius: "12px",
                  border: "1px solid white",
                  mb: 2,
                }}
              >
                {/*-------------------Grid was here-----------------------*/}
                {/* <Grid style={{ fontWeight: "800" }} container spacing={2}>
                  <Grid item xs={1.71}>
                    RAFFLE ID
                  </Grid>
                  <Grid item xs={1.71}>
                    RAFFLE NAME
                  </Grid>
                  <Grid item xs={1.71}>
                    CATEGORY
                  </Grid>
                  <Grid item xs={1.71}>
                    TOKEN ID
                  </Grid>
                  <Grid item xs={1.71}>
                    Contract Address
                  </Grid>
                  <Grid item xs={1.71}>
                    EXPIRY
                  </Grid>
                  <Grid item xs={1.71}>
                    Winner
                  </Grid>
                </Grid>
                <Grid>
                  {participatedNFTs.map((item) => {
                    return (
                      <Grid container spacing={2}>
                        <Grid item md={1.71} sm={12}>
                          {getMinimal(item._id, 0)}
                        </Grid>
                        <Grid item xs={1.71}>
                          {item.rewardName}
                        </Grid>
                        <Grid item xs={1.71}>
                          {item.category}
                        </Grid>
                        <Grid item xs={1.71}>
                          {item.tokenID}
                        </Grid>
                        <Grid item xs={1.71}>
                          {getMinimal(item.contractAddress, 0)}

                          
                        </Grid>
                        <Grid item xs={1.71}>
                          {new Date(item.deadlineDate) - Date.now() > 0
                            ? new Date(item.deadlineDate).toDateString()
                            : "Expired"}
                        </Grid>
                        <Grid item xs={1.71} style={{ width: "auto" }}>
                          {item.winnerAnnounced
                            ? "Announced"
                            : "To be Announced"}
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid> */}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          style={{ fontWeight: "800" }}
                          sx={{
                            color: "white",
                          }}
                        >
                          RAFFLE ID
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "800" }}
                          sx={{
                            color: "white",
                          }}
                        >
                          RAFFLE NAME
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "800" }}
                          sx={{
                            color: "white",
                          }}
                        >
                          CATEGORY
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "800" }}
                          sx={{
                            color: "white",
                          }}
                        >
                          TOKEN ID
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "800" }}
                          sx={{
                            color: "white",
                          }}
                        >
                          Contract Address
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "800" }}
                          sx={{
                            color: "white",
                          }}
                        >
                          EXPIRY
                        </TableCell>
                        <TableCell
                          style={{ fontWeight: "800" }}
                          sx={{
                            color: "white",
                          }}
                        >
                          Winner
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {participatedNFTs.map((item, index) => {
                        return (
                          <TableRow key={item._id + index}>
                            <TableCell
                              sx={{
                                color: "white",
                              }}
                            >
                              {getMinimal(item._id, 0)}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                              }}
                            >
                              {item.rewardName}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                              }}
                            >
                              {item.category}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                              }}
                            >
                              {/* {getMinimal(item.tokenID, 0)} */}
                              {item.tokenID}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                              }}
                            >
                              {getMinimal(item.contractAddress, 0)}
                            </TableCell>
                            <TableCell
                              sx={{
                                color: "white",
                              }}
                            >
                              {console.log(
                                new Date(item.deadline * 1).toLocaleDateString()
                              )}
                              {new Date(
                                item.deadline * 1
                              ).toLocaleDateString() > Date.now()
                                ? new Date(item.deadlineDate * 1).toDateString()
                                : new Date(
                                    item.deadlineDate * 1
                                  ).toDateString()}
                            </TableCell>
                            <TableCell
                              style={{ width: "auto" }}
                              sx={{
                                color: "white",
                              }}
                            >
                              {console.log(item.winnerAnnounced)}
                              {item.winnerAnnounced
                                ? "Announced"
                                : "To be Announced"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Container>
          ) : (
            <Typography sx={{ color: "white" }}>
              YOU HAVE NOT PARTICIPATED IN ANY RAFFLE!
            </Typography>
          )}
        </Grid>
      )}
    </>
  );
};

export default Collection;
