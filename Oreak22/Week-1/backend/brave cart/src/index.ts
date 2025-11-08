import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cartRouter from "./routers/add_cart.router";
import getCartRouter from "./routers/get_cart";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "";

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/cart", cartRouter);
app.use("/api/cart", getCartRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
