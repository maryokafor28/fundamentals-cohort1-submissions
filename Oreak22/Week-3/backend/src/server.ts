import express from "express";
const cors = require("cors");
import dotenv from "dotenv";
const cookieParser = require("cookie-parser");
import authRoutes from "./routers/auth.Routes";
import taskRoutes from "./routers/task.routes";
import mongoose from "mongoose";
import helmet from "helmet";
dotenv.config();
const app = express();

const MONGO_URI = process.env.MONGO_URI || "";
mongoose.connect(MONGO_URI).then(() => {
  console.log("connected");
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
app.use("/api/task", taskRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
