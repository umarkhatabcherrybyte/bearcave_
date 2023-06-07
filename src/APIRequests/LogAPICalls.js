import axios from "axios";
import { base_url } from "../base_urls";
import { nftObj } from "../Components/NFTs_data/NFTobj";
const addLogURL = `${base_url}/bearlog`
const getLogURL = `${base_url}/bearlogdata`
const searchLogURL = `${base_url}/searchlog/`
const updateLogURL = `${base_url}/updatelore/`
const updateLogHistory = `${base_url}/updateloghistory/`


//create bear log API call
export const createLog = async(data) => {
    axios.post(addLogURL, data).then((res) => {
          console.log(res);
          console.log(res.data);
        });
  }


//search log API call
export const searchLog = async(id) => {
    const { data } = await axios.get(searchLogURL + id );
    console.log(data)
    //nftObj.sel_nft_id = data.id
    //nftObj.name = data.name
    //nftObj.img = nftArray[i].img
    //nftObj.traits = data.traits
    //nftObj.lore = data.lore
    //nftObj.tokenId = nftArray[i].tokenId
    //nftObj.contractAddress = data.contractAddress
    //return nftObj
    return data
}
export const updateHistoryLog = async(id,detail)=>{
  console.log(detail,"der")
  axios.put(updateLogHistory + id,detail ).then((res) => {
    console.log(res.data);
  });
  
}