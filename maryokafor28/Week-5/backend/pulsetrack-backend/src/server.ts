import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import userRoutes from "./routes/userRoutes";
import activityRoutes from "./routes/activityRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import authRoutes from "./routes/authRoutes";

const app: Application = express();

//  Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL?.split(",") || [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://pulsetrack-frontend-drab.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

//  Routes
app.get("/", (req: Request, res: Response) => {
  res.send("PulseTrack API is running ✅");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
//  Database Connection
connectDB();

//  Start Server
app.listen(env.PORT, () => {
  console.log(` Server running on port ${env.PORT}`);
});
