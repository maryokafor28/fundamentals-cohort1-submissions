import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_PORT,
  withCredentials: true,
});

let accessToken: string | null = null;
let isRefreshing = false;

axiosClient.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_SERVER_PORT}/auth/refresh`,
            {},
            { withCredentials: true }
          );

          accessToken = data.accessToken;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          isRefreshing = false;

          return axiosClient(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          accessToken = null;
          console.warn("Refresh failed — redirecting to login.");
          window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

////////////////////////
export const refreshTokenRequest = async () => {
  console.log("hey");
  const res = await axiosClient.post("/auth/refresh", {});
  return res.data; //
};

//////////////////////

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export default axiosClient;
