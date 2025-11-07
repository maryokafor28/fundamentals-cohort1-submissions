import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message || err.message || "Network error";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
