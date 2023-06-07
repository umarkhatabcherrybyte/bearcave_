import axios from "axios"
import { base_url } from "../../base_urls";
const baseURL = base_url
export const apiReq = async (
    method_,
    url_,
    body,
    params_, 
  ) => {
    const URL = baseURL + url_;
    const response = await axios({
      // headers: {
      //   "Authorization": `Bearer ${token}`
      // },
      method: method_,
      url: URL,
      data: body,
      params: params_,
    });
    return response;
  };