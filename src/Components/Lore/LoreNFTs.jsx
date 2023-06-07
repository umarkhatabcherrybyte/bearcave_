import React, { useEffect, useState } from "react";
import { Box, Button, Container, Stack, Grid, Avatar } from "@mui/material";
import MainHeadings from "../MainHeadings/MainHeadings";
import data from "../Data/data";
import Description from "../Description/Description";
import Web3 from "web3";
import { useAccount } from "wagmi";
import { getNFTs } from "../../APIRequests/Alchemi";
import { useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { nftsAddress } from "../../APIRequests/nftsData";
import { embedGateway } from "../../APIRequests/IPFS";

const LoreNFTs = () => {
  const sendTo = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected, isDisconnected } = useAccount();
  const [nfts, setNFTs] = useState([]);
  const [latestNFTs, setLatestNFTs] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);

  useEffect(() => {
    getNFTsOfUser();
  }, [address, isConnected]);

  useEffect(() => {
    hanldeNftLoad();
  }, [address, isConnected, nfts]);

  async function getNFTsOfUser() {
    getNFTs(address, nftsAddress).then((res) => {
      if (res.length === 0) {
        setIsLoading(false);
      } else {
        setNFTs(res);
      }
    });
  }

  async function hanldeNftLoad() {
    let nft = nfts?.map((item) => {
      let img = embedGateway(item.rawMetadata.image);

      console.log("img is ", img);
      return {
        ...item,
        image: img,
      };
    });
    setLatestNFTs(nft);
    setIsLoading(false);
  }
  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          pt: 15,
        }}
      >
        <MainHeadings heading="YOUR COLLECTION" />
        <Description text="THIS IS YOUR PERSONAL  BEAR CAVE DASHBOARD. HERE YOU CAN ACCESS FEATURES LIKE THE SHOP, CREATIVE LORE, PUBLIC FEED & MORE!" />
      </Container>

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
              maxWidth="lg"
              sx={{
                pt: 10,
              }}
            >
              {" "}
              <Grid container spacing={0} direction="row">
                {latestNFTs.map((item) => (
                  <Grid
                    spacing={2}
                    key={item.contract.address + item.tokenId}
                    item
                    xs={12}
                    sm={4}
                    md={4}
                    lg={4}
                    // sx={{
                    //   "@media (max-width: 475px)": {
                    //     display: "flex",
                    //     justifyContent: "center",

                    //     // height: '45%',
                    //   },
                    // }}
                    sx={{
                      padding: "10px",

                      borderRadius: "20px",
                    }}
                  >
                    <button
                      onClick={() => {
                        // setSelectedNFT(item);

                        localStorage.setItem(
                          "latest_nft",
                          JSON.stringify(item)
                        );

                        // var imageLink = item.rawMetadata.image;
                        // console.log(imageLink);
                        sendTo.from == "lores"
                          ? navigate(
                              `/lore/${item.tokenId}/${item.contract.address}`,
                              { state: "" }
                            )
                          : navigate(
                              `/bearLog/${item.tokenId}/${item.contract.address}`
                            );
                      }}
                    >
                      <img
                        style={{
                          width: "250px",
                          height: "250px",
                          objectFit: "contain",
                        }}
                        src={item.image}
                      />
                    </button>
                  </Grid>
                ))}
              </Grid>
            </Container>
          )}
        </Grid>
      )}
    </>
  );
};

export default LoreNFTs;
