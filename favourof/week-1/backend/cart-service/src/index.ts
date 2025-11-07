import express, { Request, Response } from "express";
import { connectDB } from "./service/db";
import { config } from "./config/config";
import authRoute from "./routes/auth";
import cartRoutes from "./routes/cart";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Auth route
app.use("/auth", authRoute);

// cart Route
app.use("/cart", cartRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("cart service is running fine");
});

// Catch-all for any undefined route (any method, any path)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const startServer = async () => {
  await connectDB();
  app.listen(config.port, () =>
    console.log(`🚀 Server running on http://localhost:${config.port}"`)
  );
};

startServer();
