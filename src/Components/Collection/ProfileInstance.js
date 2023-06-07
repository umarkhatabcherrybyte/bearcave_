import { Button, Grid, Input, Typography } from "@mui/material";
import React, { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";

function ProfileInstance({ updator, profile, item }) {
  //   console.log({ profile });
  const [value, setValue] = useState("");
  const [editable, setEditable] = useState(false);
  function update() {
    let arr =
      (profile && profile.length) > 0
        ? profile.filter((instance) => instance.name != item.name)
        : [];
    arr.push({
      name: item.name,
      value: value,
    });
    // console.log("new array to write ", arr);
    let objectForm = {};
    for (let index = 0; index < arr.length; index++) {
      objectForm[arr[index].name] = arr[index].value;
    }
    updator(objectForm);
    setEditable(false);
  }

  return (
    <Grid
      key={"profile_record" + item.id + item.name + item.value}
      container
      direction="row"
      p={1}
    >
      <Grid item md={4} xs={12}>
        {item.name}
      </Grid>
      <Grid item md={4} xs={12}>
        {item.value}
      </Grid>

      {/* <Grid
        item
        md={4}
        xs={12}
        sx={{ display: "flex", justifyContent: "right" }}
      ></Grid> */}
      <Grid
        item
        md={4}
        xs={12}
        direction="row"
        sx={{ display: "flex", justifyContent: "right" }}
      >
        {editable && (
          <Input
            sx={{
              color: "white",
              border: "1px solid white",
              borderRadius: "5px",
              borderBottom: "transparent",
            }}
            color="primary"
            onChange={(e) => setValue(e.target.value)}
          />
        )}

        <Button
          variant="outlined"
          sx={{
            borderColor: "white",
            marginRight: "10px",
            "&:hover": {
              color: "white",
              background: "#FFA370",
              border: 1,
            },
            "&:focus": {
              border: 1,
              background: "black",
              color: "white",
            },
          }}
          onClick={() => {
            update();
            // setEditDiscordId(false);
          }}
          endIcon={
            <SaveIcon
              sx={{
                backgroundcolor: "white",
                //background: 'white',
                color: "white",
              }}
            />
          }
        >
          <Typography
            sx={{
              color: "white",
            }}
          >
            SAVE
          </Typography>
        </Button>
        <Button
          variant="outlined"
          sx={{
            borderColor: "white",
            marginRight: "10px",
            "&:hover": {
              color: "white",
              background: "#FFA370",
              border: 1,
            },
            "&:focus": {
              border: 1,
              background: "black",
              color: "white",
            },
          }}
          onClick={(e) => {
            setEditable(true);
          }}
          endIcon={
            <ModeEditOutlineIcon
              sx={{
                backgroundcolor: "white",
                //background: 'white',
                color: "white",
              }}
            />
          }
        >
          <Typography
            sx={{
              color: "white",
            }}
          >
            EDIT
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
}

export default ProfileInstance;
