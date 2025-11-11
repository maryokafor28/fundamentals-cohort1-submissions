import { ENDPOINT } from "./api";
import { AuthData, LoginData } from "@/components/types/auth";

export const authService = {
  register: async (data: AuthData) => {
    const res = await fetch(ENDPOINT.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const raw = await res.text();
    console.log("Raw register response:", raw);

    if (!res.ok) {
      throw new Error(raw || `HTTP ${res.status}`);
    }

    try {
      return JSON.parse(raw);
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  },

  login: async (data: LoginData) => {
    const res = await fetch(ENDPOINT.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const raw = await res.text(); // grab raw text
    console.log("Raw login response:", raw);

    if (!res.ok) {
      throw new Error(raw || `HTTP ${res.status}`);
    }

    try {
      return JSON.parse(raw); // safely parse
    } catch {
      throw new Error("Invalid JSON response from server");
    }
  },
};
