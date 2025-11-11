// lib/api.ts
import { RequestOptions } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("❌ NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
}

// 🔄 Helper: Refresh the access token
async function refreshAccessToken(): Promise<void> {
  try {
    console.log("🔁 Attempting token refresh...");
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // ✅ includes cookies
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Refresh failed with:", errorText);
      throw new Error("Failed to refresh token");
    }

    console.log("🔑 Access token refreshed successfully");
    // ✅ Tokens are already set as cookies — nothing else to store
  } catch (err) {
    console.error("❌ Token refresh failed:", err);
    throw new Error("Session expired — please log in again");
  }
}

// 🌐 Main API fetch function
export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  // 🧠 Dev logging
  if (process.env.NODE_ENV === "development") {
    console.log("➡️ Fetching:", url);
    if (options.method) console.log("🧾 Method:", options.method);
  }

  // 🔹 Actual fetch request helper
  const makeRequest = async (): Promise<{ res: Response; data: unknown }> => {
    const res = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include", // ✅ Important for sending cookies
    });

    let data: unknown = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    return { res, data };
  };

  // 🧩 Initial request
  let { res, data } = await makeRequest();

  // 🔁 Handle expired token once
  if (res.status === 401 && !endpoint.includes("/auth/refresh")) {
    console.warn("⚠️ Access token expired. Attempting refresh...");
    try {
      await refreshAccessToken();
      ({ res, data } = await makeRequest()); // retry
    } catch (err) {
      console.error("❌ Token refresh failed. User must re-login.");

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        // ✅ Prevent redirect loops while already on login/signup
        if (!["/login", "/signup"].includes(currentPath)) {
          console.warn("🔁 Redirecting to login...");
          window.location.href = "/login";
        } else {
          console.warn("🚫 Already on auth page, skipping redirect.");
        }
      }

      throw err;
    }
  }

  // 🧩 Final error check
  if (!res.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? (data as Record<string, unknown>)["message"]
        : undefined;
    const errorMessage =
      typeof message === "string" && message.length > 0
        ? message
        : `API Error: ${res.status}`;
    throw new Error(errorMessage);
  }

  // ✅ Return typed JSON response
  return data as T;
}
