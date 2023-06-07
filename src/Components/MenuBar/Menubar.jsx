import React, { useEffect, useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { shadows } from "@mui/system";
import { Container, Button, Typography } from "@mui/material";
import styled from "styled-components";
import { fontSize, typography } from "@mui/system";
import { useNavigate, useNavigation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
// import Divider from '@mui/material/Divider';

const btnStyle = {
  // borderRadius: '48px',
  background: "#000000",
  border: 1,
  borderColor: "black",
  m: 0,
  boxShadow: 1,
  "&:hover": {
    background: "#000000",
    border: 1,
  },
};
const Menubar = (props) => {
  const navigate = useNavigate();
  // const handleListBtnClick = (index) => {
  //   const pageNo = index;
  //   if (pageNo == 0) {
  //     navigate("/");
  //   } else if (pageNo == 1) {
  //     navigate("/feeds");
  //   } else if (pageNo == 2) {
  //     navigate("/nfts/lores");
  //   } else if (pageNo == 3) {
  //     navigate("/nfts/logs");
  //   } else if (pageNo == 4) {
  //     navigate("/rewards");
  //   } else if (pageNo == 5) {
  //     navigate("/downloads");
  //   } else if (pageNo == 6) {
  //     navigate("/Bearberry");
  //   } else if (pageNo == 7) {
  //     navigate("/collection");
  //   }
  // };

  const handleListBtnClick = (index) => {
    const pageNo = index;
    if (pageNo == 0) {
      navigate("/");
    } else if (pageNo == 1) {
      navigate("/rewards");
    } else if (pageNo == 2) {
      navigate("/Bearberry");
    } else if (pageNo == 3) {
      navigate("/collection");
    }
  };
  const [state, setState] = useState({
    top: false,
  });
  useEffect(() => {}, [open]);
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift") &&
      open.open == true
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
        background: "black",
        color: "white",
        height: "100vh",
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List sx={{ fontFamily: "Rubik" }}>
        <ListItem>
          <img src="/img/logo.png" className="navLogo" />
        </ListItem>
        <Divider
          variant="middle"
          sx={{
            background: "white",
            opacity: 0.5,
            width: "auto",
          }}
        />
        {[
          "HOME",

          // "FEED",
          // "LORE",
          // "BEAR LOG",

          "Rewards",
          // "DOWNLOADS",
          "$BEARBERRY",
          "PROFILE",
        ].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={(e) => handleListBtnClick(index)}>
              <Typography
                sx={{ fontFamily: "Rubik", cursor: "pointer" }}
                variant="upperCase"
                className="font"
                textTransform="uppercase"
              >
                {/* <ListItemText primary={text} sx = {{fontFamily: 'Rukib',}} className = 'font'/> */}
                {text}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem>
          <ListItemButton>
            <img src="/icons/twitter-icon.svg" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <img src="/icons/discord-icon.svg" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  /*
<Button
            sx = {btnStyle}
            variant='contained'
            size = "small"
           ><MenuIcon />
           
           </Button>
 */
  return (
    <>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <Button sx={btnStyle} variant="contained" size="small">
              <MenuIcon />
            </Button>
          </Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </>
  );
};

export default Menubar;
