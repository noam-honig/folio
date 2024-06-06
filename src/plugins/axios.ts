import axios from "axios";

const BASE_URL = ""; // by using relative path, both the web and api can share cookies and work together, in dev, the proxy config you've set in vite.config handles it

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/`,
  timeout: 2000,
});

const getAxios = () => {
  return axiosInstance;
};

export default getAxios;
