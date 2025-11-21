import { z } from "zod";

const envSchema = z.object({
  // ===================================
  // APPLICATION CONFIGURATION
  // ===================================
  PORT: z.coerce.number().default(4000),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // ===================================
  // LEGACY API CONFIGURATION
  // ===================================
  LEGACY_API_BASE_URL: z.string().url().default("http://localhost:4000"),

  LEGACY_API_KEY: z.string().default(""),

  LEGACY_API_TIMEOUT: z.coerce.number().default(5000),

  // ===================================
  // CACHE CONFIGURATION
  // ===================================
  CACHE_TTL: z.coerce.number().default(300),
  CACHE_ENABLED: z.coerce.boolean().default(true),
  CACHE_MAX_SIZE: z.coerce.number().default(100),

  // ===================================
  // LOGGING
  // ===================================
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // ===================================
  // RATE LIMITING
  // ===================================
  API_RATE_LIMIT_WINDOW: z.coerce.number().default(15),
  API_RATE_LIMIT_MAX: z.coerce.number().default(100),

  // ===================================
  // CORS
  // ===================================
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:5173")
    .transform((val) => val.split(",")),

  // ===================================
  // API VERSIONING
  // ===================================
  API_VERSION_PREFIX: z.string().default("/api"),
  DEFAULT_API_VERSION: z.string().default("v2"),

  // ===================================
  // RETRY CONFIGURATION
  // ===================================
  MAX_RETRY_ATTEMPTS: z.coerce.number().default(3),
  RETRY_DELAY: z.coerce.number().default(1000),
});

// Parse
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;

// Helpers
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
export const isCacheEnabled = env.CACHE_ENABLED;

// Computed config
export const config = {
  server: {
    port: env.PORT,
    env: env.NODE_ENV,
  },
  legacy: {
    baseUrl: env.LEGACY_API_BASE_URL,
    apiKey: env.LEGACY_API_KEY,
    timeout: env.LEGACY_API_TIMEOUT,
  },
  cache: {
    enabled: env.CACHE_ENABLED,
    ttl: env.CACHE_TTL,
    maxSize: env.CACHE_MAX_SIZE,
  },
  logging: {
    level: env.LOG_LEVEL,
  },
  rateLimit: {
    windowMs: env.API_RATE_LIMIT_WINDOW * 60 * 1000,
    max: env.API_RATE_LIMIT_MAX,
  },
  cors: {
    origins: env.CORS_ORIGINS,
  },
  api: {
    versionPrefix: env.API_VERSION_PREFIX,
    defaultVersion: env.DEFAULT_API_VERSION,
  },
  retry: {
    maxAttempts: env.MAX_RETRY_ATTEMPTS,
    delay: env.RETRY_DELAY,
  },
} as const;

export default config;
