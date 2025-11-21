import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import config, { isDevelopment } from "./env.config";

// Middleware
import { requestLogger } from "../middlewares/logger.middleware";
import { errorHandler } from "../middlewares/error.middleware";

// Routes
import v1Routes from "../routes/v1";
import v2Routes from "../routes/v2";

const app = express();

// ======================================
// GLOBAL MIDDLEWARE
// ======================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.cors.origins,
    credentials: true,
  })
);

// Logging
if (isDevelopment) {
  app.use(morgan("dev"));
}
app.use(requestLogger);

// ======================================
// HEALTH CHECK
// ======================================
app.get(`${config.api.versionPrefix}/health`, (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ======================================
// VERSIONED API ROUTES
// ======================================
app.use(`${config.api.versionPrefix}/v1`, v1Routes);
app.use(`${config.api.versionPrefix}/v2`, v2Routes);
app.get("/", (_req, res) => {
  res.json({
    message: "LegacyBridge API is running 🚀",
    versions: ["v1", "v2"],
    health: `${config.api.versionPrefix}/health`,
  });
});

// ======================================
// GLOBAL ERROR HANDLER (Must be last)
// ======================================
app.use(errorHandler);

export default app;
