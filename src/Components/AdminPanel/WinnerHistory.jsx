import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { claimWinner, getWinner } from "../../APIRequests/RaffleAPICalls";
import { CompressOutlined } from "@mui/icons-material";
// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });
const WinnerHistory = () => {
  const [allWinners, setAllWInners] = useState([]);
  //const classes = useStyles();
  const Winners = async () => {
    const winner = await getWinner();
    setAllWInners(winner);
  };

  useEffect(() => {
    //setIsLoading(true);
    console.log("useEffect running");
    Winners();
  }, []);
  const handleClaim = (e) => {
    console.log(e._id);
    console.log(e.isERC721);
    claimWinner(e._id);
  };
  return (
    <TableContainer component={Paper}>
      {/* <Table className={classes.table} aria-label="simple table"> */}
      <Table
        aria-label="simple table"
        sx={{
          bgcolor: "black",
          color: "white",
        }}
      >
        <TableHead>
          <TableRow>
            {/*winner wallet address*/}
            <TableCell
              sx={{
                color: "white",
                width: "20%",
              }}
            >
              Winner Wallet Address
            </TableCell>
            {/* nft address */}
            <TableCell
              sx={{
                color: "white",
                width: "20%",
              }}
            >
              NFT Contract Address
            </TableCell>
            {/* nft token id */}
            <TableCell
              sx={{
                color: "white",
              }}
            >
              NFT Token ID
            </TableCell>
            {/* winner claimed */}
            <TableCell
              sx={{
                color: "white",
              }}
            >
              Winner Claimed
            </TableCell>
            {/* isERC */}
            <TableCell
              sx={{
                color: "white",
              }}
            >
              Is ERC721
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {console.log(allWinners)}
          {allWinners
            ? allWinners.map((row) => (
                <TableRow key={row._id}>
                  {/* winner address */}
                  <TableCell
                    sx={{
                      color: "white",
                      width: "20%",
                    }}
                  >
                    {/* {row.winnerAddress} */}
                    {row.winnerAddress
                      ? `${row.winnerAddress.slice(
                          0,
                          4
                        )}...${row.winnerAddress.slice(-4)}`
                      : ""}
                  </TableCell>
                  {/* contract address */}
                  <TableCell
                    sx={{
                      color: "white",
                      width: "20%",
                    }}
                  >
                    {row.nftContractAddress
                      ? `${row.nftContractAddress.slice(
                          0,
                          4
                        )}...${row.nftContractAddress.slice(-4)}`
                      : ""}
                  </TableCell>
                  {/* token id */}
                  <TableCell
                    sx={{
                      color: "white",
                    }}
                  >
                    {row.nftTokenId}
                  </TableCell>
                  {/* winner claimed */}
                  <TableCell
                    sx={{
                      color: "white",
                    }}
                  >
                    {row.winnerClaimed == true ? (
                      <Button disabled="true">Claimed</Button>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={() => handleClaim(row)}
                      >
                        Make Claim
                      </Button>
                    )}
                  </TableCell>
                  {/* isERC */}
                  <TableCell
                    sx={{
                      color: "white",
                    }}
                  >
                    {row.isERC721 ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
              ))
            : ""}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WinnerHistory;
