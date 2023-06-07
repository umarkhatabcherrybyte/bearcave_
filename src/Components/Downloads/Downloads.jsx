import React, { useEffect } from "react";
import MainHeadings from "../MainHeadings/MainHeadings";
import { Typography, Box, Container, Stack, Paper } from "@mui/material";
import { useState } from "react";
import { width } from "@mui/system";
import { getGraphics } from "../../APIRequests/GraphicsAPICalls";
const Downloads = () => {
  const [bannerImages, setBannerImages] = useState([]);
  const [socialMediaImages, setSocialMediaImages] = useState([]);

  function downloadImg(url, name) {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  async function getGraphicsData() {
    let res = await getGraphics();
    let banners = [],
      socials = [];
    for (let index = 0; index < res.length; index++) {
      console.log("name is ", res[index].name);
      const element = res[index].data;
      element.name = res[index].name;
      let img = new Buffer.from(element.data).toString("base64");
      img = `data:image/png;base64,${img}`;
      element.image = img;
      console.log("element is ", element);

      if (res[index].type == "banner") {
        banners.push(element);
      } else {
        socials.push(element);
      }
    }
    setBannerImages(banners);
    setSocialMediaImages(socials);
  }
  useEffect(() => {
    getGraphicsData();
  }, []);

  return (
    <div
      style={{
        minHeight: "100h",
        width: "100%",
        height: "fit-content",
        color: "white",
      }}
    >
      <Box sx={{ mt: "15vh" }}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ mb: 2, fontSize: "2em", fontWeight: "700" }}>
            Banner Images
          </Typography>
          <hr style={{ width: "100%" }} />
        </Box>

        {bannerImages.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {bannerImages.map((image) => (
              <Box key={image._id} sx={{ m: 1, borderRadius: "20px" }}>
                <a
                  style={{ borderRadius: "10px" }}
                  // href={`//images/${image._id}`}
                >
                  <img
                    onClick={() => downloadImg(image.image, image.name)}
                    src={image.image}
                    alt={image.name}
                    style={{
                      maxWidth: "200px",
                      height: "200px",
                      objectFit: "contain",
                    }}
                  />
                </a>
              </Box>
            ))}
          </Box>
        ) : (
          <Box> No items</Box>
        )}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ mb: 2, fontSize: "2em", fontWeight: "700" }}>
            Social Media Images
          </Typography>
          <hr style={{ width: "100%" }} />
        </Box>

        {socialMediaImages.length > 0 ? (
          <Box>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {socialMediaImages.map((image) => (
                <Box key={image._id} sx={{ m: 1 }}>
                  <img
                    onClick={() => downloadImg(image.image, image.name)}
                    src={image.image}
                    alt={image.name}
                    style={{ maxWidth: "200px" }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <Box> No items</Box>
        )}
      </Box>
    </div>
  );
};

export default Downloads;
