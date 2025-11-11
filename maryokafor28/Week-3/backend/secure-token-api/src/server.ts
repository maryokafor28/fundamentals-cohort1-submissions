import dotenv from "dotenv";
dotenv.config();
console.log(
  "🔍 Loaded MONGO_URI:",
  process.env.MONGO_URI ? "✅ Found" : "❌ Not Found"
);
console.log("🔍 Loaded PORT:", process.env.PORT || "❌ Not Found");

import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";

import authRoutes from "./routes/authRoutes";
import tokenRoutes from "./routes/tokenRoutes";
import taskRoutes from "./routes/taskRoutes";

const app = express();
const PORT = process.env.PORT || 4000;

// Helmet Security Middleware
if (process.env.NODE_ENV === "production") {
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "default-src": ["'self'"],
          "script-src": ["'self'"],
          "object-src": ["'none'"],
          "img-src": ["'self'", "data:"],
          "upgrade-insecure-requests": [],
        },
      },
      referrerPolicy: { policy: "no-referrer" },
      crossOriginEmbedderPolicy: true,
    })
  );
  console.log("🛡️ Helmet security enabled (production mode)");
} else {
  app.use(helmet());
  console.log("🛡️ Helmet basic protection enabled (development mode)");
}

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000", // for local dev
      "https://secure-token-ui.vercel.app", // replace with your live frontend
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);
app.use("/api/tasks", taskRoutes);

// Connect to MongoDB, then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
  });
});
