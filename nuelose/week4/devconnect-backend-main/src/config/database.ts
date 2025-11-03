import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("Missing MONGO_URI in environment variables");
    }

    if (isConnected) {
      console.log("Reusing existing MongoDB connection");
      return;
    }

    const conn = await mongoose.connect(MONGO_URI, {
     
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export const DisconnectDB = async (): Promise<void> => {
  try {
    if (isConnected) {

      await mongoose.connection.close();
      isConnected = false;
      console.log("MongoDB disconnected");
    }
  } catch (error) {
    console.error("Error Disconnecting DB: ", error);
  }
};
