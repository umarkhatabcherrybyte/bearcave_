import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import SendIcon from "@mui/icons-material/Send";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
//import { Container, Box} from "@mui/material";
import data from "../Data/data";
import Form from "../Form/Form";
import Traits from "../Traits/Traits";
import {
  Container,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
} from "@mui/material";

import { nftABI, nftsAddress } from "../../APIRequests/nftsData";
import MainHeadings from "../MainHeadings/MainHeadings";
import Description from "../Description/Description";
import LogHistory from "../LogHistory/LogHistory";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { nftObj } from "../NFTs_data/NFTobj";
import { createLog, searchLog } from "../../APIRequests/LogAPICalls";
import { base_url } from "../../base_urls";
import { Contract, providers } from "ethers";
import { embedGateway } from "../../APIRequests/IPFS";
import { updateHistoryLog } from "../../APIRequests/LogAPICalls";
// import { useSigner } from "wagmi";

const box = {
  width: "100%",
  m: 1,
  padding: 1,
  border: 1,
  borderRadius: "5px",
  borderColor: "white",
};
const boxTraits = {
  width: "100%",
  m: 1,
  padding: 1,
  border: 1,
  borderRadius: "5px",
  borderColor: "white",
};
let traitsStyle = {
  color: "white",
};
const BearLog = () => {
  const { signer } = useSigner();
  async function connectWallet() {
    let destinationWallet = "";
    const web3Provider = new providers.Web3Provider(window.ethereum);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 1) {
      window.alert("Change the network to Mainnet");
      throw new Error("Change network to Mainnet");
    }

    const signer = web3Provider.getSigner();
    let adr = await signer.getAddress();

    console.log("Signer obtained ", signer, adr);
    return signer;
  }

  async function getImage() {
    let signer = await connectWallet();
    let _contractAddress = contractaddress;
    let _tokenId = id;
    console.log({ _contractAddress, _tokenId });
    console.log("creating it ..");
    let tokenImage =
      "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png";
    try {
      let _theContract = new Contract(nftsAddress, nftABI, signer);
      console.log("getting tokenURI", _theContract);
      let tokenUri = await _theContract.tokenURI(_tokenId);
      let embeddedTokenUri = embedGateway(tokenUri);
      let _data = await axios.get(embeddedTokenUri);
      _data = _data.data;
      setMetaData(_data.attributes);
      // console.log({ _data });
      console.log(_data);
      tokenImage = embedGateway(_data.image);
    } catch (e) {
      console.log(e);
    }
    //setImageURL(tokenImage);
  }
  const [currentNFT, setCurrentNFT] = useState(null);
  const [value, setValue] = React.useState("2014-08-18T21:11:54");
  const [date, setDate] = useState("mm/dd/yy");
  const [log, setLog] = useState("No data to show");
  const [editeableDetail, setEditeableDetail] = useState("");
  const [editeableId, setEditId] = useState();
  const [loreAndLogData, setLoreAndLogData] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const { contractaddress } = useParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const btnStyle = {
    borderColor: "white",
    "&:focus": {
      border: 1,
      background: "black",
      color: "white",
    },
  };
  const [addOrUpdate, setAddOrUpdate] = useState(0); //0 to add and 1 to update
  const [logApiData, setLogApiData] = useState({
    sel_nft_id: 0,
    date: "",
    log: "No data to show",
    img: "",
    traits: [
      { name: "", value: "" },
      { name: "", value: "" },
      { name: "", value: "" },
    ],
    history: "",
    tokenId: null,
    //contractAddress: "",
  });

  const getLoreAndLogData = async () => {
    const { data } = await axios.get(`${base_url}/bearlogdata`);

    console.log(id, "id");
    const variableOne = data.logData.filter(
      (itemInArray) => itemInArray.id === id
    );
    setLoreAndLogData(variableOne);
  };
  useEffect(() => {
    console.log("useEffect running");
    getImage();
    getLoreAndLogData();
    //getLores();
  }, []);
  const runThisFunctionFirst = async () => {
    try {
      const bear = await searchLog(id);
      console.log(bear);
      let _temp = { ...logApiData };
      _temp.sel_nft_id = bear.id;
      _temp.date = bear.date;
      _temp.log = bear.detail;
      console.log(bear.detail, "dasd");
      setLogApiData(_temp);
      // console.log(loreApiData)
      //console.log('data will be updated')
      setDate(bear.date);
      console.log(bear.date, "date");
      setLog(bear.detail);
      //setAddOrUpdate(1)
    } catch (err) {
      console.log(err);
      console.log("Data will be added");
      //setAddOrUpdate(0)
    }
    console.log(contractaddress);
  };
  useEffect(() => {
    console.log(id);
    runThisFunctionFirst();
    let latestNFT = JSON.parse(localStorage.getItem("latest_nft"));
    console.log(latestNFT);
    setCurrentNFT(latestNFT);
  }, []);

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const handleEdit = (id, detail) => {
    console.log(id);
    setEdit(true);
    setEditeableDetail(detail);
    setEditId(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit function called!");
    const date1 = new Date().toLocaleDateString();
    const data = {
      id: id,
      date: date1,
      title: "Bear Log",
      detail: log,
      traits: "",
      history: "",
      imageAddress: currentNFT.image,
    };
    createLog(data);

    setDate("");
    setLog("");
    navigate("/feeds");
  };
  const submitEdit = (id, id2, det) => {
    const date1 = new Date().toLocaleDateString();

    const data = {
      id: id2,
      date: date1,
      title: "Bear Log",
      detail: det,
      traits: "",
      history: "",
      imageAddress: currentNFT.image,
    };
    updateHistoryLog(id, data);
    setEdit(false);
    navigate("/feeds");
  };
  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          pt: 10,
        }}
      >
        <MainHeadings heading="BEAR LOG" />
        <Description text="This information will be displayed publicly on the feed so be careful what you share! Feel free to enter as many logs." />
      </Container>
      <Container
        maxWidth="md"
        sx={{
          pt: 10,
        }}
      >
        <Grid container spacing={0}>
          <Grid item xs={12} sm={5} lg={4}>
            <Box
              sx={{
                "@media (max-width: 770px)": {
                  display: "flex",
                  justifyContent: "center",
                },
              }}
            >
              <img
                style={{
                  borderRadius: "20px",
                  width: "400px",
                  height: "400px",
                  objectFit: "contain",
                }}
                src={
                  !currentNFT
                    ? "https://www.flop.cl/wp-content/uploads/2022/09/woocommerce-placeholder.png"
                    : currentNFT.image
                }
                className="lore-page-img"
              />
            </Box>
            <Grid
              container
              sx={{
                p: 2,
              }}
            >
              {/* <Container xs = 'sm'> */}
              <Box>
                <Typography
                  sx={{
                    color: "white",
                    fontWeight: 800,
                    fontFamily: "Rubik",
                  }}
                >
                  LOG:
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                  }}
                >
                  {logApiData.log}
                </Typography>
              </Box>
              {/* <Box>
                <Typography
                  sx={{
                    pt: '1rem',
                    color: "white",
                    fontWeight: 800,LORE
                    fontSize: '1em',
                    fontFamily: "Rubik",
                  }}
                >
                  :
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                  }}
                >
                  {logApiData.log}
                </Typography>
              </Box> */}
              {/* </Container> */}
            </Grid>
          </Grid>

          <Grid xs={12} sm={7} sx={{ pt: 5 }}>
            <form onSubmit={handleSubmit}>
              <Grid container>
                <Grid item xs={2} md={4} lg={4} sx={{}}>
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
                    DATE
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
                    value={date}
                    InputProps={{
                      disableUnderline: true,
                      readOnly: true,
                    }}
                    sx={{
                      input: {
                        outline: "none",
                        border: "none",
                        border: "1px solid white",
                        background: "#BABABA",
                        padding: "5px !important",
                        borderRadius: "5px",
                        color: "black",
                        fontFamily: "Rubik",
                        height: 28,
                      },
                      color: "white",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container pt={2}>
                <Grid item xs={2} md={4} lg={4} sx={{}}>
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
                    LOG ENTRY
                  </Typography>
                </Grid>

                <Grid item xs={9} md={8} lg={8}>
                  <TextField
                    id="filled-multiline-static"
                    multiline
                    rows={4}
                    variant="filled"
                    fullWidth
                    value={log}
                    onChange={(e) => {
                      setLog(e.target.value);
                    }}
                    InputProps={{
                      disableUnderline: true,
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
                      },
                      "& .fROKwd": {
                        px: "0 !important",
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container pt={2}>
                <Grid xs={4}>
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
                    TRAITS
                  </Typography>
                </Grid>
                <Grid container xs={8} display="flex">
                  {metaData.map((item) => (
                    <Grid
                      container
                      xs={6}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box sx={box}>
                        <Grid container>
                          <Grid item xs={12}>
                            <Typography sx={traitsStyle}>
                              {item.trait_type}
                            </Typography>
                          </Grid>

                          <Grid item xs={12}>
                            <Typography sx={traitsStyle}>
                              {item.value}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid container pt={5}>
                <Grid
                  xs={12}
                  sx={{
                    "@media (min-width: 320px)": { mx: "40%" },
                    "@media (max-width: 675px)": { mx: "50%" },
                    "@media (min-width: 1024px)": { mx: "60%" },
                  }}
                >
                  <Button
                    type="submit"
                    sx={{
                      borderColor: "white",
                      background: "transparent",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "white",
                      }}
                    >
                      SUBMIT
                    </Typography>
                  </Button>
                  {/* <input type="submit" /> */}
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
      {/* <Container
        maxWidth="md"
        sx={{
          pt: "2rem",
        }}
      >
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
                      sx={{ display: "flex", justifyContent: "space-between" }}
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
      </Container> */}
      <Container
        maxWidth="md"
        sx={{
          pt: "2rem",
        }}
      >
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
                      sx={{ display: "flex", justifyContent: "space-between" }}
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
                                submitEdit(obj._id, obj.id, editeableDetail);
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
      </Container>
    </>
  );
};

export default BearLog;
