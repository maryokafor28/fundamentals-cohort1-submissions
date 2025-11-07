import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 4001,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cart-service",
  jwtSecret: process.env.JWT_SECRET || "defaultsecret",
};
