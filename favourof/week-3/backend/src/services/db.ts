import mongoose from "mongoose";
import { errorLoggerInstance, requestLoggerInstance } from "../utils/logger";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/taskdb";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    requestLoggerInstance.info("🟢 MongoDB connected successfully");
  } catch (err) {
    errorLoggerInstance.error("🔴 MongoDB connection error", err);
    process.exit(1);
  }
};
