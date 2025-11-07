import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import doctorRoutes from "./routes/doctorRoute";
import activityRoutes from "./routes/activityRoutes";
import mealRoutes from "./routes/mealRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import reportRoutes from "./routes/reportRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);

export default app;
