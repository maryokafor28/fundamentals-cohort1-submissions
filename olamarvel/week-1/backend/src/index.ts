import express, { Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import cartRoutes from "./routes/cartRoutes";
import productRoutes from "./routes/productRoutes";
app.use("/api/cart", cartRoutes);
app.use("/api/products",productRoutes)

export default app;
if (process.env.NODE_ENV !== "test"){


// DB connect
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
}
