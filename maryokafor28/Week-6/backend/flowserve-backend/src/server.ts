import app from "./app";
import { ENV } from "./config/env";
import pool from "./config/db"; // ✅ import DB connection

// ✅ Connect to Supabase PostgreSQL
pool
  .connect()
  .then(() => {
    console.log("✅ Connected to Supabase PostgreSQL");

    // ✅ Start server ONLY after DB connects
    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server running on port ${ENV.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1); // stop app if DB fails
  });
