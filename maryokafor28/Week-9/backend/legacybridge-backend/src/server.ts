import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./config/app.config";
import config from "./config/env.config";

let server: http.Server | null = null;

if (process.env.NODE_ENV !== "test") {
  server = http.createServer(app);

  server.listen(config.server.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.server.port}`);
    console.log(`📡 Environment: ${config.server.env}`);
  });

  process.on("SIGTERM", () => {
    console.log("⚠️ SIGTERM received, shutting down gracefully...");
    server?.close(() => {
      console.log("✅ Server closed");
      process.exit(0);
    });
  });
}

export default server;
