import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cartRoutes from "./routes/cartRoutes";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from Vite frontend
    methods: ["GET", "POST"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  })
);

app.use(express.json());
app.use(cartRoutes);

app.listen(PORT, () => console.log(`Server running on port${PORT}`));
connectDB();

app.use("/api/cart", cartRoutes);
