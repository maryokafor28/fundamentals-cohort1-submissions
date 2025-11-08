import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import get_product from "./routers/get_product.router";
import add_to_product from "./routers/add_to_product.router";

dotenv.config();
const mongodb_url = process.env.MONGO_URI || "";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/admin", add_to_product);
app.use("/api", get_product);

mongoose
  .connect(mongodb_url)
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// import { addToProduct, getProduct } from "../controllers/add_to_product";
