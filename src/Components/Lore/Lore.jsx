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
import data from "../Data/data";
import Form from "../Form/Form";
import "./Lore.css";
import Traits from "../Traits/Traits";
import MainHeadings from "../MainHeadings/MainHeadings";
import Buttons from "../Buttons/Buttons";
import Description from "../Description/Description";
import { nftObj } from "../NFTs_data/NFTobj";
import axios from "axios";
import { nftABI, nftsAddress } from "../../APIRequests/nftsData";
import { nftArray } from "../NFTs_data/NFTs_data";
import { apiReq } from "../API/API";
import Web3 from "web3";
import {
  createLore,
  createLoreTransaction,
  searchLore,
  updateLore,
} from "../../APIRequests/LoreAPICalls";
import { Contract, providers } from "ethers";
import { embedGateway } from "../../APIRequests/IPFS";
import { ProviderUrl } from "../../APIRequests/Alchemi";
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
  const [currentNFT, setCurrentNFT] = useState(null);
  const location = useLocation();
  const state = location.state;
  //console.log(' The state is: '+ state.item);
  const navigate = useNavigate();
  const [nfts, setNfts] = useState([]);
  const { id } = useParams();
  const { contractaddress } = useParams();
  const [metaData, setMetaData] = useState([]);
  //  console.log(state.imageLink)
  console.log(contractaddress);
  console.log(id);
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
    let destinationWallet = "";
    const web3Provider = new providers.Web3Provider(window.ethereum);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    console.log({ chainId });
    if (chainId !== 1) {
      window.alert("Change the network to Mainnet");
      // throw new Error("Change network to Mainnet");
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
      console.log("etting the token");
      console.log(_contractAddress, nftABI, signer);

      let _theContract = new Contract(nftsAddress, nftABI, signer);
      console.log("getting tokenURI", _theContract);
      let tokenUri = await _theContract.tokenURI(_tokenId);
      console.log("got tokenURI", tokenUri);
      let embeddedTokenUri = embedGateway(tokenUri);
      let _data = await axios.get(embeddedTokenUri);
      _data = _data.data;
      setMetaData(_data.attributes);
      // console.log({ _data });
      console.log(_data.attributes);
      tokenImage = embedGateway(_data.image);
    } catch (e) {
      console.log(e);
    }
    //setImageURL(tokenImage);
  }

  useEffect(() => {
    runThisFunctionFirst();
    getImage();

    setName(loreApiData.name);

    let latestNFT = JSON.parse(localStorage.getItem("latest_nft"));
    console.log(latestNFT);
    setCurrentNFT(latestNFT);
    console.log("latest nft", latestNFT);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nftObj.tokenId) {
      console.log("data will be updated");
    } else {
      console.log("data will be added");
    }

    console.log("handleSubmit function called!");
    console.log(name);
    console.log(lore);
    const data = {
      id: id,
      title: "Bear Lore",
      name: name,
      detail: lore,
      traits: "",
      contractAddress: contractaddress,
      imageAddress: currentNFT.image,
    };
    if (addOrUpdate == 0) {
      createLore(data);
      createLoreTransaction(data);
      //navigate("/feeds");
      // axios.post(`http://localhost:4000//lore`, data).then((res) => {
      //   console.log(res);
      //   console.log(res.data);
      // });

      navigate("/feeds");
    } else if (addOrUpdate == 1) {
      console.log("updating data");
      updateLore(id, data);
      navigate("/feeds");
    }
  };
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          pt: 15,
        }}
      >
        <MainHeadings heading="CREATE THE LORE" />
        <Description text="This information will be displayed publicly on the feed so be careful what you share! Feel free to edit this at any time." />
      </Container>
      <Container
        maxWidth="lg"
        sx={{
          pt: 10,
        }}
      >
        <Grid container spacing={1}>
          <Grid xs={12} sm={5} md={5}>
            <Box
              sx={{
                pb: 5,
                "@media (min-width: 320px)": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
                "@media (max-width: 475px)": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
                "@media (min-width: 1024px)": {
                  display: "flex",
                  justifyContent: "left",
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
              display="flex"
              direction="column"
            >
              {/* <Container xs = 'sm'> */}
              <Box>
                <Grid>
                  <Grid sx={12}>
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: 800,
                        fontFamily: "Rubik",
                      }}
                    >
                      NAME:
                    </Typography>
                  </Grid>
                  <Grid sx={12}>
                    <Typography
                      sx={{
                        color: "white",
                      }}
                    >
                      {name}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <br />
              <Box>
                <Typography
                  sx={{
                    pt: "1rem",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "1em",
                    fontFamily: "Rubik",
                  }}
                >
                  LORE:
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                  }}
                >
                  {lore}
                </Typography>
              </Box>
              {/* </Container> */}
            </Grid>
          </Grid>
          <Grid
            xs={12}
            sm={7}
            md={7}
            sx={{
              pl: "1rem",
            }}
          >
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
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    InputProps={{
                      disableUnderline: true,
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
                    value={lore}
                    onChange={(e) => {
                      setLore(e.target.value);
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
              <Grid container pt={2}>
                <Grid item xs={2} md={4} lg={4}>
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
                <Grid container item xs={9} md={8} lg={8} display="flex">
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
    </>
  );
};

export default Lore;
{
  /* <Form firstInput = "NAME" secondInput = "LORE" setValue={setName} setValue2 = {setLore}/> */
}
