import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/devconnect",
  jwtSecret: process.env.JWT_SECRET || "a-very-secret-key"
};

export default config;
