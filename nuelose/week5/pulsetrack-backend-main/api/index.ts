import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../src/config/db.js";
import apiRoutes from "../src/routes/index.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/api", apiRoutes);
await connectDB();
export default app;
