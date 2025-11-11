import dotenv from "dotenv";
dotenv.config();

interface Env {
  PORT: number | string;
  MONGO_URI: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
}

export const env: Env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "",
  NODE_ENV: process.env.NODE_ENV || "production",
  JWT_SECRET:
    process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d", // ✅ Must be string like "7d", "24h", "30m"
};
