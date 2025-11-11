import { api } from "./config";
import { AxiosError } from "axios";

interface RefreshTokenResponse {
  accessToken: string;
  user?: {
    id: string;
    email: string;
    role: "user" | "admin";
  };
}

interface LogoutResponse {
  message: string;
}

// Refresh access token using cookie (HttpOnly refresh token)
export const refreshAccessToken = async (): Promise<RefreshTokenResponse> => {
  try {
    const res = await api.post<RefreshTokenResponse>(
      "/token/refresh",
      {},
      { withCredentials: true }
    );
    console.log("✅ Token refresh successful:", res.data);
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    console.error(
      "❌ Token refresh failed:",
      axiosError.response?.data || axiosError.message
    );
    throw error; // Re-throw for AuthProvider to handle
  }
};

// Logout user (invalidate refresh token in cookie)
export const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    const res = await api.post<LogoutResponse>(
      "/token/logout",
      {},
      { withCredentials: true }
    );
    console.log("✅ Logout API successful:", res.data);
    return res.data;
  } catch (error) {
    // ✅ FIXED: Don't throw error on logout failure
    // Log it but return success so frontend can clean up
    const axiosError = error as AxiosError<{ message: string }>;
    console.warn(
      "⚠️ Logout API failed (but will proceed with local cleanup):",
      axiosError.response?.data || axiosError.message
    );

    // Return a success-like response so the flow continues
    return { message: "Logged out locally" };
  }
};
