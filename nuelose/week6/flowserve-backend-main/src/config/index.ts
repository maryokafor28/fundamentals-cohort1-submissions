import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT ? Number(process.env.PORT) : 3001,
  databaseUrl: process.env.DATABASE_URL || "",
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS
    ? Number(process.env.RATE_LIMIT_WINDOW_MS)
    : 60000,
  rateLimitMax: process.env.RATE_LIMIT_MAX
    ? Number(process.env.RATE_LIMIT_MAX)
    : 100,
  nodeEnv: process.env.NODE_ENV || "development",
};
