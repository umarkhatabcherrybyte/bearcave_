import axios from "axios";
import { base_url } from "../base_urls";
const addGraphicURL = `${base_url}/upload`;
const getGraphicsURL = `${base_url}/images`;
export const createGraphic = async (data) => {
  console.log("create Graphic", data);
  axios.post(addGraphicURL, data).then((res) => {
    console.log(res);
    console.log(res.data);
  });
};
export const getGraphics = async () => {
  const { data } = await axios.get(getGraphicsURL);
  console.log(data);
  return data;
};
