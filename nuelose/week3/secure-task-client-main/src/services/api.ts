import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextObject";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const useApi = () => {
  const { accessToken, refreshToken } = useContext(AuthContext)!;

  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;
        await refreshToken();
        return api(error.config);
      }
      return Promise.reject(error);
    }
  );

  return api;
};
