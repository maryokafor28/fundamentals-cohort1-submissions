import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";

// Middlewares (will add actual files later)
import errorHandler from "./middlewares/errorHandler";
import requestLogger from "./middlewares/requestLogger";
import metricsMiddleware from "./middlewares/metricsMiddleware";
import metricsRoute from "./routes/metrics.route";
import healthRoute from "./routes/health.route";

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

app.use(express.json());

// Observability Middlewares
app.use(requestLogger); // logs each request (Winston/Pino)
app.use(metricsMiddleware); // tracks response time & counters;,
// // Routes
app.use("/api/health", healthRoute);

app.use("/api/metrics", metricsRoute);
// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handler (centralized)
app.use(errorHandler);

export default app;
