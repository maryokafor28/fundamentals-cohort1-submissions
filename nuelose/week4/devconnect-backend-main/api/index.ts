import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../src/config/database.js";
import authRoute from "../src/routes/authRoute.js";
import userRoute from "../src/routes/userRoute.js";
import projectRoute from "../src/routes/projectRoute.js";
import commentRoute from "../src/routes/commentRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://devconnect-frontend-theta.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/projects", projectRoute);
app.use("/api/comments", commentRoute);
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

await connectDB();
export default app;
