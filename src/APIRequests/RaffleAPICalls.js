import axios from "axios";
import { base_url } from "../base_urls";
//----------------------------------------------------------
const addRaffleURL = `${base_url}/addraffles`;
const getRaffleURL = `${base_url}/rafflesdata`;
const addParticipantInRaffleURL = `${base_url}/raffles`;
const announceWinnerURL = `${base_url}/raffles/:id/select-winner`;
const claimWinnerURL = `${base_url}/makeclaim`;
const getWinnerAPIURL = `${base_url}/winnerdata`;
const deleteWinnerAPIURL = `${base_url}/delete-winner`;
const updateWinnnerAPIURL = `${base_url}/updatewinner`;
const updateRaffleAPIURL = `${base_url}/updateraffle/`;
const deleteRaffleAPIURL = `${base_url}/deleteraffle/`;
const getRaffleCategoriesAPIURL = `${base_url}/rafflescategories/`;
const getFilteredCategoryAPIURL = `${base_url}/filtercategories`;
//-----------------------------------------------------------
export const markWinner = async (winnerAddress, contractAddress, tokenId) => {
  console.log("marking winner");
  await axios
    .put(updateWinnnerAPIURL, {
      winnerAddress: winnerAddress,
      contractAddress: contractAddress,
      tokenId: tokenId,
    })
    .then((res) => {
      console.log(res);
      console.log(res.data);
    });
};
export const claimWinner = async (id) => {
  console.log(id);
  axios.put(claimWinnerURL, { id }).then((res) => {
    console.log(id);
    console.log(res);
  });
};

export const getWinner = async () => {
  const { data } = await axios.get(getWinnerAPIURL);
  // setLoreData(data.lores);
  // console.log(data.lores.length);
  console.log(data.winnerData);
  return data.winnerData;
};
export const createRaffle = async (data) => {
  axios.post(addRaffleURL, data).then((res) => {
    console.log(res);
    console.log(res.data);
  });
};
export const getRaffle = async () => {
  const { data } = await axios.get(getRaffleURL);
  // setLoreData(data.lores);
  // console.log(data.lores.length);
  console.log(data.rafflesData);
  return data.rafflesData;
};
export const getRaffleCategories = async () => {
  try {
    const { data } = await axios.get(getRaffleCategoriesAPIURL);
    console.log(data.categories);
    return data.categories;
  } catch (e) {
    console.log(e);
  }
};
export const getFilteredCategory = async (category) => {
  try {
    const response = await axios.get(
      `${getFilteredCategoryAPIURL}/${category}/`
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
export const addRaffleParticipant = async (id, data) => {
  console.log("ArffleAPICalls: adding raffle with ", { id, data });
  axios.put(`${base_url}/addparticipantinraffle`, id, data).then((res) => {
    console.log(res);
    console.log(res.data);
  });
};

export const updateRaffleParticipant = async (id, data) => {
  console.log("ArffleAPICalls: adding raffle with ", { id, data });

  const res = await axios.put(`${base_url}/raffles/${id}/participants`, {
    data,
  });

  console.log(res, "response");
  return res;
};

export const updateRaffle = async (id, data) => {
  try {
    axios.put(updateRaffleAPIURL + id, data).then((res) => {
      console.log(res);
    });
  } catch (error) {
    console.log(error);
  }
};
export const deleteRaffle = async (id) => {
  try {
    const response = await axios.delete(deleteRaffleAPIURL + id);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
