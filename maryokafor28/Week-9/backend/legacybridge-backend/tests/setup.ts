// tests/setup.ts
// Test environment setup - set required env vars BEFORE tests run
// This file runs before the test framework is initialized

// Application Configuration
process.env.NODE_ENV = process.env.NODE_ENV || "test";
process.env.PORT = process.env.PORT || "4000";

// Legacy API Configuration
process.env.LEGACY_API_BASE_URL =
  process.env.LEGACY_API_BASE_URL || "http://localhost:4000";
process.env.LEGACY_API_KEY = process.env.LEGACY_API_KEY || "";
process.env.LEGACY_API_TIMEOUT = process.env.LEGACY_API_TIMEOUT || "5000";

// Cache Configuration
process.env.CACHE_TTL = process.env.CACHE_TTL || "300";
process.env.CACHE_ENABLED = process.env.CACHE_ENABLED || "true";
process.env.CACHE_MAX_SIZE = process.env.CACHE_MAX_SIZE || "100";

// Logging
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error";

// Security & Rate Limiting
process.env.API_RATE_LIMIT_WINDOW = process.env.API_RATE_LIMIT_WINDOW || "15";
process.env.API_RATE_LIMIT_MAX = process.env.API_RATE_LIMIT_MAX || "100";

// CORS Configuration
process.env.CORS_ORIGINS = process.env.CORS_ORIGINS || "http://localhost:5173";

// API Versioning
process.env.API_VERSION_PREFIX = process.env.API_VERSION_PREFIX || "/api";
process.env.DEFAULT_API_VERSION = process.env.DEFAULT_API_VERSION || "v2";

// Retry Configuration
process.env.MAX_RETRY_ATTEMPTS = process.env.MAX_RETRY_ATTEMPTS || "3";
process.env.RETRY_DELAY = process.env.RETRY_DELAY || "1000";
