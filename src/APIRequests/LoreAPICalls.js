import axios from "axios";
import { base_url } from "../base_urls";
import { nftObj } from "../Components/NFTs_data/NFTobj";


const addLoreURL = `${base_url}/lore`;
const addLoreTransactionsURL = `${base_url}/lore-transaction`;
const getLoresURL = `${base_url}/data`;
const searchLoreURL = `${base_url}/searchlore/`;
const updateLoreURL = `${base_url}/updatelore/`;
//const searchLoresURL =

export const createLore = async (data) => {
  axios.post(addLoreURL, data).then((res) => {
    console.log(res);
    console.log(res.data);
  });
};

export const createLoreTransaction = async (data) => {
  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7',data);
  axios.post(addLoreTransactionsURL, data).then((res) => {
    console.log(res);
    console.log(res.data);
  });
};

export const searchLore = async (id) => {
  const { data } = await axios.get(searchLoreURL + id);
  nftObj.sel_nft_id = data.id;
  nftObj.name = data.name;
  //nftObj.img = nftArray[i].img
  //nftObj.traits = data.traits
  nftObj.lore = data.lore;
  //nftObj.tokenId = nftArray[i].tokenId
  nftObj.contractAddress = data.contractAddress;
  //return nftObj
  return data;
};
export const updateLore = async (id, data) => {
  console.log(id, data);
  axios.put(updateLoreURL + id, data).then((res) => {
    console.log(res);
    console.log(res.data);
  });
};

export const getLoreData = async () => {
  const { data } = await axios.get(getLoresURL);
  // setLoreData(data.lores);
  // console.log(data.lores.length);
  console.log(data.lores);
  return data.lores;
};
