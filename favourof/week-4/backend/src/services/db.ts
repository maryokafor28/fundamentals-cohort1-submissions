import mongoose from "mongoose";
import { config } from "../config/config";
import { errorLoggerInstance, requestLoggerInstance } from "../utils/loggers";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    requestLoggerInstance.info("🟢 MongoDB connected successfully");
  } catch (err) {
    errorLoggerInstance.error("🔴 MongoDB connection error", err);
  }
};
