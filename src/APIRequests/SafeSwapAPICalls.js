import axios from "axios";
import { base_url } from "../base_urls";
const addTicketURL = `${base_url}/addticket`;
const getTicketURL = `${base_url}/getticket`;
export const createTicket = async (data) => {
  axios.post(addTicketURL, data).then((res) => {
    console.log(res);
    console.log(res.data);
  });
};
export const getTicket = async () => {
  const { data } = await axios.get(getTicketURL);
  // setLoreData(data.lores);
  // console.log(data.lores.length);
  console.log(data.tickets);
  return data.tickets;
};
