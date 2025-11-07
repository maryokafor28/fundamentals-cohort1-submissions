import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors"; 
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { apiRateLimiter } from "./middlewares/rateLimiter";
import { requestLogger } from "./middlewares/requestLogger";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(morgan("dev")); 
app.use(apiRateLimiter);


app.get("/", (_, res) =>
  res.json({ status: "ok", service: "flowserve-backend" })
);
app.use("/api/v1", routes);
app.use(errorHandler);

export default app;
