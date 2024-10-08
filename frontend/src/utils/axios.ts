import axios from "axios";
import data from "./urls.json";
const instance = axios.create({
  baseURL: data.development,
});
export default instance;
