import axios from "axios";
import { base_url } from "../base_urls";

const createProfileURL = `${base_url}/profile`;
const searchProfileURL = `${base_url}/searchprofile/`;
const updateProfileURL = `${base_url}/updateprofile/`;

export const createProfile = async (data) => {
  axios.post(createProfileURL, data).then((res) => {
    console.log(res);
  });
};

export const searchProfile = async (id) => {
  const { data } = await axios.get(searchProfile + id);
  return data;
};
export const updateProfile = async (id, data) => {
  axios.put(updateProfile + id, data).then((res) => {
    console.log(res);
  });
};
