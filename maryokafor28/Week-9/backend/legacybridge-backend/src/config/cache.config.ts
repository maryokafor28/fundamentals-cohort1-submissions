import { env } from "./env.config";

export interface CacheConfig {
  enabled: boolean;
  ttl: number; // seconds
  maxSize: number; // max number of items in cache
  type: "memory"; // locked to memory-only
}

export const cacheConfig: CacheConfig = {
  enabled: env.CACHE_ENABLED,
  ttl: env.CACHE_TTL,
  maxSize: env.CACHE_MAX_SIZE, // ✅ Add this
  type: "memory",
};

export default cacheConfig;
