import axios from "axios";

/**
 * axios instance:
 * - sends cookies (refresh token stored as HttpOnly cookie)
 * - we attach access token in Authorization header from memory (AuthContext)
 */
const api = axios.create({
  baseURL: "/api", // proxied in dev to backend
  withCredentials: true // allow sending cookies (refresh token)
});

export default api;
