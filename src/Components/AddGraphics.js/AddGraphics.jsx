import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MainHeadings from "../MainHeadings/MainHeadings";
import { spacing } from "@mui/system";
import { createGraphic } from "../../APIRequests/GraphicsAPICalls";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { adminAddress } from "../../APIRequests/Addresses";

const AddGraphics = () => {
  const { address, isConnected, isDisconnected } = useAccount();

  const [walletAddress, setWalletAddress] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [type, setType] = useState("banner"); // Set default value to 'banner'
  const Navigator = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleSubmit = async (e) => {
    // call backend API function to store the image
    console.log(`File: ${file}, Type: ${type}`);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);
    await createGraphic(formData);
    alert("The Media has been added 🎉");

  };

  useEffect(() => {
    if (address != walletAddress) {
      setWalletAddress(address)
    }
  }, [address])
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "60vw",
          height: "70vh",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.7)",
          borderRadius: "10px",
        }}
        encType="multipart/form-data"
      >

        {!walletAddress ? <h1>Connect your Wallet</h1> : (
          walletAddress == adminAddress ? <Box         sx={{
            display: "flex",
            flexDirection: "column",
            width: "60vw",
            height: "70vh",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.7)",
            borderRadius: "10px",
          }}
  >
            <h1>Add Graphics</h1>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="file"
              style={{ display: "none" }}
            />
            <TextField
              label="Added Image Name"
              value={fileName}
              disabled
              sx={{ mb: 2 }}
            />
            <label htmlFor="file">
              <Button variant="contained" component="span">
                Add Graphic
              </Button>
            </label>
            <Box>
              <FormControl sx={{ mb: 2 }}>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  value={type}
                  label="Type"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="banner">Banner</MenuItem>
                  <MenuItem value="social_media">Social Media</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button onClick={handleSubmit} type="submit" variant="contained">
              Upload
            </Button>{" "}
            <Button
              onClick={() => {
                Navigator("/downloads");
              }}
              variant="outlined"
            >
              View Downloads
            </Button>
          </Box>
            : <h1>Only Admin can add graphics</h1>
        )}

      </Box>

    </Box>
  );
};

export default AddGraphics;
