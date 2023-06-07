import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import { shadows } from "@mui/system";
import { Container, Button, Typography, Icon } from "@mui/material";
import styled from "styled-components";
import { fontSize, typography } from "@mui/system";
import "./Appbar.css";
import { Router, useNavigate, useNavigation } from "react-router-dom";
import Menubar from "../MenuBar/Menubar";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { ethers, providers } from "ethers";
import { bearriesABI, contractAddress } from "../../APIRequests/bearries";
import { supportedContracts } from "../../APIRequests/SupportedContracts";
import { getNFTs } from "../../APIRequests/Alchemi";
import { useSigner } from "wagmi";

// import { UserContext } from '../../App';
// import { useContext } from 'react';

// const pages = ['Products', 'Pricing', 'Blog'];
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
const btnStyle = {
  borderRadius: "48px",
  background: "#000000",
  border: 1,
  borderColor: "rgba(255, 255, 255, 0.19)",
  m: 0,
  //boxShadow: '0px 14px 54px 0, 0, 0, 0.25',
  boxShadow: "0px 0px 70px #bab7b7c4",
  "&:hover": {
    background: "#000000",
    border: 1,
  },

  "&:focus": {
    border: 1,
  },
};
const dividerStyle = {
  background: "rgba(255, 255, 255, 0.5)",
  opacity: 0.2,
  width: "auto",
  borderLeft: "1px solid white",
  height: "25px",
  mt: "4px",
};
const btnText = {
  fontFamily: "Rubik",
  fontSize: "0.7em",
};
const handleOpenNavMenu = (event) => {
  setAnchorElNav(event.currentTarget);
};
const handleOpenUserMenu = (event) => {
  setAnchorElUser(event.currentTarget);
};

const handleCloseNavMenu = () => {
  setAnchorElNav(null);
};

const handleCloseUserMenu = () => {
  setAnchorElUser(null);
};

//   const Button = styled.button `
//   border-radius: '48px',
//   background: '#000000',
//   border: '1px solid white',
//   border-olor: '#FFFFFF',
//   padding: '15px, 16px, 16px, 16px',
//   `

