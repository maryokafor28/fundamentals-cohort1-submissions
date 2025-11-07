import express from "express";
import dotenv from "dotenv";

import morgan from "morgan";
import { errorHandler } from "./utils/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { securityMiddleware } from "./middlewares/security.js";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/v1/userRoutes.js";
import transactionRoutes from "./routes/v1/transactionRoutes.js";

dotenv.config();
const app = express();

const prisma = new PrismaClient();

app.use(morgan("dev"));
app.use(express.json());

securityMiddleware(app);
app.use("/api", apiLimiter);

const port = process.env.PORT;

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/transactions", transactionRoutes);

app.use("/", (req, res) => {
  res.status(200).json({ message: "FlowServe API v1 running..." });
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
