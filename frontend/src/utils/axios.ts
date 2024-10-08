import axios from "axios";
import data from "./urls.json";
const instance = axios.create({
  baseURL: data.production,
});
export default instance;
