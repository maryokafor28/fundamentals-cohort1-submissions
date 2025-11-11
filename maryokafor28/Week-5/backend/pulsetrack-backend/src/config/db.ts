import mongoose from "mongoose";
import { env } from "../config/env";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection failed:", (error as Error).message);
    process.exit(1);
  }
};
