import React, { useEffect, useRef, useState } from "react";
import { Container, Typography, Button, Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
//import { makeStyles } from "@mui/styles";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import "./Dashboard.css";
import walletConnection from "../Wallet/Wallet";
//import connectWallet from '../Wallet/Web3ModalConnection';
import { Web3Button } from "@web3modal/react";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useConnect, useDisconnect, useSigner } from "wagmi";
import { getWinner, markWinner } from "../../APIRequests/RaffleAPICalls";
import { Link, useNavigate } from "react-router-dom";
import Collection from "../Collection/Collection";
import { ProviderUrl } from "../../APIRequests/Alchemi";
import { getNFTs } from "../../APIRequests/Alchemi";
import { nftsAddress } from "../../APIRequests/nftsData";
import { embedGateway } from "../../APIRequests/IPFS";
import { providers } from "ethers";

const Web3 = require("web3");
const platformPrivKey =
  "6b9ad087d2878f4beacf847bd9b89c5984a2e68cc7f1f3c53a0c40f578847ff7";
const platform = "0x000000BbE56E878101c3F78D8A0D505BD0B372C8";

// providers information
const polygonProviderUrl = ProviderUrl;
let contractAbi = [
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
        name: "nftContractAddress",
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
    name: "nftContract",
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

// const polygonProviderUrl =   "https://polygon-mumbai.infura.io/v3/685daa6fa7f94b4b89cdc6d7c5a8639e";

const Homepage = () => {
  const { signer } = useSigner();
  const [walletAddress, setWalletAddress] = useState("");
  const { isOpen, open, close, setDefaultChain } = useWeb3Modal();
  const { address, isConnected, isDisconnected } = useAccount();
  const [winners, setWinners] = useState([]);
  const [isWinner, setIsWinner] = useState(false);
  const [winningTokenId, setWinningToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddres] = useState(null);
  const winnersGenerated = useRef(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [nfts, setNFTs] = useState([]);
  const [latestNFTs, setLatestNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isERC721, setIsERC721] = useState(false);

  const navigate = useNavigate();
  const handleConnectClick = (e) => {
    open(e);
    // const acc = walletConnection();
    // setWalletAddress(acc)
    // const acc  = connectWallet();
    // setWalletAddress(acc);
    // console.log(`The address from homepage: ` + acc)
  };
  useEffect(() => {
    getNFTsOfUser();
  }, [address, isConnected, isDisconnected]);

  useEffect(() => {
    if (latestNFTs.length < nfts.length) {
      hanldeNftLoad();
    }
  }, [address, isConnected, nfts]);

  async function getNFTsOfUser() {
    getNFTs(address, nftsAddress).then((res) => {
      if (res.length === 0) {
        setNFTs([]);
        setLatestNFTs([]);
        setIsLoading(false);
      } else {
        setNFTs(res);
      }
    });
  }
  function handleShowNFT(id, address) {
    navigate(`/showNFT/` + id + `/` + address);
  }
  async function hanldeNftLoad() {
    let _nfts = nfts.map((item) => {
      let img = item.rawMetadata.image
        ? embedGateway(item.rawMetadata.image)
        : "https://www.flop.cl/wp-content/uploads/2022/09/woocommerce-placeholder.png";

      return {
        ...item,
        image: img,
      };
    });

    setLatestNFTs(_nfts);
    setIsLoading(false);
  }

  function generateWinners() {
    for (let i = 0; i < winners.length; i++) {
      if (winners[i].winnerAddress == address) {
        console.log(
          "You Won!" + winners[i].nftContractAddress,
          winners[i].nftTokenID
        );
      } else {
        console.log("not found");
      }
    }
    winnersGenerated.current = true;
  }
  useEffect(() => {
    console.log({
      isConnected,
      isWinner,
      winnersGenerated,
    });
    if (isWalletConnected && !winnersGenerated) {
      generateWinners();
    }
    if (
      isWalletConnected == true &&
      isWinner == false &&
      winnersGenerated.current == true
    ) {
      navigate("/collection");
    }
  }, [isWalletConnected, isWinner, winnersGenerated.current]);
  async function connectWallet() {
    // let destinationWallet = "";
    await window.ethereum.request({ method: "eth_requestAccounts" });

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

  const checkWin = async () => {
    var count = 0;
    let signer = await connectWallet();
    if (!signer) return 0;
    let adr = await signer.getAddress();
    if (!adr) return 0;
    const won = await getWinner();
    console.log("winnner instances", won);
    console.log(won);

    setWinners(won);

    console.log(won);
    if (isWalletConnected) {
      console.log("checking winner", { won });
      for (let i = 0; i < won.length; i++) {
        // console.log("Your address" + adr);
        //       console.log("winner wallet address" + won[i].winnerAddress);
        // console.log("Token id: " + won[i].nftTokenId);
        // console.log("Contract address: " + won[i].nftContractAddress);
        // console.log({ claimStatus: won[i].winnerClaimed });
        // console.log("checking winner ", won[i].winnerAddress, adr);
        //
        if (won[i].winnerAddress == adr && won[i].winnerClaimed == false) {
          console.log("you won ", won[i]);
          setIsERC721(won[i].isERC721);
          setWinningToken(won[i].nftTokenId);
          setIsWinner(true);
          // console.log("You won the NFT");
          setContractAddres(won[i].nftContractAddress);

          break;
        } else {
          console.log("not found");
        }
      }
    }
  };
  useEffect(() => {
    setIsWalletConnected(isConnected);
  }, [isDisconnected, isConnected]);

  useEffect(() => {
    checkWin();
  }, [isWalletConnected]);
  async function transferNFT() {
    const web3Polygon = new Web3(polygonProviderUrl);
    web3Polygon.eth.accounts.wallet.add(platformPrivKey);

    // Instantiating the Contracts to interact with
    console.log({ contractAddress, address, winningTokenId });

    const the_contract = new web3Polygon.eth.Contract(
      contractAbi,
      contractAddress
    );

    // The private key of the wallet to be used as the platform address

    // Deriving the public address of the wallet using the private key

    const tx = the_contract.methods.transferFrom(
      platform,
      address,
      winningTokenId
    );

    setLoading(true);

    // Sending the transaction to the Binance Smart Chain

    try {
      // Getting the gas price and gas cost required for the method call
      const [gasPrice, gasCost] = await Promise.all([
        web3Polygon.eth.getGasPrice(),
        tx.estimateGas(),
      ]);

      // Encoding the ABI of the method
      const data = tx.encodeABI();

      // Preparing the transaction data
      const txData = {
        from: platform,
        to: contractAddress,
        data,
        gas: gasCost,
        gasPrice,
      };
      web3Polygon.eth.sendTransaction(txData).then(async (receipt) => {
        setLoading(false);
        alert("Successfully Claimed 🎉");
        await markWinner(address, contractAddress, winningTokenId);

        setIsWinner(false);
        console.log(`Transaction hash: ${receipt.transactionHash}`);
        navigate("/collection");
      });
      // Logging the transaction hash
    } catch (e) {
      setLoading(false);
      console.log(e);
      alert(`Transaction Failed : ${e}`);
    }
  }
  return (
    <>
      {isWinner && (
        <Box
          sx={{
            zIndex: "30",
            background: "rgba(0,0,0,0.8)",
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
          {!isERC721 ? (
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
              <Box>
                <Box>
                  {" "}
                  You successfully won the Raffle 🎉
                  <br />
                  Contact the admin{"  "}
                  <Link to={"https://twitter.com/okaybearsyc"}>here</Link>
                </Box>
                <button
                  style={{
                    backgroundColor: "#22bb33",
                    border: "none",
                    color: "white",
                    padding: "12px 24px",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setIsWinner(false);
                  }}
                >
                  Close
                </button>
              </Box>
            </Box>
          ) : (
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
              <Box> You successfully won the Raffle 🎉</Box>

              <button
                style={{
                  backgroundColor: "#008CBA",
                  border: "none",
                  color: "white",
                  padding: "12px 24px",
                  textAlign: "center",
                  textDecoration: "none",
                  display: "inline-block",
                  fontSize: "16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={transferNFT}
              >
                {loading ? "Claiming..." : "Claim"}
              </button>
              <button
                style={{
                  backgroundColor: "#22bb33",
                  border: "none",
                  color: "white",
                  padding: "12px 24px",
                  textAlign: "center",
                  textDecoration: "none",
                  display: "inline-block",
                  fontSize: "16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsWinner(false);
                }}
              >
                Close
              </button>
            </Box>
          )}
        </Box>
      )}

      <Box
        sx={{
          pt: "8rem",
          fontFamily: "Rubik",
        }}
        className="font"
      >
        <Container maxWidth="md">
          <Grid container justifyContent="space-between">
            <Grid
              xs={12}
              sm={7}
              md={6}
              mb={4}
              sx={{ flexDirection: "column", display: "flex" }}
            >
              <Typography
                sx={{
                  fontSize: 32,
                  fontWeight: 500,
                  color: "white",
                }}
                className="font"
              >
                <span className="font">WELCOME TO THE BEAR CAVE CLUBHOUSE</span>
              </Typography>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 500,
                  color: "white",

                  fontFamily: "Rubik",
                }}
                className="font"
              >
                ACCESS{" "}
                <span id="colored-text-below-heading" className="font">
                  BEAR SHOP, LORE, PUBLIC FEED
                </span>{" "}
                & MORE
              </Typography>
            </Grid>

            {!isWalletConnected && (
              <Grid
                container
                xs={12}
                sm={5}
                md={6}
                sx={{
                  flexDirection: "column",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: "white",
                    textTransform: "uppercase",
                    fontFamily: "Rubik",
                  }}
                  className="font"
                >
                  Connect Wallet
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    p: 3,
                    background: "black",
                    display: "flex",
                    flexDirection: "column",
                    width: "fit-content",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 400,
                      color: "#9CA3AF",
                      justifyContent: "start",
                      fontFamily: "Rubik",
                    }}
                    className="font"
                  >
                    RESTRICTED ACCESS
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: "white",
                      justifyContent: "start",
                      fontFamily: "Rubik",
                    }}
                    className="font"
                  >
                    HIGH BEARNATION
                  </Typography>

                  <Button
                    onClick={(e) => handleConnectClick(e)}
                    //onClick={e => open(e)}
                    variant="contained"
                    endIcon={
                      <img
                        src="/icons/Arrow.svg"
                        className="connect-btn-icon"
                      />
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
                  >
                    <Typography
                      sx={{
                        fontSize: 8,
                        fontWeight: "bold",
                        color: "black",
                        fontFamily: "Rubik",
                      }}
                      className="font"
                    >
                      {!address ? "CONNECT" : "DISCONNECT"}
                    </Typography>{" "}
                  </Button>
                </Box>
              </Grid>
            )}
            {isWalletConnected && (
              <Grid container justifyContent="right">
                <Button
                  onClick={(e) => handleConnectClick(e)}
                  //onClick={e => open(e)}
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
                >
                  <Typography
                    sx={{
                      fontSize: 8,
                      fontWeight: "bold",
                      color: "black",
                      fontFamily: "Rubik",
                    }}
                    className="font"
                  >
                    {!address ? "CONNECT" : "DISCONNECT"}
                  </Typography>{" "}
                </Button>
              </Grid>
            )}
          </Grid>
        </Container>
        {!isWalletConnected && (
          <Container
            maxWidth="md"
            sx={{
              pt: "3rem",
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
              Connect Your Wallet
            </Box>
          </Container>
        )}
        {isWalletConnected && (
          <Grid sx={{ mt: 4 }}>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pt: 10,
                }}
              >
                <CircularProgress sx={{ color: "white" }} />
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
                    maxWidth="100vw"
                    sx={{
                      width: "90vw",
                      //pt: "3rem",
                      marginTop: "3rem",
                      marginBottom: "3rem",
                      border: 1,
                      borderRadius: "12px",
                      //margin: "auto",
                      borderColor: "#FFFF",
                    }}
                  >
                    <Grid
                      width={"80vw"}
                      overflow={"scroll"}
                      display={"flex"}
                      justifyContent={"center"}
                    >
                      {latestNFTs.map((item) => (
                        <Grid
                          spacing={10}
                          p={2}
                          key={item.contract.address + item.tokenId}
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                        >
                          <img
                            style={{
                              width: "30vw",
                              maxWidth: "200px",
                              objectFit: "contain",
                              borderRadius: "20px",
                              cursor: "pointer",
                            }}
                            src={embedGateway(item.image)}
                            onClick={() => {
                              handleShowNFT(
                                item.tokenId,
                                item.contract.address
                              );
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Container>
                )}
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default Homepage;
