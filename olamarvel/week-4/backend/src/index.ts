import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import profilesRoute from "./routes/profile"
import commentRoutes from "./routes/comment"

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profilesRoute);
app.use("/api/projects", projectRoutes);
app.use("/api/comments", commentRoutes)

app.use(errorHandler);

export default app;

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  // DB connect
  connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
