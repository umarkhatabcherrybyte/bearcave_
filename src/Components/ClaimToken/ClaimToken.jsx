import {
  Grid,
  TextField,
  Container,
  Typography,
  Box,
  Button,
  Stack,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { parseEther } from "ethers/lib/utils.js";
import React, { useState } from "react";
import { useEffect } from "react";
import { useAccount, useSigner } from "wagmi";
import { getNFTs } from "../../APIRequests/Alchemi";
import Description from "../Description/Description";
import { supportedContracts } from "../../APIRequests/SupportedContracts";
import { bearriesABI, contractAddress } from "../../APIRequests/bearries";
import { ethers, providers } from "ethers";
// import bearriesABI from "../../APIRequests/bearries";
// import contractAddress from "../../APIRequests/bearries";
const Web3 = require("web3");

const ClaimToken = () => {
  const { signer } = useSigner();
  const { address, isConnected, isDisconnected } = useAccount();
  const [tokenAmount, setTokenAmount] = useState(0);
  const [destinationAddress, setDestinationAddress] = useState(null);
  const [loader, setLoader] = useState(false);
  const [balance, setBalance] = useState();
  const [claimIntent, setClaimIntent] = useState(false);
  const [claimableTokens, setClaimableTokens] = useState(0);
  const [claimingTokenId, setClaimingTokenId] = useState(0);
  const [userNFTs, setUserNFTs] = useState();

  async function connectWallet() {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(window.ethereum);
      console.log(window.web3);
      return true;
    }
    return false;
  }
  
  async function claimTokens(tokenId) {
    // let signer = await ConnectWalletWithSigner();
    if (!signer) return;
    setLoader(true);
    let totalTokens = [];
    let contracts = [];

    for (let j = 0; j < supportedContracts.length; j++) {
      const contract = supportedContracts[j];
      let tokens = await getNFTs(address, contract);
      tokens = tokens.map((item) => parseInt(item.tokenId));
      console.log("tokens are ", tokens, " for ", contract);

      if (tokens.length > 0) {
        contracts.push(contract);
        totalTokens.push(tokens);
      }
    }

    let totalClaimable = 0;
    try {
      const the_contract = new ethers.Contract(
        contractAddress,
        bearriesABI,
        signer
      );
      console.log(
        "checking claimable for contracts ",
        contracts,
        "for tokens ",
        totalTokens,
        the_contract,
        "function is ",
        the_contract.claimAndWithdrawTokensForMultipleContracts
      );

      let res = await the_contract.claimAndWithdrawTokensForMultipleContracts(
        contracts,
        totalTokens
      );
      await res.wait();
      console.log(res);
      getBalance();

      alert("Successfully Claimed ✅🎉");
      setClaimIntent(false);
      setLoader(false);
    } catch (e) {
      setLoader(false);
      setClaimIntent(false);
      alert("Claim Failed due to :" + e);

      console.log(e);
    }
  }

  async function CalculateTokensToClaim() {
    // let signer = await ConnectWalletWithSigner();
    if (!signer) return;
    let totalTokens = [];
    let contracts = [];

    for (let j = 0; j < supportedContracts.length; j++) {
      const contract = supportedContracts[j];
      let tokens = await getNFTs(address, contract);
      tokens = tokens.map((item) => parseInt(item.tokenId));
      console.log("tokens are ", tokens, " for ", contract);

      if (tokens.length > 0) {
        contracts.push(contract);
        totalTokens.push(tokens);
      }
    }

    let totalClaimable = 0;
    try {
      const the_contract = new ethers.Contract(
        contractAddress,
        bearriesABI,
        signer
      );
      console.log(
        "checking claimable for contracts ",
        contracts,
        "for tokens ",
        totalTokens,
        the_contract,
        "function is ",
        the_contract.claimAndWithdrawTokensForMultipleContracts
      );

      let res = await the_contract.calculateTokensToClaimForMultipleContracts(
        contracts,
        totalTokens
      );
      console.log(res);

      totalClaimable = parseFloat(parseFloat(res) / 10 ** 18).toFixed(4);
      console.log("Total tokens you can claim", totalClaimable);
      setClaimableTokens(totalClaimable);
      setLoader(false);
    } catch (e) {
      console.log("Error in Claimable Calculations", e);
    }
  }

  async function getBalance() {
    if (!address) {
      return 0;
    }

    try {
      const the_contract = new ethers.Contract(
        contractAddress,
        bearriesABI,
        signer
      );

      let res = await the_contract.balanceOf(address);

      let bal = parseFloat(parseFloat(res) / 10 ** 18).toFixed(4);
      console.log("balance is ", bal);
      setBalance(bal);
    } catch (e) {
      alert("Error in Balance Retrieval :" + e);
      console.log(e);
    }
  }
  async function send() {
    if (!address) {
      return 0;
    }
    // let signer = await ConnectWalletWithSigner();
    if (!signer) return;
    if (tokenAmount == 0 || destinationAddress == null) {
      alert("Enter valid credientials !");
      return 0;
    }
    setLoader(true);

    try {
      const the_contract = new ethers.Contract(
        contractAddress,
        bearriesABI,
        signer
      );

      let res = await the_contract.transfer(
        destinationAddress,
        parseEther(tokenAmount)
      );
      await res.wait();
      setBalance(balance - tokenAmount);
      alert("Successfuly Transferred 🎉");
      setLoader(false);
    } catch (e) {
      setLoader(false);
      alert("Error in Transfer :" + e);
      console.log(e);
    }
  }

  async function addToMetamask() {
    const tokenAddress = contractAddress;
    const tokenSymbol = "Bearberry";
    const tokenDecimals = 18;
    try {
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getBalance();
    CalculateTokensToClaim();
  }, [address]);

  return (
    <>
      {claimIntent && (
        <Box
          sx={{
            background: "black",
            zIndex: "10",
            position: "absolute",
            top: "0",
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          <Box
            sx={{
              background: "black",
              width: "70vw",
              height: "70vh",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "20px",
            }}
          >
            <h3>Total Claimable Bearberry are {claimableTokens}</h3>
            {claimableTokens > 0 && (
              <div>
                <Button
                  variant="contained"
                  endIcon={
                    <img src="/icons/Arrow.svg" className="connect-btn-icon" />
                  }
                  sx={{
                    borderRadius: "48px",
                    height: "25px",
                    width: "9rem",
                    background: "#FFA370",
                    mx: "auto",
                    my: "10px",
                    "&:hover": {
                      background: "#FFA370",
                    },
                  }}
                  onClick={() => {
                    claimTokens();
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 8,
                      fontWeight: "bold",
                      color: "black",
                      fontFamily: "Rubik",
                    }}
                  >
                    {loader ? "Claiming" : "Claim"} $Bearberry
                  </Typography>{" "}
                </Button>
              </div>
            )}
            <Button
              variant="contained"
              sx={{
                borderRadius: "48px",
                height: "25px",
                width: "9rem",
                background: "#FFA370",
                mx: "auto",
                my: "10px",
                "&:hover": {
                  background: "#FFA370",
                },
              }}
              onClick={() => setClaimIntent(false)}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          pt: 15,
          pl: 1,
        }}
      >
        <Container
          maxWidth="md"
          alignItems="center"
          sx={{
            alignContent: "center",
            display: "flex",
            justifyContent: "center",
            background: "black",
            color: "white",
            mt: 0,
            pt: 5,
          }}
        >
          <Grid
            container
            spacing={5}
            sm={12}
            md={12}
            sx={{
              p: 2,
            }}
          >
            <Divider
              variant="middle"
              sx={{
                bgcolor: "#DD890C",
                width: "100%",
                // my: "auto",
              }}
            />
            <Grid
              sx={{
                "&.MuiGrid-item": {
                  paddingY: `15px`,
                },
              }}
              item
              xs={6}
              md={6}
              lg={6}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 800,
                  fontFamily: "Rubik",
                }}
              >
                BALANCE
              </Typography>
            </Grid>
            <Grid
              sx={{
                "&.MuiGrid-item": {
                  paddingY: `15px`,
                },
              }}
              item
              xs={6}
              md={6}
              lg={6}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 800,
                  fontFamily: "Rubik",
                }}
              >
                {balance} $Bearberry
              </Typography>
            </Grid>
            <Divider
              variant="middle"
              sx={{
                bgcolor: "#DD890C",
                width: "100%",
                my: "auto",
              }}
            />
            <Grid
              sx={{
                "&.MuiGrid-item": {
                  paddingY: `15px`,
                },
              }}
              item
              xs={12}
              md={3}
              lg={3}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 800,
                  fontFamily: "Rubik",
                }}
              >
                ETH ADDRESS
              </Typography>
            </Grid>
            <Grid
              sx={{
                "&.MuiGrid-item": {
                  paddingY: `15px`,
                },
              }}
              item
              xs={12}
              sm={12}
              md={9}
              lg={9}
            >
              <TextField
                id="filled-basic"
                label=""
                variant="filled"
                fullWidth
                InputProps={{
                  disableUnderline: true,
                }}
                onChange={(e) => {
                  setDestinationAddress(e.target.value);
                }}
                sx={{
                  input: {
                    outline: "none",
                    border: "none",
                    color: "white",

                    background: "#404040",
                    padding: 0,
                    pt: 0,
                    borderRadius: "5px",
                    fontFamily: "Rubik",
                  },
                }}
              />
            </Grid>
            <Divider
              variant="middle"
              sx={{
                bgcolor: "#DD890C",
                width: "100%",
                my: "auto",
              }}
            />
            <Grid
              sx={{
                "&.MuiGrid-item": {
                  paddingY: `15px`,
                },
              }}
              item
              xs={12}
              sm={12}
              md={3}
              lg={3}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 800,
                  fontFamily: "Rubik",
                }}
              >
                $Bearberry Amount
              </Typography>
            </Grid>

            <Grid
              sx={{
                "&.MuiGrid-item": {
                  paddingY: `15px`,
                },
              }}
              item
              xs={12}
              sm={12}
              md={9}
              lg={9}
            >
              <TextField
                id="filled-basic"
                label=""
                variant="filled"
                fullWidth
                onChange={(e) => {
                  let val = e.target.value;
                  setTokenAmount(val);
                }}
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{
                  input: {
                    outline: "none",
                    border: "none",
                    color: "white",

                    background: "#404040",
                    padding: 0,
                    pt: 0,
                    borderRadius: "5px",
                    fontFamily: "Rubik",
                  },
                }}
              />
            </Grid>
            <Divider
              variant="middle"
              sx={{
                bgcolor: "#DD890C",
                width: "100%",
                my: "auto",
              }}
            />
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Description text="$Bearberry functions as an ERC20 token standard on the ledger and therefore is self custodial. Please make sure you double check when entering a wallet address before sending any tokens." />
              {/* <Description text=" entering a wallet address before sending any tokens." /> */}
            </Grid>
            <Grid item xs={12} sm={8} md={10} lg={10}>
              <Description text="Bear cave clubhouse™ is not liable for any $Bearberry sent to an incorrect address." />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={2}
              lg={2}
              sx={{
                width: "100%",
                "@media (max-width: 475px)": {
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",

                  // height: '45%',
                },
              }}
            >
              <Button
                variant="contained"
                endIcon={
                  <img src="/icons/Arrow.svg" className="connect-btn-icon" />
                }
                sx={{
                  borderRadius: "48px",
                  height: "25px",
                  width: "9rem",
                  background: "#FFA370",
                  mx: "auto",
                  my: "10px",
                  "&:hover": {
                    background: "#FFA370",
                  },
                }}
                onClick={() => {
                  send();
                }}
              >
                <Typography
                  sx={{
                    fontSize: 8,
                    fontWeight: "bold",
                    color: "black",
                    fontFamily: "Rubik",
                  }}
                >
                  {loader ? "Sending" : "Send"} $Bearberry
                </Typography>{" "}
              </Button>
            </Grid>
          </Grid>
        </Container>

        <Container
          maxWidth="md"
          sx={{
            height: "3rem",
            mt: 3,
            background: "black",
          }}
        >
          <Stack
            direction="row"
            spacing={0}
            // justifyContent="space-around"
            sx={{
              py: 0,
              justifyContent: {
                xs: "center",
                sm: "space-between",
                md: "space-around",
              },
            }}
          >
            <Button
              variant="contained"
              endIcon={
                <img src="/icons/Arrow.svg" className="connect-btn-icon" />
              }
              sx={{
                borderRadius: "48px",
                height: "25px",
                width: "auto",
                background: "#FFA370",
                // mx: "auto",
                my: "10px",
                "@media (max-width: 475px)": {
                  //pr: '5px',
                  mr: "2px",
                  // height: '45%',
                },
                "&:hover": {
                  background: "#FFA370",
                },
              }}
              onClick={() => setClaimIntent(true)}
            >
              <Typography
                sx={{
                  fontSize: 8,
                  fontWeight: "bold",
                  color: "black",
                  fontFamily: "Rubik",
                }}
              >
                CLAIM $Bearberry
              </Typography>{" "}
            </Button>
            <Button
              variant="contained"
              endIcon={
                <img src="/icons/Arrow.svg" className="connect-btn-icon" />
              }
              onClick={addToMetamask}
              sx={{
                borderRadius: "48px",
                height: "25px",
                width: "auto",
                background: "#FFA370",
                // mx: "auto",
                "@media (max-width: 475px)": {
                  //pl: '5px',
                  ml: "2px",
                  // height: '45%',
                },
                my: "10px",
                "&:hover": {
                  background: "#FFA370",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 8,
                  fontWeight: "bold",
                  color: "black",
                  fontFamily: "Rubik",
                }}
              >
                ADD $Bearberry METAMASK
              </Typography>{" "}
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default ClaimToken;
