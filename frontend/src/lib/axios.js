import axios from "axios";
//after all the setup in package.json inside backend folder and in root folder
// if we run npm start from root folder than our both server and app will run from localhost:5001
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
