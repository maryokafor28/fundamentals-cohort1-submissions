import mongoose from "mongoose";
import { env } from "./env"; // <-- Import centralized env

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.mongoUri);
    console.log(` MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    process.exit(1);
  }
};
