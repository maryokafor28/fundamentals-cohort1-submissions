import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import config from "./config";
import authRoutes from "./routes/authRoutes";
import mainRoutes from "./routes/mainRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", mainRoutes);

const PORT = config.port || 5000;

mongoose
  .connect(config.mongoUri, {})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
