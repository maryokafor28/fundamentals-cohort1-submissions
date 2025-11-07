import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/config";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/request.logger";
import { connectDB } from "./services/db";
import authRouter from "./routes/auth";
import userRoute from "./routes/user";
import projectRoute from "./routes/project";
import commentRoutes from "./routes/comment";
import cookieParser from "cookie-parser";
import AppError from "./utils/AppError";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://dev-connect-frontend-two.vercel.app",
    ],
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(requestLogger);

app.use("/api/auth", authRouter);
app.use("/api/profile", userRoute);
app.use("/api/project", projectRoute);
app.use("/api/comment", commentRoutes);

app.get("/", (_, res) => {
  res.send({ massage: "server is running fine" });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const port = config.port;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`app is running on port:http://${config.nodeEnv}:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};
startServer();
