import express, { Request, Response } from "express";
import mongoose from "mongoose";
const cors = require("cors");
import dotenv from "dotenv";
const cookieParser = require("cookie-parser");
import helmet from "helmet";
import authRoutes from "./routers/auth.Routes";
import doctorRoutes from "./routers/doctor.Routes";
import patientRoutes from "./routers/patient.Routes";
import appointmentRoutes from "./routers/appointment.Routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI || "";
mongoose.connect(MONGO_URI).then(() => {
  console.log("connected");
});
app.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(helmet());

app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointment", appointmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
