import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({ baseURL, timeout: 10000 });

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err.response?.data || { error: err.message });
  }
);

export default api;
