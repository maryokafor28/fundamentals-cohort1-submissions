import { api } from "./config";
import { refreshAccessToken } from "@/api/tokenApi";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and not retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/token/refresh")
    ) {
      originalRequest._retry = true;

      // Prevent multiple refresh calls at once
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { accessToken } = await refreshAccessToken(); // ✅ your backend refresh route
          isRefreshing = false;
          onRefreshed(accessToken);
        } catch (refreshError) {
          isRefreshing = false;
          console.error("🔒 Refresh token failed:", refreshError);
          window.location.href = "/login"; // Redirect to login
          return Promise.reject(refreshError);
        }
      }

      // Wait for token refresh to finish before retrying
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