const Appbar = () => {
  // const { signer } = useSigner();
  const [loader, setLoader] = useState(false);
  const [address, setAddress] = useState(null);
  const handleMenuBtnClick = (e) => {
    setMenuBarState(0);
  };
  const navigate = useNavigate();
  const handleListBtnClick = (index) => {
    const pageNo = index;
    if (pageNo == 0) {
      navigate("/");
    } else if (pageNo == 1) {
      navigate("/feeds");
    } else if (pageNo == 2) {
      navigate(`/nfts/lores`);
    } else if (pageNo == 3) {
      //navigate("/bearLog")
      navigate(`/nfts/logs`);
    } else if (pageNo == 4) {
      navigate("/rewards");
    } else if (pageNo == 5) {
      navigate("/downloads");
    } else if (pageNo == 6) {
      navigate("/Bearberry");
    } else if (pageNo == 7) {
      navigate("/collection");
    } else if (pageNo == 8) {
      navigate("/safeswap");
    }
  };

  // claiming tokens

  async function ConnectWalletWithSigner() {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const web3Provider = new providers.Web3Provider(window.ethereum);

      // If user is not connected to the Mumbai network, let them know and throw an error
      const { chainId } = await web3Provider.getNetwork();

      const signer = web3Provider.getSigner();
      let adr = await signer.getAddress();
      setAddress(adr);
      console.log("Signer obtained ", signer, adr);

      return signer;
    } catch (e) {
      return null;
    }
  }
  async function claimTokens() {
    let signer = await ConnectWalletWithSigner();
    if (!signer) return;
    let adr = await signer.getAddress();
    if (!adr) {
      return 0;
    }
    let totalTokens = [];
    let contracts = [];
    setLoader(true);

    for (let j = 0; j < supportedContracts.length; j++) {
      const contract = supportedContracts[j];
      let tokens = await getNFTs(adr, contract);
      tokens = tokens?.map((item) => parseInt(item.tokenId));
      console.log("tokens are ", tokens, " for ", contract);

      if (tokens && tokens.length > 0) {
        contracts.push(contract);
        totalTokens.push(tokens);
      }
    }

    try {
      if (totalTokens.length == 0 || !contracts || contracts.length == 0) {
        alert("You don't own any Bear to claim $Bearberry!");
        setLoader(false);
        return 0;
      }
      const the_contract = new ethers.Contract(
        contractAddress,
        bearriesABI,
        signer
      );
      const estimation = await the_contract.estimateGas.claimAndWithdrawTokensForMultipleContracts(
        contracts,
        totalTokens
      );

      console.log(
        "Claiming for contracts ",
        contracts,
        "for tokens ",
        totalTokens,
        the_contract,
        "function is ",
        the_contract.claimAndWithdrawTokensForMultipleContracts
      );

      let res = await the_contract.claimAndWithdrawTokensForMultipleContracts(
        contracts,
        totalTokens,
        {
          gasLimit: estimation,
        }
      );
      await res.wait();
      console.log(res);

      alert("Successfully Claimed ✅🎉");
      setLoader(false);
    } catch (e) {
      setLoader(false);

      alert("Claim Failed due to :" + e);
      console.log(e);
    }
  }

  return (
    <AppBar
      sx={{
        pt: 0,
        background: "rgba(0,0,0,0.9)",
        boxShadow: "0 0 0 0",
        width: "100vw",
      }}
    >
      <Toolbar>
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{
            pt: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid item xs={1.5} sm={1.5} md={1.5} lg={1.5} xl={1.5}>
            <img src="/img/logo.png" className="navLogo" />
          </Grid>
          <Grid
            item
            xs={9.5}
            sm={9.5}
            md={9.5}
            lg={9.5}
            xl={8.5}
            spacing={0}
            sx={{
              pt: 1.5,
            }}
          >
            {/* <Container maxWidth="md"
         width = '100%'
         sx = {{}}
         className="appbar-container"> */}
            {/* <Container maxWidth = 'lg'> */}
            <div className="nav-btn-group">
              <Button
                sx={btnStyle}
                variant="contained"
                size="small"
                onClick={(e) => handleListBtnClick(0)}
              >
                <Typography sx={btnText}>Home</Typography>
                <img src="/icons/home.svg" />
              </Button>
              <Divider variant="left" sx={dividerStyle} />
              {/* -----------feed lore and log
              <Button
                sx={btnStyle}
                variant="contained"
                size="small"
                onClick={(e) => handleListBtnClick(1)}
              >
                <Typography sx={btnText}>Feed</Typography>
              </Button>
              <Button
                sx={btnStyle}
                variant="contained"
                size="small"
                onClick={(e) => handleListBtnClick(2)}
              >
                <Typography sx={btnText}>Lore</Typography>
              </Button>
              <Button
                sx={btnStyle}
                variant="contained"
                size="small"
                onClick={(e) => handleListBtnClick(3)}
              >
                <Typography sx={btnText}>Bear Log</Typography>
              </Button> 
              -------------------------------*/}
              <Button
                sx={btnStyle}
                variant="contained"
                size="small"
                onClick={(e) => handleListBtnClick(4)}
              >
                <Typography sx={btnText}>Rewards</Typography>
              </Button>

              {/*--------------Downloads
               <Button
                sx={btnStyle}
                variant="contained"
                size="small"
                onClick={(e) => handleListBtnClick(5)}
              >
                <Typography sx={btnText}>Downloads</Typography>
              </Button> -------------------*/}
              <Button
                sx={btnStyle}
                variant="contained"
                size="small"
                onClick={(e) => handleListBtnClick(6)}
              >
                <Typography sx={btnText}>$Bearberry</Typography>
              </Button>
              <Divider variant="left" sx={dividerStyle} />
              <Button
                sx={{
                  boxShadow: "0px 0px 50px #c5b8a2ab",
                  borderRadius: "48px",
                  background: "#FFA370",
                  border: 1,
                  // borderColor: "black",
                  m: 0,

                  // ml: 3,
                  color: "black",
                  "&:hover": {
                    background: "black",
                    color: "white",
                    border: 1,
                  },
                  "&:focus": {
                    border: 1,
                    background: "black",
                    color: "white",
                  },
                }}
                variant="contained"
                size="small"
                onClick={(e) => handleListBtnClick(7)}
              >
                <Typography
                  sx={{
                    fontFamily: "Rubik",
                    fontSize: "1em",
                    fontWeight: "bolder",
                  }}
                >
                  Profile
                </Typography>
              </Button>
              <Divider variant="left" sx={dividerStyle} />
              <Button
                sx={{
                  boxShadow: "0px 0px 50px #c5b8a2ab",
                  borderRadius: "48px",
                  background: "black",
                  border: 1,
                  // borderColor: "black",
                  m: 0,

                  // ml: 3,
                  color: "White",
                  "&:hover": {
                    background: "black",
                    color: "white",
                    border: 1,
                  },
                  "&:focus": {
                    border: 1,
                    background: "black",
                    color: "white",
                  },
                }}
                variant="contained"
                size="small"
                onClick={(e) => handleListBtnClick(8)}
              >
                <Typography
                  sx={{
                    fontFamily: "Rubik",
                    fontSize: "0.7em",
                    fontWeight: "bolder",
                  }}
                >
                  SafeSwap
                </Typography>
              </Button>
              <Divider variant="left" sx={dividerStyle} />

              <Button
                endIcon={<EmojiEventsIcon />}
                sx={{
                  boxShadow: "0px 0px 50px #c5b8a2ab",
                  borderRadius: "48px",
                  background: "black",
                  border: 1,
                  // borderColor: "black",
                  m: 0,

                  // ml: 3,
                  color: "White",
                  "&:hover": {
                    background: "black",
                    color: "white",
                    border: 1,
                  },
                  "&:focus": {
                    border: 1,
                    background: "black",
                    color: "white",
                  },
                }}
                variant="contained"
                size="small"
                onClick={(e) => {
                  claimTokens();
                }}
              >
                <Typography sx={btnText}>
                  Claim{loader && "ing..."} Bearberry
                </Typography>
              </Button>
              <Divider variant="left" sx={dividerStyle} />
            </div>
            {/* <div className='right-btn'>
            <Button sx={{
              borderRadius: '100%',
              background: '#000000',
              border: 1,
              borderColor: 'black',
              m: 0,
              mx: 1,
              boxShadow: '0 0 2px',
              minWidth: '33px',
              width: '13px',
              '&:hover': {
                  background: '#000000',
                  border: 1,
                  
              },
            }} variant="contained" size="small">
              <img src="/icons/twitter-icon.svg" className='btn-icon'/>
            </Button>
            <Button sx={{
              borderRadius: '48%',
              background: '#000000',
              border: 1,
              borderColor: 'black',
              m: 0,
              mx: 1,
              boxShadow: '0 0 2px',
              minWidth: '33px',
              width: '13px',
              '&:hover': {
                  background: '#000000',
                  border: 1,
                  
              },
            }} variant="contained" size="small">
              <img src="/icons/discord-icon.svg" className='btn-icon'/>
            </Button>
          </div> */}
            {/* </Container> */}

            {/* </Container> */}
          </Grid>
          <Grid
            item
            xs={1}
            sm={1}
            md={1}
            lg={1}
            xl={1}
            sx={{
              pt: 0.3,
            }}
          >
            <div className="right-btn">
              <Button
                sx={{
                  borderRadius: "48%",
                  background: "#000000",
                  border: 1,
                  //borderColor: 'black',
                  borderColor: "rgba(255, 255, 255, 0.19)",
                  m: 0,
                  //boxShadow: '0px 14px 54px 0, 0, 0, 0.25',
                  boxShadow: "0px 0px 50px #bab7b7a3",
                  m: 0,
                  mx: 1,
                  minWidth: "30px",
                  width: "10px",
                  "&:hover": {
                    background: "#000000",
                    border: 1,
                  },
                }}
                onClick={() => {
                  window.location.assign("https://twitter.com/okaybearsyc");
                }}
                variant="contained"
                size="small"
              >
                <img src="/icons/twitter-icon.svg" className="btn-icon" />
              </Button>
              <Button
                sx={{
                  borderRadius: "48%",
                  background: "#000000",
                  border: 1,
                  //borderColor: 'black',
                  borderColor: "rgba(255, 255, 255, 0.19)",
                  m: 0,
                  //boxShadow: '0px 14px 54px 0, 0, 0, 0.25',
                  boxShadow: "0px 0px 30px #bab7b7a3",
                  m: 0,
                  mx: 1,
                  minWidth: "30px",
                  height: "25px",
                  width: "13px",
                  "&:hover": {
                    background: "#000000",
                    border: 1,
                  },
                }}
                onClick={() => {
                  window.location.assign("https://discord.com/invite/obyc");
                }}
                variant="contained"
                size="small"
              >
                <img src="/icons/discord-icon.svg" className="btn-icon" />
              </Button>
            </div>
          </Grid>
        </Grid>

        <div className="mbl-screen-btn">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <EmojiEventsIcon sx={{ cursor: "pointer" }} onClick={claimTokens} />

            <Menubar />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
