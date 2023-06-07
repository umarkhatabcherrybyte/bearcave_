import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect, useState } from "react";
//import { createTicket, getTicket } from "../../APIRequests/SafeSwapAPICalls";
import { createRaffle, getRaffle } from "../../APIRequests/RaffleAPICalls";
import data from "../Data/data";
import MainHeadings from "../MainHeadings/MainHeadings";
import CreatedTickets from "./CreatedTickets";
import { useAccount, useConnect, useDisconnect, useSigner } from "wagmi";
import "./CreateTicketStyle.css";
import { Contract, ethers, providers } from "ethers";
import { PlatformAddress, adminAddress } from "../../APIRequests/Addresses";
import WinnerHistory from "./WinnerHistory";
import { claimWinner } from "../../APIRequests/RaffleAPICalls";
const CreateTickets = () => {
  // const { signer } = useSigner();
  const { address, isConnected } = useAccount();

  //const [etherium, setPrice] = useState(null)
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");

  const [contractAddress, setContractAddress] = useState("");
  const [tokenID, setTokenID] = useState("");
  const [etherium, setEtherium] = useState(0);
  const [twitterLink, setTwitterLink] = useState("");
  const [discordLink, setDiscordLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [marketplaceLink, setMarketplaceLink] = useState("");
  const [apiUpdate, setApiUpdate] = useState(false);
  const [isERC721, setIsERC721] = useState(true);
  const [rewardName, setRewardName] = useState("");
  const [image, setimage] = useState("");
  const [category, setCategory] = useState("");

  const [addedTickets, setAddedTickets] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState();

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

  async function connectWallet() {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const web3Provider = new providers.Web3Provider(window.ethereum);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();

    const signer = await web3Provider.getSigner();
    let adr = await signer.getAddress();
    // setAddress(adr);
    console.log("Signer obtained ", signer, adr);

    return signer;
  }

  async function transferNFTs(destinationAddress) {
    let signer = await connectWallet();
    console.log("signer is ", signer);
    if (!signer) return 0;

    let adr = await signer.getAddress();
    console.log({ adr });
    if (!adr) return 0;
    let _data = {
      contractAddress: contractAddress,
      tokenID: tokenID,
      etherium: parseFloat(etherium),
      maxParticipants: parseInt(maxParticipants),
      // deadlineDate: epochDate,
      twitterLink,
      discordLink,
      marketplaceLink,
      websiteLink,
      image,
      category,
      isERC721,
      rewardName,
      //deadlineTime: time,
    };

    const the_contract = new Contract(contractAddress, nftABI, signer);
    console.log({
      the_contract,
      address,
      destinationAddress,
      tokenID,
    });
    console.log("Making a transaction...");
    try {
      let gas = await the_contract.estimateGas.transferFrom(
        address,
        destinationAddress,
        tokenID
      );

      let res = await the_contract.transferFrom(
        address,
        destinationAddress,
        tokenID,
        {
          gas,
          from: address,
        }
      );
      alert("wait for the confirmation....");
      await res.wait();

      console.log({ res } + "Transaction done!");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    // if (etherium < 1) {
    //   console.log("low eth", typeof etherium);
    // } else {
    //   parseFloat(etherium);
    //   console.log("submitted!", typeof etherium);
    // }
    let epochDate = new Date(expiryDate).getTime();
    //let epochTime = new Date(time).getTime()
    try {
      const data = {
        contractAddress: contractAddress,
        tokenID: tokenID,
        etherium: parseFloat(etherium),
        maxParticipants: parseInt(maxParticipants),
        deadlineDate: epochDate,
        twitterLink,
        discordLink,
        marketplaceLink,
        websiteLink,
        image,
        category,
        isERC721,
        rewardName,
        //deadlineTime: time,
      };

      // console.log("yesss" + address);
      console.log("connected addres", address, adminAddress);
      if (address == adminAddress) {
        try {
          // I am commenting this code to test raffle creation
          // because this code doesn't let create raffle if transaction fails.
          //------------------------------------------------------------------//
          if (isERC721 == true) {
            console.log("creating nft");
            var res = await transferNFTs(PlatformAddress);
            if (!res) {
              alert("Reward creation Failed.");
              return 0;
            }
          } else {
            console.log("creating non nft");
          }

          await createRaffle(data);
          setApiUpdate(true);
          console.log("Submitted!");
          alert("Submitted!");
        } catch (e) {
          alert("Unable to add Reward : " + e);
          console.log(e);
          return 0;
        }
      } else {
        console.log("Only admin can add raffles!");
        alert("Only admin can add Raffles!");
      }
      //createRaffle(data);
      setContractAddress("");
      setTokenID("");
      setEtherium("");
      setMaxParticipants("");
      setExpiryDate("");
    } catch (e) {
      console.log(e, "Error!");
    }

    console.log(data, typeof data.etherium);
  };
  // const getTickets = async () => {
  //   const ticketsData = await getTicket();
  //   // let _temp = {...addedTickets}
  //   // _temp.id = ticketsData.tokenID,
  //   // _temp.address = ticketsData.contractAddress,
  //   // _temp.eth = ticketsData.etherium
  //   // setAddedTickets(_temp)

  //   // ticketsData.map((item) => (
  //   //   item.deadlineDate = new Date(item.deadlineDate)
  //   // ))
  //   console.log(ticketsData);
  //   setAddedTickets([...ticketsData]);

  //   setApiUpdate(false);
  // };

  useEffect(() => {
    console.log("useEffect running");
    //getTickets();
    //getLores();
  }, [apiUpdate]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          pt: 15,
          fontFamily: "Rubik",
        }}
      >
        <MainHeadings
          heading="ADD THE Rewards "
          className="shop-page-heading"
        />
      </Box>
      <Box
        sx={{
          background: "black",
          width: "97%",
        }}
      >
        <Grid
          container
          width="100%"
          justifyContent="center"
          sx={{
            "@media (max-width: 480px)": {
              display: "flex",
              justifyContent: "center",
            },
          }}
        >
          <Grid
            md={8}
            container
            width="100%"
            sx={{
              "@media (max-width: 480px)": {
                display: "flex",
                justifyContent: "center",
              },
            }}
          >
            <Grid
              width={"90vw"}
              display="flex"
              direction="column"
              alignItems="center"
              mt={"5vh"}
            >
              <form onSubmit={(e) => handleTicketSubmit(e)}>
                <Box display={{ display: "flex" }}>
                  <InputLabel
                    style={{
                      color: "white",
                      fontSize: "2em",
                      marginRight: "20px",
                    }}
                    id="demo-simple-select-label"
                  >
                    is ERC721 ?
                  </InputLabel>
                  <Select
                    style={{
                      border: "1px solid white",
                      color: "white",
                      height: "40px",
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={isERC721}
                    label="isERC721"
                    onChange={(e) => setIsERC721(e.target.value)}
                  >
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </Box>
                {isERC721 == true ? (
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 14,
                        textAlign: "right",
                        pt: "2rem",
                        fontWeight: 500,
                        color: "White",
                        fontFamily: "Rubik",
                        //textAlign: 'center',
                        //fontFamily: "Rubick",
                      }}
                    >
                      Reward Name
                    </Typography>

                    <TextField
                      className="font"
                      id="filled-basic"
                      label=""
                      variant="filled"
                      //onChange={() ser}
                      fullWidth
                      value={rewardName}
                      onChange={(e) => {
                        setRewardName(e.target.value);
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
                        fontWeight: 500,
                        color: "White",
                        fontFamily: "Rubik",
                        //textAlign: 'center',
                        //fontFamily: "Rubick",
                      }}
                    >
                      Category
                    </Typography>

                    <TextField
                      className="font"
                      id="filled-basic"
                      label=""
                      variant="filled"
                      //onChange={() ser}
                      fullWidth
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
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
                        fontWeight: 500,
                        color: "White",
                        fontFamily: "Rubik",
                        //textAlign: 'center',
                        //fontFamily: "Rubick",
                      }}
                    >
                      CONTRACT ADDRESS
                    </Typography>

                    <TextField
                      className="font"
                      id="filled-basic"
                      label=""
                      variant="filled"
                      //onChange={() ser}
                      fullWidth
                      value={contractAddress}
                      onChange={(e) => {
                        setContractAddress(e.target.value);
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
                      TOKEN ID
                    </Typography>
                    <TextField
                      className="font"
                      id="filled-basic"
                      label=""
                      variant="filled"
                      //onChange={() ser}
                      fullWidth
                      value={tokenID}
                      onChange={(e) => {
                        setTokenID(e.target.value);
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
                ) : (
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 14,
                        textAlign: "right",
                        pt: "2rem",
                        fontWeight: 500,
                        color: "White",
                        fontFamily: "Rubik",
                        //textAlign: 'center',
                        //fontFamily: "Rubick",
                      }}
                    >
                      Reward Name
                    </Typography>

                    <TextField
                      className="font"
                      id="filled-basic"
                      label=""
                      variant="filled"
                      //onChange={() ser}
                      fullWidth
                      value={rewardName}
                      onChange={(e) => {
                        setRewardName(e.target.value);
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
                        fontWeight: 500,
                        color: "White",
                        fontFamily: "Rubik",
                        //textAlign: 'center',
                        //fontFamily: "Rubick",
                      }}
                    >
                      Image Link
                    </Typography>

                    <TextField
                      className="font"
                      id="filled-basic"
                      label=""
                      variant="filled"
                      //onChange={() ser}
                      fullWidth
                      value={image}
                      onChange={(e) => {
                        setimage(e.target.value);
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
                        fontWeight: 500,
                        color: "White",
                        fontFamily: "Rubik",
                        //textAlign: 'center',
                        //fontFamily: "Rubick",
                      }}
                    >
                      Category
                    </Typography>

                    <TextField
                      className="font"
                      id="filled-basic"
                      label=""
                      variant="filled"
                      //onChange={() ser}
                      fullWidth
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
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
                )}
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
                  PRICE
                </Typography>
                <TextField
                  className="font"
                  id="filled-basic"
                  label=""
                  variant="filled"
                  //onChange={() ser}
                  fullWidth
                  value={etherium}
                  onChange={(e) => {
                    setEtherium(e.target.value);
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
                  MAXIMUM PARTICIPANTS
                </Typography>
                <TextField
                  className="font"
                  id="filled-basic"
                  label=""
                  variant="filled"
                  //onChange={() ser}
                  fullWidth
                  value={maxParticipants}
                  onChange={(e) => {
                    setMaxParticipants(e.target.value);
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
                  Marketplace Link (Optional)
                </Typography>
                <TextField
                  className="font"
                  id="filled-basic"
                  label=""
                  variant="filled"
                  //onChange={() ser}
                  fullWidth
                  value={marketplaceLink}
                  onChange={(e) => {
                    setMarketplaceLink(e.target.value);
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
                  Twitter Link (Optional)
                </Typography>
                <TextField
                  className="font"
                  id="filled-basic"
                  label=""
                  variant="filled"
                  //onChange={() ser}
                  fullWidth
                  value={twitterLink}
                  onChange={(e) => {
                    setTwitterLink(e.target.value);
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
                  Website Link (Optional)
                </Typography>
                <TextField
                  className="font"
                  id="filled-basic"
                  label=""
                  variant="filled"
                  //onChange={() ser}
                  fullWidth
                  value={websiteLink}
                  onChange={(e) => {
                    setWebsiteLink(e.target.value);
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
                  Discord Link (Optional)
                </Typography>
                <TextField
                  className="font"
                  id="filled-basic"
                  label=""
                  variant="filled"
                  //onChange={() ser}
                  fullWidth
                  value={discordLink}
                  onChange={(e) => {
                    setDiscordLink(e.target.value);
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
                  DEADLINE
                </Typography>
                <TextField
                  type="date"
                  className="font"
                  id="filled-basic"
                  label=""
                  variant="filled"
                  fullWidth
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    input: {
                      type: "date",
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
                  <Button
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
                      Create Reward
                    </Typography>{" "}
                  </Button>
                </Box>
              </form>
              <WinnerHistory />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CreateTickets;
