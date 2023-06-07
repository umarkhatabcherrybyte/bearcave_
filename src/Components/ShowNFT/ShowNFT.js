import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useNavigation,
  useParams,
  useLocation,
} from "react-router-dom";
import Grid from "@mui/material/Grid";
import {
  Container,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
} from "@mui/material";
// import data from "../Data/data";
// import Form from "../Form/Form";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
// import Traits from "../Traits/Traits";
// import MainHeadings from "../MainHeadings/MainHeadings";
// import Buttons from "../Buttons/Buttons";
// import Description from "../Description/Description";
// import { nftObj } from "../NFTs_data/NFTobj";
import axios from "axios";
import { nftABI, nftsAddress } from "../../APIRequests/nftsData";
// import { nftArray } from "../NFTs_data/NFTs_data";
// import { apiReq } from "../API/API";
// import Web3 from "web3";
import {
  createLore,
  createLoreTransaction,
  searchLore,
  updateLore,
} from "../../APIRequests/LoreAPICalls";
import { Contract, providers } from "ethers";
import { embedGateway } from "../../APIRequests/IPFS";
import { ProviderUrl } from "../../APIRequests/Alchemi";
import { base_url } from "../../base_urls";
import { updateHistoryLog } from "../../APIRequests/LogAPICalls";
import { useSigner } from "wagmi";

const box = {
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
const Lore = () => {
  // const { signer } = useSigner();
  const [image, setImage] = useState(null);
  const location = useLocation();
  const state = location.state;
  //console.log(' The state is: '+ state.item);
  const navigate = useNavigate();
  const [nfts, setNfts] = useState([]);
  const { id } = useParams();
  const { contractaddress } = useParams();
  const [metaData, setMetaData] = useState([]);
  //  console.log(state.imageLink)

  const [loreAndLogData, setLoreAndLogData] = useState([]);

  const [addOrUpdate, setAddOrUpdate] = useState(0); //0 to add and 1 to update
  const [loreApiData, setLoreApiData] = useState({
    sel_nft_id: 0,
    name: "No data to show",
    //title: 'Bear Lore',
    img: "",
    traits: [
      { name: "", value: "" },
      { name: "", value: "" },
      { name: "", value: "" },
    ],
    lore: "No data to show",
    tokenId: null,
    contractAddress: "",
  });
  const [name, setName] = useState("No data to show");
  const [lore, setLore] = useState("No data to show");
  const [editeableDetail, setEditeableDetail] = useState("");
  const [editeableId, setEditId] = useState();
  const [edit, setEdit] = useState(false);

  const runThisFunctionFirst = async () => {
    try {
      const bear = await searchLore(id);
      console.log(bear.detail);
      let _temp = { ...loreApiData };
      _temp.sel_nft_id = bear.id;
      _temp.name = bear.name;
      _temp.lore = bear.detail;
      console.log(_temp, "dasd");
      setLoreApiData(_temp);
      // console.log(loreApiData)
      console.log("data will be updated");
      setName(bear.name);
      setLore(bear.detail);
      setAddOrUpdate(1);
    } catch (err) {
      console.log(err);
      console.log("Data will be added");
      setAddOrUpdate(0);
    }
    console.log(contractaddress);
  };

  async function connectWallet() {
    const web3Provider = new providers.Web3Provider(window.ethereum);
    const { chainId } = await web3Provider.getNetwork();
    console.log({ chainId });
    if (chainId !== 1) {
      window.alert("Change the network to Mainnet");
    }

    const signer = web3Provider.getSigner();
    let adr = await signer.getAddress();

    console.log("Signer obtained ", signer, adr);
    return signer;
  }

  async function embedImage() {
    let signer = await connectWallet();
    let _contractAddress = contractaddress;
    let _tokenId = id;
    console.log({ _contractAddress, _tokenId });
    console.log("creating it ..");
    let tokenImage =
      "https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png";
    try {
      // console.log("getting the token");
      // console.log(_contractAddress, nftABI, signer);

      let _theContract = new Contract(nftsAddress, nftABI, signer);
      // console.log("getting tokenURI", _theContract);
      let tokenUri = await _theContract.tokenURI(_tokenId);
      // console.log("got tokenURI", tokenUri);
      let embeddedTokenUri = embedGateway(tokenUri);
      let _data = await axios.get(embeddedTokenUri);
      _data = _data.data;
      setMetaData(_data.attributes);
      // console.log({ _data });
      // console.log(_data.attributes);
      tokenImage = await embedGateway(_data.image);
      console.log(tokenImage);
      setImage(tokenImage);
    } catch (e) {
      console.log(e);
    }
    //setImageURL(tokenImage);
  }

  const getLoreAndLogData = async () => {
    const { data } = await axios.get(`${base_url}/bearlogdata`);

    console.log(id, "id");
    const variableOne = data.logData.filter(
      (itemInArray) => itemInArray.id === id
    );
    setLoreAndLogData(variableOne);
  };

  const handleEdit = (id, detail) => {
    console.log(id);
    setEdit(true);
    setEditeableDetail(detail);
    setEditId(id);
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
      // imageAddress: currentNFT.image,
    };
    updateHistoryLog(id, data);
    setEdit(false);
    navigate("/feeds");
  };

  useEffect(() => {
    runThisFunctionFirst();
    getLoreAndLogData();
    embedImage();
  }, []);

  return (
    <div key={"nft" + id + image}>
      <Container
        maxWidth="lg"
        sx={{
          pt: 15,
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: "40px",
            fontWeight: 700,
            fontFamily: "Rubik",
          }}
        >
          BEARCAVE MEMBER #{id}
        </Typography>
      </Container>
      <Container maxWidth="lg">
        <Box
          sx={{
            padding: 2,
            marginBottom: 3,
            border: 1,
            borderRadius: "5px",
            borderColor: "white",
          }}
        >
          <Grid container direction="row" mt={2}>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  "@media (max-width: 600px)": {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: "3rem",
                  },
                  "@media (min-width: 601px)": {
                    display: "flex",
                    justifyContent: "center",
                  },
                }}
              >
                <img
                  style={{
                    borderRadius: "20px",
                    objectFit: "contain",
                  }}
                  src={
                    !image
                      ? "https://www.flop.cl/wp-content/uploads/2022/09/woocommerce-placeholder.png"
                      : image
                  }
                  className="lore-page-img"
                />
              </Box>
            </Grid>
            <Grid xs={12} sm={6}>
              <Grid container>
                <Grid>
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
                    {name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container pt={2}>
                <Grid>
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
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "12px",
                      fontWeight: 800,
                      fontFamily: "Rubik",
                    }}
                    className="font"
                  >
                    {lore}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid container justifyContent="center">
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

            <Grid container>
              {metaData.map((item) => (
                <Grid
                  container
                  xs={12}
                  sm={6}
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
                        <Typography sx={traitsStyle}>{item.value}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>

        <Typography
          sx={{
            color: "white",
            fontSize: "40px",
            fontWeight: 700,
            fontFamily: "Rubik",
          }}
        >
          Bear Log
        </Typography>

        <Grid justifyContent="center">
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
                                width: "88vw",
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
    </div>
  );
};

export default Lore;
{
  /* <Form firstInput = "NAME" secondInput = "LORE" setValue={setName} setValue2 = {setLore}/> */
}
