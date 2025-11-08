import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoose from "mongoose";
import authRoutes from "./routers/auth.Routes.js";
import projectRoutes from "./routers/project.routes.js";
dotenv.config();
const app = express();

const MONGO_URI = process.env.MONGO_URI || "";
mongoose.connect(MONGO_URI, { dbName: "Devconnect" }).then(() => {
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
app.use("/api/project", projectRoutes);

// app.listen(process.env.PORT, () =>
//   console.log(`Server running on port ${process.env.PORT}`)
// );

export default app;
