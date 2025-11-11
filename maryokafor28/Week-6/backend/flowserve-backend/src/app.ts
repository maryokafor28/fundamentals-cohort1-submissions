import express from "express";
import cors from "cors";
import { apiLimiter } from "./middlewares/rateLimiter";
import { requestLogger } from "./middlewares/requestLogger";
import userRoutes from "./routes/userRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Basic middleware (CORS and JSON parsing)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local dev (Vite)
      "https://flowserve-frontend-three.vercel.app", 
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// Log all incoming requests
app.use(requestLogger);

// Rate limiting (BEFORE routes)
if (process.env.NODE_ENV === "production") {
  app.use("/api", apiLimiter);
}

// Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// Basic health route (outside rate limiting)
app.get("/", (_, res) => res.json({ message: "FlowServe API running 🚀" }));

// Error handler (MUST be last)
app.use(errorHandler);

export default app;
