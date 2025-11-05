import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./Routes/auth";
import transactionRoutes from "./Routes/transactions";
import { errorHandler } from "./Middlewares/error";
import cookieParser from "cookie-parser";
import logger from "./util/logger";
import pinoHttp from "pino-http";

export const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://pluse-track-frontend.vercel.app",
];


app.use(pinoHttp({ logger }));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

// Mount the routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes); 

app.get("/", (req, res) => {
  res.send("FlowServe API is running!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`); // Use logger instead of console.log
});
