import dotenv from "dotenv";
dotenv.config();

import type { Application } from "express";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cartRoutes from "./routes/cartroutes";
import authRoutes from "./routes/authroutes";

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app: Application = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error(err));
