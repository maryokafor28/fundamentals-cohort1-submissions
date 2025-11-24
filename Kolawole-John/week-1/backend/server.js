// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authroutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";



dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
