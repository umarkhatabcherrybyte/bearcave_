import { Typography, Box, Container, Stack, Paper } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import Buttons from "../Buttons/Buttons";
import Description from "../Description/Description";
import MainHeadings from "../MainHeadings/MainHeadings";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import "../Feeds/Feeds.css";
import FeedCard from "../FeedCard/FeedCard";
import { nftArray } from "../NFTs_data/NFTs_data";
import axios from "axios";
import { getLoreData } from "../../APIRequests/LoreAPICalls";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { searchLore } from "../../APIRequests/LoreAPICalls";
import { TextField, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { base_url } from "../../base_urls";
import { Contract, ethers, providers } from "ethers";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { updateHistoryLog } from "../../APIRequests/LogAPICalls";
import CancelIcon from "@mui/icons-material/Cancel";

import SaveIcon from "@mui/icons-material/Save";
import { embedGateway } from "../../APIRequests/IPFS";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  padding: theme.spacing(1),
}));
const FeedDetail = () => {
  // const {signer} = useSigner()
  const navigate = useNavigate();
  const params = useParams();
  let date = new Date();
  date = date.toDateString();
  const { address, isConnected, isDisconnected } = useAccount();
  const [editeableDetail, setEditeableDetail] = useState("");
  const [editeableId, setEditId] = useState();
  const [edit, setEdit] = useState(false);
  const [ownerOfNFT, setOwnerOfNFT] = useState(false);
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
  const [loreApiData, setLoreApiData] = useState({
    sel_nft_id: 0,
    name: "",
    description: "",
    //title: 'Bear Lore',
    img: "",
    traits: [
      { name: "", value: "" },
      { name: "", value: "" },
      { name: "", value: "" },
    ],
    lore: "",
    tokenId: null,
    contractAddress: "",
  });
  const nftABI = [
    {
      inputs: [],
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
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
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
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
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
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
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
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "mint",
      outputs: [],
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
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
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
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
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
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
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
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
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
      name: "getApproved",
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
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
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
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
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
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
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
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
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
  ];
  const handleEdit = (id, detail) => {
    console.log(id);
    setEdit(true);
    setEditeableDetail(detail);
    setEditId(id);
  };
  const submitEdit = (id, id2, det, image) => {
    const date1 = new Date().toLocaleDateString();

    const data = {
      id: id2,
      date: date1,
      title: "Bear Log",
      detail: det,
      traits: "",
      history: "",
      imageAddress: image,
    };

    updateHistoryLog(id, data);
    setEdit(false);
    navigate("/feeds");
  };
  async function connectWallet() {
    let destinationWallet = "";
    const web3Provider = new providers.Web3Provider(window.ethereum);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    // if (chainId !== 80001) {
    //   window.alert("Change the network to Mumbai");
    //   throw new Error("Change network to Mumbai");
    // }

    const signer = web3Provider.getSigner();
    let adr = await signer.getAddress();

    console.log("Signer obtained ", signer, adr);
    return signer;
  }
  const checkOwner = async () => {
    let signer = await connectWallet();

    const the_contract = new Contract(params.contractaddress, nftABI, signer);
    console.log({ the_contract }, params.id);
    try {
      let ownerOf = await the_contract.ownerOf(params.id);

      if (ownerOf === address) {
        setOwnerOfNFT(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const runThisFunctionFirst = async () => {
    try {
      const bear = await searchLore(params.id);
      console.log(bear, "bear");
      let _temp = { ...loreApiData };
      _temp.sel_nft_id = bear.id;
      _temp.name = bear.name;
      _temp.description = bear.detail;
      _temp.img = embedGateway(bear.imageAddress);
      _temp.lore = bear.detail;
      console.log(_temp, "The NFT is here");

      setLoreApiData(_temp);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    checkOwner();
    runThisFunctionFirst();
  }, []);
  useEffect(() => {
    setTimeout(async () => {
      setIsLoading(false);
    }, 1000);
  }, [loreApiData]);

  const getLoreAndLogData = async () => {
    const { data } = await axios.get(`${base_url}/bearlogdata`);
    console.log(params.id, "id");
    const variableOne = data.logData.filter(
      (itemInArray) => itemInArray.id === params.id
    );
    setLoreAndLogData(variableOne);
  };

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
        maxWidth="md"
        sx={{
          pt: "7rem",
          pb: "0rem",
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} sm={9.5} md={9.5}>
            <MainHeadings heading="FEED HISTORY" className="main-heading" />
            <Description
              text="Description / Helper text"
              className="description-text"
            />
          </Grid>
        </Grid>
      </Container>

      <Container
        maxWidth="md"
        sx={{
          pt: 10,
        }}
      >
        <Box
          sx={{
            background: "transparent",
            color: "white",
            borderRadius: "12px",
            border: "1px solid white",
            p: 5,
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
            <Grid container sx={{ p: 2 }}>
              <Grid xs={12} sm={5} md={4}>
                <Box>
                  <CardMedia
                    component="img"
                    sx={{
                      // width: "150px",
                      // height: "150px",
                      objectFit: "contain",
                      borderRadius: "20px",
                    }}
                    image={loreApiData.img}
                    alt="Live from space album cover"
                  />
                </Box>
              </Grid>
              <Grid xs={12} sm={7} md={8} sx={{ pt: 3 }}>
                <Grid container>
                  <Grid
                    item
                    xs={2}
                    md={4}
                    lg={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        pt: "6px",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: 800,
                        fontFamily: "Rubik",
                      }}
                      className="font"
                    >
                      NAME
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={9}
                    md={8}
                    lg={8}
                    sx={{
                      pt: 0,
                    }}
                  >
                    <TextField
                      className="font"
                      id="filled-basic"
                      label=""
                      variant="filled"
                      //onChange={() ser}
                      fullWidth
                      value={loreApiData.name}
                      InputProps={{
                        disableUnderline: true,
                        readOnly: true,
                      }}
                      sx={{
                        input: {
                          padding: "5px !important",
                          outline: "none",
                          border: "none",
                          border: "1px solid white",
                          background: "#BABABA",
                          borderRadius: "5px",
                          color: "black",
                          fontFamily: "Rubik",
                          height: 28,

                          fontStyle: "normal",
                          fontWeight: "400",
                          fontSize: "18px",
                        },
                        color: "white",
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid container pt={2}>
                  <Grid
                    item
                    xs={2}
                    md={4}
                    lg={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        pt: "2rem",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: 800,
                        fontFamily: "Rubik",
                      }}
                      className="font"
                    >
                      LORE
                    </Typography>
                  </Grid>

                  <Grid item xs={9} md={8} lg={8}>
                    <TextField
                      id="filled-multiline-static"
                      multiline
                      rows={4}
                      variant="filled"
                      fullWidth
                      value={loreApiData.description}
                      InputProps={{
                        disableUnderline: true,
                        readOnly: true,
                      }}
                      sx={{
                        // px: "0px !important",
                        textArea: {
                          border: "1px solid white",
                          background: "#BABABA",
                          borderRadius: "5px",
                          padding: "5px !important",
                          color: "black",
                          fontFamily: "Rubik",
                          fontStyle: "normal",
                          fontWeight: "400",
                          fontSize: "18px",
                        },
                        "& .fROKwd": {
                          px: "0 !important",
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>

      <Container
        maxWidth="md"
        sx={{
          pt: "2rem",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 5,
            }}
          >
            <CircularProgress sx={{ color: "white" }} />
          </Box>
        ) : !ownerOfNFT ? (
          <Grid spacing={3} justifyContent="center">
            {loreAndLogData &&
              loreAndLogData.length > 0 &&
              loreAndLogData.map((obj) => {
                return (
                  <Box
                    sx={{
                      background: "transparent",
                      color: "white",
                      borderRadius: "12px",
                      border: "1px solid white",
                      mb: 2,
                    }}
                  >
                    <Grid md={8} sx={{ p: 3 }}>
                      <Grid
                        container
                        md={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography xs={4}>Date: </Typography>
                        <Typography xs={8}>{date}</Typography>
                      </Grid>
                      <Grid
                        container
                        md={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography xs={4}>Detail: </Typography>
                        <Typography xs={8}>{obj.detail}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
          </Grid>
        ) : (
          <Grid spacing={3} justifyContent="center">
            {loreAndLogData &&
              loreAndLogData.length > 0 &&
              loreAndLogData.map((obj) => {
                return (
                  <Box
                    key={obj._id}
                    sx={{
                      background: "transparent",
                      color: "white",
                      borderRadius: "12px",
                      border: "1px solid white",
                      mb: 2,
                    }}
                  >
                    <Grid md={8} p={3}>
                      <Grid
                        container
                        md={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography xs={8}>{obj.date}</Typography>
                        <Button
                          variant="outlined"
                          sx={{
                            borderColor: "white",

                            "&:hover": {
                              color: "white",
                              background: "#FFA370",
                              border: 1,
                            },
                            "&:focus": {
                              border: 1,
                              background: "black",
                              color: "white",
                            },
                          }}
                          endIcon={
                            <ModeEditOutlineIcon
                              sx={{
                                backgroundcolor: "white",
                                //background: 'white',
                                color: "white",
                              }}
                            />
                          }
                          onClick={() => {
                            handleEdit(obj._id, obj.detail);
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                            }}
                          >
                            EDIT
                          </Typography>
                        </Button>
                      </Grid>
                      <Grid
                        container
                        md={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {edit && obj._id == editeableId ? (
                          <Grid xs={12}>
                            <TextField
                              //type="date"
                              className="font"
                              id="filled-basic"
                              label=""
                              variant="filled"
                              value={editeableDetail}
                              onChange={(e) => {
                                setEditeableDetail(e.target.value);
                              }}
                              InputProps={{
                                disableUnderline: true,
                              }}
                              sx={{
                                input: {
                                  mt: 1,
                                  width: "61vw",
                                  outline: "none",
                                  border: "none",
                                  border: "1px solid white",
                                  background: "#BABABA",
                                  padding: "5px !important",
                                  borderRadius: "5px",
                                  color: "black",
                                  fontFamily: "Rubik",
                                  height: "5vh",
                                },
                                color: "white",
                              }}
                            />
                            <Grid
                              sx={{
                                display: "flex",
                                justifyContent: "left",
                                marginRight: "10px",

                                pt: 2,
                              }}
                            >
                              <Button
                                variant="outlined"
                                sx={{
                                  borderColor: "white",
                                  marginRight: "10px",
                                  "&:hover": {
                                    color: "white",
                                    background: "#FFA370",
                                    border: 1,
                                  },
                                  "&:focus": {
                                    border: 1,
                                    background: "black",
                                    color: "white",
                                  },
                                }}
                                endIcon={
                                  <SaveIcon
                                    sx={{
                                      backgroundcolor: "white",
                                      //background: 'white',
                                      color: "white",
                                    }}
                                  />
                                }
                                onClick={() => {
                                  submitEdit(
                                    obj._id,
                                    obj.id,
                                    editeableDetail,
                                    obj.imageAddress
                                  );
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "white",
                                  }}
                                >
                                  UPDATE
                                </Typography>
                              </Button>
                              <Button
                                variant="outlined"
                                sx={{
                                  borderColor: "white",
                                  marginRight: "10px",
                                  "&:hover": {
                                    color: "white",
                                    background: "#FFA370",
                                    border: 1,
                                  },
                                  "&:focus": {
                                    border: 1,
                                    background: "black",
                                    color: "white",
                                  },
                                }}
                                endIcon={
                                  <CancelIcon
                                    sx={{
                                      backgroundcolor: "white",
                                      //background: 'white',
                                      color: "white",
                                    }}
                                  />
                                }
                                onClick={() => {
                                  setEdit(false);
                                  setEditeableDetail(obj.detail);
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "white",
                                  }}
                                >
                                  CANCEL
                                </Typography>
                              </Button>
                            </Grid>
                          </Grid>
                        ) : (
                          <Typography xs={12}>{obj.detail}</Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default FeedDetail;
