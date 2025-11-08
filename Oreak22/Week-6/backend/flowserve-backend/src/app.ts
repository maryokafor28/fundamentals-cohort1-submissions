import express from "express";
import helmet from "helmet";
const cors = require("cors");
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import "express-async-errors";

import { logger } from "./config/logger";
import usersRouter from "./routes/users";
import transactionsRouter from "./routes/transactions";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const max = Number(process.env.RATE_LIMIT_MAX || 100);

app.use(
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
  })
);


app.use("/api/users", usersRouter);
app.use("/api/transactions", transactionsRouter);

app.use(errorHandler);

export default app;
