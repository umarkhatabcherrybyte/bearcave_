import { Button, Grid, TextField, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { createTicket, getTicket } from "../../APIRequests/SafeSwapAPICalls";
import data from "../Data/data";
import MainHeadings from "../MainHeadings/MainHeadings";
import Tickets from "./Tickets";
import Web3 from "web3";
import { Contract, ethers, providers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { nftABI } from "../../APIRequests/nftsData";
import { useSigner } from "wagmi";
const AddTickets = () => {
  const safeSwapABI = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "IndexOfOwner",
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
      name: "TradeIndexOfOwnerIndex",
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
          name: "_offerSmartContract",
          type: "address",
        },
        {
          internalType: "uint256[]",
          name: "_offerTokenIds",
          type: "uint256[]",
        },
        {
          internalType: "uint256",
          name: "_offerEth",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_reqSmartContract",
          type: "address",
        },
        {
          internalType: "uint256[]",
          name: "_reqTokenIds",
          type: "uint256[]",
        },
        {
          internalType: "uint256",
          name: "_reqEth",
          type: "uint256",
        },
      ],
      name: "createOffer",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "createOfferFee",
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
      name: "feeReceiver",
      outputs: [
        {
          internalType: "address payable",
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
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      name: "fulfillOffer",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "fulfillOfferFee",
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
          name: "_address",
          type: "address",
        },
      ],
      name: "getIndexesOfOffersCreatedByAddress",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      name: "getTradeOfferReqTokenIdsByIndex",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      name: "getTradeOfferTokenIdsByIndex",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
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
      name: "offer_record",
      outputs: [
        {
          internalType: "address",
          name: "offeror",
          type: "address",
        },
        {
          internalType: "address",
          name: "offerSmartContract",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "offerEth",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "reqSmartContract",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "reqEth",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "tradeIndex",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "fulfilled",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "revoked",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      name: "onERC721Received",
      outputs: [
        {
          internalType: "bytes4",
          name: "",
          type: "bytes4",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
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
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      name: "revokeOffer",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "revokeOfferFee",
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
      name: "tradeCounter",
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
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_newFee",
          type: "uint256",
        },
      ],
      name: "updateCreateOfferFee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_feeReceiver",
          type: "address",
        },
      ],
      name: "updateFeeReceiver",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_newFee",
          type: "uint256",
        },
      ],
      name: "updateFulfillOfferFee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_newFee",
          type: "uint256",
        },
      ],
      name: "updateRevokeOfferFee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  // const { signer } = useSigner();
  const safeSwapAddress = "0x6617bFbF8DEaA7bd2c6842161999a171579959Fa"; //safeswap contract address - polygon
  const [sourceContractAddress, setSourceContractAddress] = useState("");
  const [sourceTokenId, setSourceTokenId] = useState("");
  const [sourceEthereum, setSourceEthereum] = useState("0");
  const [destinationContractAddress, setDestinationContractAddress] = useState(
    ""
  );
  const [destinationTokenId, setDestinationTokenId] = useState("");
  const [destinationEthereum, setDestinationEthereum] = useState("0");
  const [apiUpdate, setApiUpdate] = useState(false);
  const [addedTickets, setAddedTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const web3Provider = new providers.Web3Provider(window.ethereum);
    const signer = web3Provider.getSigner();
    let adr = await signer.getAddress();
    console.log("Signer obtained ", signer, adr);
    return signer;
  }

  async function transferTokens(e) {
    let signer = await connectWallet();
    console.log(signer, "sig");
    const the_contract = new ethers.Contract(
      safeSwapAddress, //safeSwapAddress
      safeSwapABI, //safeSwapABI
      signer
    );

    try {
      setLoading(true);
      const nft_contract = new ethers.Contract(
        sourceContractAddress,
        nftABI,
        signer
      );

      console.log("Approving ...", { safeSwapAddress, sourceTokenId });

      let res = await nft_contract.approve(safeSwapAddress, sourceTokenId);
      let sourceTokenIds = [sourceTokenId];
      let destinationTokenIds = [destinationTokenId];

      let res1 = await the_contract.createOffer(
        sourceContractAddress,
        sourceTokenIds,
        parseEther(sourceEthereum),
        destinationContractAddress,
        destinationTokenIds,
        parseEther(destinationEthereum),
        {
          value: 5000000000000000,
        }
      );
      console.log(res1);
      alert("Offer created Successfully 🎉");
    } catch (e) {
      console.log(e);
      alert(e);
    }
  }
  //   e.preventDefault();
  //   if (Ethereum < 1) {
  //     console.log("low eth", typeof Ethereum);
  //   } else {
  //     parseFloat(Ethereum);
  //     console.log("submitted!", typeof Ethereum);
  //   }
  //   try {
  //     const data = {
  //      sourceContractAddress:sourceContractAddress,
  //       tokenID: tokenID,
  //       Ethereum: parseInt(Ethereum),
  //     };
  //     setApiUpdate(true);
  //     //createTicket(data);
  //     console.log("Submitted!");
  //     setContractAddress("");
  //     setTokenID("");
  //     setEthereum(0);
  //   } catch (e) {
  //     console.log(e, "Error!");
  //   }

  //   console.log(data, typeof data.Ethereum);
  // };
  // const getTickets = async () => {
  //   setApiUpdate(false);
  // };

  // useEffect(() => {
  //   console.log("useEffect running");
  //   // getTickets();
  //   //getLores();
  // }, [apiUpdate]);

  return (
    <>
      <Box
        sx={{
          pt: 15,
          fontFamily: "Rubik",
        }}
      >
        <MainHeadings
          heading="SELECT NFT TO SWAP: "
          className="shop-page-heading"
        />
      </Box>
      <Box
        sx={{
          background: "black",
          pt: 5,
          width: "100vw",
          minHeight: "100vh",
        }}
      >
        <Grid
          container
          width="80%"
          justifyContent="center"
          sx={{
            "@media (max-width: 480px)": {
              display: "flex",
              justifyContent: "center",
            },
          }}
        >
          <Grid
            md={4}
            container
            width="80%"
            sx={{
              "@media (max-width: 480px)": {
                display: "flex",
                justifyContent: "center",
              },
            }}
          >
            {addedTickets.map((obj) => (
              <Grid
                md={3}
                xs={12}
                sx={{
                  pl: 1,
                }}
              >
                <Tickets
                  contract={obj.contractAddress}
                  id={obj.tokenID}
                  eth={obj.Ethereum}
                  date={obj.deadlineDate}
                  time={obj.deadlineTime}
                />
              </Grid>
            ))}
          </Grid>
          <Grid width={"100vw"}>
            <Grid
              display="flex"
              direction="row"
              alignItems="center"
              justifyContent={"space-around"}
            >
              <Box>
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "White",
                    fontFamily: "Rubik",
                    //textAlign: 'center',
                    //fontFamily: "Rubick",
                  }}
                >
                  NFT TO OFFER
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    textAlign: "right",
                    pt: "2rem",
                    fontWeight: 700,
                    color: "White",
                    fontFamily: "Rubik",
                    //textAlign: 'center',
                    //fontFamily: "Rubick",
                  }}
                >
                  SOURCE CONTRACT
                </Typography>
                <TextField
                  id="filled-multiline-static"
                  multiline
                  rows={4}
                  variant="filled"
                  //fullWidth

                  //value={lore}
                  value={sourceContractAddress}
                  onChange={(e) => {
                    setSourceContractAddress(e.target.value);
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    // px: "0px !important",
                    textArea: {
                      width: "250px",
                      padding: 0,
                      border: "1px solid white",
                      background: "#BABABA",
                      borderRadius: "5px",
                      padding: "0 !important",
                      color: "black",
                      fontFamily: "Rubik",
                    },
                    "& .fROKwd": {
                      px: "0 !important",
                    },
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 14,
                    textAlign: "right",
                    pt: "2rem",
                    fontWeight: 700,
                    color: "White",
                    fontFamily: "Rubik",
                    //textAlign: 'center',
                    //fontFamily: "Rubick",
                  }}
                >
                  OFFERING TOKEN ID
                </Typography>
                <TextField
                  className="font"
                  id="filled-basic"
                  label=""
                  variant="filled"
                  //onChange={() ser}
                  fullWidth
                  value={sourceTokenId}
                  onChange={(e) => {
                    setSourceTokenId(e.target.value);
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    input: {
                      outline: "none",
                      border: "none",
                      border: "1px solid white",
                      background: "#BABABA",
                      padding: 0,
                      pt: 0,
                      borderRadius: "5px",
                      color: "black",
                      fontFamily: "Rubik",
                      height: 28,
                    },
                    color: "white",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 14,
                    textAlign: "right",
                    pt: "2rem",
                    fontWeight: 700,
                    color: "White",
                    fontFamily: "Rubik",
                    //textAlign: 'center',
                    //fontFamily: "Rubick",
                  }}
                >
                  OFFERING ETH
                </Typography>
                <TextField
                  className="font"
                  id="filled-basic"
                  label=""
                  variant="filled"
                  //onChange={() ser}
                  fullWidth
                  value={sourceEthereum}
                  onChange={(e) => {
                    setSourceEthereum(e.target.value);
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    input: {
                      outline: "none",
                      border: "none",
                      border: "1px solid white",
                      background: "#BABABA",
                      padding: 0,
                      pt: 0,
                      borderRadius: "5px",
                      color: "black",
                      fontFamily: "Rubik",
                      height: 28,
                    },
                    color: "white",
                  }}
                />
                <Box
                  sx={{
                    pt: "2rem",
                  }}
                >
                  {/* <Button
                    //onClick={(e) => handleConnectClick(e)}
                    //onClick={e => open(e)}
                    type="submit"
                    variant="contained"
                    endIcon={
                      <img
                        src="/icons/Arrow.svg"
                        className="connect-btn-icon"
                      />
                    }
                    sx={{
                      borderRadius: "48px",
                      height: "35px",
                      width: "13rem",
                      background: "black",
                      border: 1,
                      borderColor: "#FFA370",
                      mx: "auto",
                      my: "10px",
                      "&:hover": {
                        //background: "#FFA370",
                        background: "none",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 8,
                        fontWeight: "bold",
                        color: "#FFA370",
                        fontFamily: "Rubik",
                      }}
                      className="font"
                    >
                      APPROVE | CREATE
                    </Typography>{" "}
                  </Button> */}
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: 24,
                    fontWeight: 700,
                    color: "White",
                    fontFamily: "Rubik",
                    //textAlign: 'center',
                    //fontFamily: "Rubick",
                  }}
                >
                  NFT TO REQUEST
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    textAlign: "right",
                    pt: "2rem",
                    fontWeight: 700,
                    color: "White",
                    fontFamily: "Rubik",
                    //textAlign: 'center',
                    //fontFamily: "Rubick",
                  }}
                >
                  TARGET CONTRACT
                </Typography>
                <TextField
                  id="filled-multiline-static"
                  multiline
                  rows={4}
                  variant="filled"
                  //fullWidth

                  //value={lore}
                  value={destinationContractAddress}
                  onChange={(e) => {
                    setDestinationContractAddress(e.target.value);
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    // px: "0px !important",
                    textArea: {
                      width: "250px",
                      padding: 0,
                      border: "1px solid white",
                      background: "#BABABA",
                      borderRadius: "5px",
                      padding: "0 !important",
                      color: "black",
                      fontFamily: "Rubik",
                    },
                    "& .fROKwd": {
                      px: "0 !important",
                    },
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 14,
                    textAlign: "right",
                    pt: "2rem",
                    fontWeight: 700,
                    color: "White",
                    fontFamily: "Rubik",
                    //textAlign: 'center',
                    //fontFamily: "Rubick",
                  }}
                >
                  TARGET TOKEN ID
                </Typography>
                <TextField
                  className="font"
                  id="filled-basic"
                  label=""
                  variant="filled"
                  //onChange={() ser}
                  fullWidth
                  value={destinationTokenId}
                  onChange={(e) => {
                    setDestinationTokenId(e.target.value);
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    input: {
                      outline: "none",
                      border: "none",
                      border: "1px solid white",
                      background: "#BABABA",
                      padding: 0,
                      pt: 0,
                      borderRadius: "5px",
                      color: "black",
                      fontFamily: "Rubik",
                      height: 28,
                    },
                    color: "white",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 14,
                    textAlign: "right",
                    pt: "2rem",
                    fontWeight: 700,
                    color: "White",
                    fontFamily: "Rubik",
                    //textAlign: 'center',
                    //fontFamily: "Rubick",
                  }}
                >
                  ETH
                </Typography>
                <TextField
                  className="font"
                  id="filled-basic"
                  label=""
                  variant="filled"
                  //onChange={() ser}
                  fullWidth
                  value={destinationEthereum}
                  onChange={(e) => {
                    setDestinationEthereum(e.target.value);
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    input: {
                      outline: "none",
                      border: "none",
                      border: "1px solid white",
                      background: "#BABABA",
                      padding: 0,
                      pt: 0,
                      borderRadius: "5px",
                      color: "black",
                      fontFamily: "Rubik",
                      height: 28,
                    },
                    color: "white",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              pt: "2rem",
            }}
          >
            <Button
              onClick={(e) => transferTokens(e)}
              //onClick={e => open(e)}
              type="submit"
              variant="contained"
              endIcon={
                <img src="/icons/Arrow.svg" className="connect-btn-icon" />
              }
              sx={{
                borderRadius: "48px",
                height: "35px",
                width: "13rem",
                background: "black",
                border: 1,
                borderColor: "#FFA370",
                mx: "auto",
                my: "10px",
                "&:hover": {
                  //background: "#FFA370",
                  background: "none",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: 8,
                  fontWeight: "bold",
                  color: "#FFA370",
                  fontFamily: "Rubik",
                }}
                className="font"
              >
                APPROVE | CREATE
              </Typography>{" "}
            </Button>
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default AddTickets;
