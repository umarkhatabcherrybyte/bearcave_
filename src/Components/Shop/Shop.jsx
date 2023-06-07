import {
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Container, Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import {
  getRaffle,
  getRaffleCategories,
  getWinner,
  updateRaffleParticipant,
} from "../../APIRequests/RaffleAPICalls";
import MainHeadings from "../MainHeadings/MainHeadings";
import ShopCard from "../ShopCard/ShopCard";
import { useBalance, useSigner } from "wagmi";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { addRaffleParticipant } from "../../APIRequests/RaffleAPICalls";
import { ethers, providers } from "ethers";
import CircularProgress from "@mui/material/CircularProgress";
import "./Shop.css";
import Web3 from "web3";
import { PlatformAddress } from "../../APIRequests/Addresses";
import { bearriesABI, contractAddress } from "../../APIRequests/bearries";
import { parseEther } from "ethers/lib/utils.js";
import Categories from "./Categories";
import { getFilteredCategory } from "../../APIRequests/RaffleAPICalls";

const cardItems = [
  {
    img: "/img/shop-card-img-1.svg",
    name: "Raffle Eth",
  },
  {
    img: "/img/shop-card-img-2.svg",
    name: "Raffle Eth",
  },
  {
    img: "/img/shop-card-img-3.svg",
    name: "Raffle Eth",
  },
  {
    img: "/img/shop-card-img-4.svg",
    name: "Raffle Eth",
  },
  {
    img: "/img/shop-card-img-4.svg",
    name: "Raffle Eth",
  },
];

let thirdPartyPubKey = PlatformAddress;
let thirdPartyPrivKey =
  "6b9ad087d2878f4beacf847bd9b89c5984a2e68cc7f1f3c53a0c40f578847ff7";
const polygonProviderUrl =
  "https://polygon-mumbai.infura.io/v3/0e88431708fb4d219a28755bf50fb061";
const web3Polygon = new Web3(polygonProviderUrl);
web3Polygon.eth.accounts.wallet.add(thirdPartyPrivKey);

const Shop = () => {
  // console.log(thirdPartyPrivKey);
  const { signer } = useSigner();
  const web3 = new Web3(window.ethereum);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const [cart, setCart] = useState([]);
  const [addedRaffles, setAddedRaffles] = useState([]);
  const [winnerArr, setWinnerArr] = useState([]);
  const [participantCount, setParticipantCount] = useState(false);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [claimIntent, setClaimIntent] = useState(false);
  const [balance, setBalance] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data, isError, isLoading } = useBalance({
    address: address,
  });
  {
    isLoading ? console.log("Fetching balance…") : "failed";
  }
  {
    isError ? console.log("Error fetching balance") : "failed";
  }

  const handleMessage = (message) => {
    setMessage(message);
  };

  useEffect(
    () => {
      setLoading(true);
      console.log("useEffect running");
      getRaffles();
      getCategories();
    },
    [participantCount],
    [winnerArr],
    [categories]
  );
  useEffect(() => {
    setTimeout(async () => {
      setLoading(false);
    }, 1000);
  }, [addedRaffles]);

  const getRaffles = async () => {
    setLoading(true);
    setAddedRaffles([]);

    const rafflesData = await getRaffle();
    console.log(rafflesData);
    setAddedRaffles(rafflesData);
    console.log(addedRaffles);
    setLoading(false);

    // console.log(addedTickets[0].deadlineDate)
  };
  const getCategories = async () => {
    const raffleCategories = await getRaffleCategories();
    console.log(raffleCategories);
    setCategories(raffleCategories);
    console.log(categories);
  };
  const handleFilterClick = async (item) => {
    try {
      console.log(item + " item clicked");
      if (item == "all") {
        await handleAllRafflesClick();
        return 0;
      }
      const filteredCategory = await getFilteredCategory(item);
      console.log(filteredCategory);
      setAddedRaffles(filteredCategory);
    } catch (e) {
      console.log(e);
    }
  };
  const handleAllRafflesClick = async () => {
    try {
      getRaffles();
    } catch (e) {
      console.log(e);
    }
  };
  const handleParticipateClick = async (
    address,
    docId,
    participants,
    deadline
  ) => {
    if (participants < 1 || deadline < Date.now()) {
      console.log("No more participations left or it is expired!");
    } else {
      console.log("address.....", address, "doc;;;;;;;;;", docId);
      const data = {
        participantID: address,
      };
      setParticipantCount(false);
      const addParticipant = await addRaffleParticipant(docId, data);
      setParticipantCount(true);
    }
  };

  function addToCart(raffle) {
    console.log("ad");
    let newCart = cart.filter((item) => item.id != raffle.id);
    newCart.push(raffle);
    setCart(newCart);
    // setAmountToPay(amounToPay + raffle.priceToPay);
  }

  // async function connectWallet() {
  //   await window.ethereum.request({ method: "eth_requestAccounts" });
  //   const web3Provider = new providers.Web3Provider(window.ethereum);
  //   const signer = web3Provider.getSigner();
  //   let adr = await signer.getAddress();
  //   console.log("Signer obtained ", signer, adr);
  //   return signer;
  // }

  async function getBalance() {
    try {
      setLoading(true);
      console.log(signer);
      // let signer = await connectWallet();
      // if (!signer) return;

      const the_contract = new ethers.Contract(
        contractAddress,
        bearriesABI,
        signer
      );
      let bal = await the_contract.balanceOf(address);
      bal = parseFloat(bal / 10 ** 18).toFixed(4);
      setBalance(bal > 0.0 ? bal : 0);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }
  async function claimCart() {
    try {
      let amount = 0;
      for (let k = 0; k < cart.length; k++) {
        const raffle = cart[k];
        amount += raffle.priceToPay;
      }

      // if (balance < amount) {
      //   alert("You do not have sufficient $BRRY.");
      //   return 0;
      // }

      setLoading(true);

      // let signer = await connectWallet();
      // if (!signer) return;

      const the_contract = new ethers.Contract(
        contractAddress,
        bearriesABI,
        signer
      );

      console.log("Making a transaction...");

      console.log({ address, contractAddress, amount: amount.toString() });
      let gas;
      gas = await the_contract.estimateGas.transfer(
        contractAddress,
        parseEther(amount.toString()),
        {
          from: address,
        }
      );

      let res = await the_contract.transfer(
        contractAddress,
        parseEther(amount.toString()),
        {
          gasLimit: gas,
        }
      );

      console.log("waiting for confirmation....");
      await res.wait();
      console.log("Confirmed !");

      for (let i = 0; i < cart.length; i++) {
        const raffle = cart[i];
        console.log("raffle #", i + 1);
        for (let j = 0; j < raffle.participateCount; j++) {
          console.log("adding ", raffle.id, "for ", j + 1, "time");

          const hello = await updateRaffleParticipant(raffle.id, {
            participantID: address,
          });

          console.log("raffle participant added ", hello);
        }
      }
      // console.log(hello, "res");
      getBalance();
      getRaffles();
      setLoading(false);
      console.log();
      setClaimIntent(false);
      console.log();
      setCart([]);
      alert("Successfully Participated 🎉");
    } catch (e) {
      if (String(e).includes("transfer amount exceeds balance")) {
        alert("You don't have enough $Bearberry");
      } else alert("Claim Failed." + e);

      console.log(e);
      setCart([]);

      setClaimIntent(false);
      setLoading(false);
      console.log(e);
    }
  }

  useEffect(() => {
    getBalance();
  }, [addedRaffles]);

  let columnFlex = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const handlePartipation = async (amount, raffle) => {
    // if (participants < 1 || deadline < Date.now()) {
    //   console.log('No more participations left or it is expired!')
    // }
    // else {
    for (let j = 0; j < amount; j++) {
      console.log("address.....", address, "doc;;;;;;;;;", raffle.id);
      const data = {
        participantID: address,
      };
      // setParticipantCount(false)
      await addRaffleParticipant(raffle.id, data);
    }

    // setParticipantCount(true)
    // }
  };

  let amountToPay = 0;
  for (let k = 0; k < cart.length; k++) {
    const raffle = cart[k];
    amountToPay += raffle.priceToPay;
  }

  return (
    <div>
      {loading && (
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            pt: 15,
          }}
        >
          <CircularProgress size={"100px"} />
          <Typography color={"white"} fontFamily={"Rubik"} fontSize={"2em"}>
            Loading....
          </Typography>
        </Grid>
      )}
      {!loading && claimIntent == true ? (
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            pt: 15,
          }}
          color={"white"}
          zIndex={20}
          minHeight={"100vh"}
          height={"fit-content"}
          width={"100vw"}
          bgcolor={"rgba(0,0,0,0.4)"}
          borderRadius={"20px"}
          justifyContent={"center"}
        >
          <h1 style={{ fontSize: "3em" }}>Claim your Cart</h1>
          {
            <Grid
              paddingBottom={"10px"}
              height={"fit-content"}
              color={"white"}
              width={"100%"}
            >
              {cart.length > 0 ? (
                <div>
                  {cart.map((item) => {
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          background: "white",
                          color: "black",
                          borderRadius: "20px",
                          width: "70vw",
                          marginBottom: "20px",
                          padding: "10px",
                        }}
                      >
                        {console.log(addedRaffles)}
                        <img
                          style={{
                            width: "200px",
                            objectFit: "contain",
                            borderRadius: "20px",
                            marginRight: "20px",
                          }}
                          src={item.image}
                        />
                        <div
                          style={{ ...columnFlex, alignItems: "flex-start" }}
                        >
                          <h1>
                            ID :{" "}
                            {String(item.id).slice(0, 4) +
                              "..." +
                              String(item.id).slice(-4)}
                          </h1>
                          <p>Amount : {item.participateCount} Times</p>

                          <p>Price : {item.priceToPay} $BRRY</p>
                        </div>
                      </div>
                    );
                  })}
                  <Typography fontFamily={"Rubik"}>
                    Total $BRRY to Pay : {amountToPay}
                  </Typography>
                </div>
              ) : (
                <h1>Please Add items in the Cart First</h1>
              )}
            </Grid>
          }
          <Grid display={"flex"} justifyContent={"space-around"} width={"30vw"}>
            <ButtonGroup>
              <Button
                color="success"
                width={"fit-content"}
                variant="contained"
                onClick={() => claimCart()}
              >
                Claim
              </Button>
            </ButtonGroup>

            <ButtonGroup>
              <Button
                color="error"
                height={"40px"}
                width={"fit-content"}
                variant="contained"
                onClick={() => {
                  setClaimIntent((claimIntent) => !claimIntent),
                    setLoading(false);
                }}
              >
                Close
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      ) : (
        !loading && (
          <>
            <div
              style={{
                marginTop: "65px",
                display: "flex",
                // ml: ,
              }}
            >
              <Grid
                //  height={"fit-content"}
                color={"white"}
                // display={"flex"}
                justifyContent={"space-between"}
              >
                <Grid width={"fit-content"}>
                  <h1 className="shop-page-heading">
                    {"$BRRY Balance:" + balance}
                  </h1>
                </Grid>

                <Button
                  height={"20px"}
                  color="success"
                  width={"fit-content"}
                  variant="contained"
                  onClick={() => setClaimIntent(true)}
                >
                  Claim Cart
                </Button>
                <FormControl
                  sx={{
                    background: "transparent",
                    color: "white",
                    width: "fit-content",
                    minWidth: "200px",
                  }}
                  fullWidth
                >
                  <InputLabel
                    style={{ color: "white" }}
                    id="demo-simple-select-label"
                  >
                    Select Category
                  </InputLabel>
                  <Select
                    sx={{
                      color: "white",
                      height: "40px",
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedCategory}
                    label="Age"
                    onChange={async (e) => {
                      handleFilterClick(e.target.value);
                      setSelectedCategory(e.target.value);
                    }}
                  >
                    <MenuItem value={"all"}>All</MenuItem>;
                    {categories.map((item) => {
                      return <MenuItem value={item}>{item}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </div>

            <Container
              maxWidth="lg"
              sx={{
                height: "fit-content",
                minHeight: "100vh",
                minWidth: "100%",
                pt: 5,
                background: "black",
                ml: 0,
                alignContent: "center",
                display: "flex",
                justifyContent: "center",
                mx: 0,
              }}
            >
              {loading ? (
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
                  {addedRaffles.length > 0 ? (
                    addedRaffles.map((item) => (
                      <Grid
                        justifyContent={"space-between"}
                        // sx={{
                        //   display: "flex",
                        //   justifyContent: "space-around",
                        //   "@media (max-width: 480px)": {
                        //     display: "flex",
                        //     justifyContent: "center",
                        //   },
                        // }}
                      >
                        <ShopCard
                          title={item.rewardName}
                          ctg={item.category}
                          addToCart={addToCart}
                          raffleCart={cart}
                          raffle={item}
                          img={item.image}
                          price={item.etherium}
                          participants={item.maxParticipants}
                          deadline={item.deadlineDate}
                          id={item._id}
                          participantID={item.participantIDs}
                          contractAddress={item.contractAddress}
                          tokenId={item.tokenID}
                          getAddress={handleParticipateClick}
                          onMessage={handleMessage}
                          balance={balance}
                          updator={() => getRaffles()}
                        />
                      </Grid>
                    ))
                  ) : (
                    <Typography sx={{ color: "white" }}>
                      <h1>No Raffles to show</h1>
                    </Typography>
                  )}
                </Grid>
              )}
            </Container>
          </>
        )
      )}
    </div>
  );
};

export default Shop;
