import express from "express";
import pinoHttp from "pino-http";
import helmet from "helmet";
import { logger } from "./utils/logger";
import healthRoutes from "./routes/health";
import client from "prom-client";
import cors from "cors";

export const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(
  pinoHttp({
    logger,
  })
);

app.use("/health", healthRoutes);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
