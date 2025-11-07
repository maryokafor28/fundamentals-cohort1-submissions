import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { CART_SERVICE_URL, FAKESTORE_API_URL, PORT } from "./config";

const app = express();

app.use(helmet()); // Secure HTTP headers

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 🔹 Products Proxy (FakeStore API)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, please try again later",
});
app.use(limiter);
app.use(morgan("dev"));

app.use(
  "/api/products",
  proxy(`${FAKESTORE_API_URL}`, {
    proxyReqPathResolver: (req) => {
      // Keep dynamic paths like /api/products/5
      const newPath = req.url; // includes `/` and any id
      return `/products${newPath}`;
    },
  })
);

//  Auth Proxy

app.use(
  "/api/auth",
  proxy(`${CART_SERVICE_URL}`, {
    proxyReqPathResolver: (req) => `/auth${req.url}`, // forwards to /auth/*
  })
);

//  Cart Proxy

app.use(
  "/api/cart",
  proxy(`${CART_SERVICE_URL}`, {
    proxyReqPathResolver: (req) => `/cart${req.url}`, // forwards to /cart/*
  })
);

// Catch-all for any undefined route (any method, any path)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Root route
app.get("/", (req, res) => {
  res.send("🚀 API Gateway is running");
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
});
