import cacheConfig from "../config/cache.config";

// In-memory store
const memoryCache = new Map<string, { value: unknown; expiresAt: number }>();

/**
 * Generate unique cache key with namespace.
 * @example generateCacheKey("payments", "123") // "payments:123"
 */
export const generateCacheKey = (namespace: string, key: string): string => {
  return `${namespace}:${key}`;
};

/**
 * Enforce max cache size by removing oldest entries.
 */
const enforceMaxSize = (): void => {
  if (memoryCache.size >= cacheConfig.maxSize) {
    // Remove oldest entry (first item in Map)
    const firstKey = memoryCache.keys().next().value;
    if (firstKey) {
      memoryCache.delete(firstKey);
    }
  }
};

/**
 * Set a value in the cache with TTL.
 * @param key - Cache key
 * @param value - Value to cache
 */
export const setCache = <T>(key: string, value: T): void => {
  if (!cacheConfig.enabled) return;

  // Enforce max size before adding
  enforceMaxSize();

  const expiresAt = Date.now() + cacheConfig.ttl * 1000;
  memoryCache.set(key, {
    value,
    expiresAt,
  });
};

/**
 * Get a value from the cache.
 * Returns null if expired or not found.
 * @param key - Cache key
 */
export const getCache = <T>(key: string): T | null => {
  if (!cacheConfig.enabled) return null;

  const cached = memoryCache.get(key);
  if (!cached) return null;

  // Check expiration
  if (Date.now() > cached.expiresAt) {
    memoryCache.delete(key);
    return null;
  }

  return cached.value as T;
};

/**
 * Delete a specific cache key.
 * @param key - Cache key to delete
 */
export const deleteCache = (key: string): void => {
  memoryCache.delete(key);
};

/**
 * Clear entire cache.
 * Useful for testing or admin operations.
 */
export const clearCache = (): void => {
  memoryCache.clear();
};

/**
 * Get cache statistics.
 */
export const getCacheStats = () => {
  return {
    size: memoryCache.size,
    maxSize: cacheConfig.maxSize,
    enabled: cacheConfig.enabled,
    ttl: cacheConfig.ttl,
  };
};

/**
 * Clean up expired entries (run periodically).
 */
export const cleanupExpiredCache = (): number => {
  let deletedCount = 0;
  const now = Date.now();

  for (const [key, entry] of memoryCache.entries()) {
    if (now > entry.expiresAt) {
      memoryCache.delete(key);
      deletedCount++;
    }
  }

  return deletedCount;
};

// Auto-cleanup every 5 minutes
if (cacheConfig.enabled && process.env.NODE_ENV !== "test") {
  setInterval(() => {
    const deleted = cleanupExpiredCache();
    if (deleted > 0) {
      console.log(`🧹 Cache cleanup: removed ${deleted} expired entries`);
    }
  }, 5 * 60 * 1000).unref();
}
