import { createClient, RedisClientType } from 'redis';
import config from '../config';
import logger from '../config/logger';
import { CacheOptions, CacheError } from '../types';

/**
 * Multi-layer Cache Service
 * 
 * Supports:
 * - In-memory caching (fast, non-persistent)
 * - Redis caching (persistent, scalable)
 * 
 * Strategy: Try in-memory first, fall back to Redis, fall back to no cache
 */
class CacheService {
  private memoryCache: Map<string, { value: any; expiry: number }>;
  private redisClient: RedisClientType | null;
  private isRedisConnected: boolean = false;

  constructor() {
    this.memoryCache = new Map();
    this.redisClient = null;
    this.initializeRedis();
  }

  /**
   * Initialize Redis client if configured
   */
  private async initializeRedis(): Promise<void> {
    if (config.cache.type !== 'redis' || !config.cache.redis) {
      logger.info('Cache: Using in-memory cache only');
      return;
    }

    try {
      this.redisClient = createClient({
        socket: {
          host: config.cache.redis.host,
          port: config.cache.redis.port,
        },
        password: config.cache.redis.password,
      });

      this.redisClient.on('error', (err) => {
        logger.error('Redis connection error:', err);
        this.isRedisConnected = false;
      });

      this.redisClient.on('connect', () => {
        logger.info('Redis connected successfully');
        this.isRedisConnected = true;
      });

      await this.redisClient.connect();
    } catch (error) {
      logger.error('Failed to initialize Redis, falling back to memory cache', error);
      this.redisClient = null;
    }
  }

  /**
   * Get value from cache (checks memory first, then Redis)
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const prefixedKey = this.getPrefixedKey(key, options.prefix);

    try {
      // Try in-memory cache first (L1)
      const memoryResult = this.getFromMemory<T>(prefixedKey);
      if (memoryResult !== null) {
        logger.debug(`Cache HIT (memory): ${prefixedKey}`);
        return memoryResult;
      }

      // Try Redis cache (L2)
      if (this.isRedisConnected && this.redisClient) {
        const redisResult = await this.getFromRedis<T>(prefixedKey);
        if (redisResult !== null) {
          logger.debug(`Cache HIT (redis): ${prefixedKey}`);
          // Populate memory cache with Redis data
          this.setInMemory(prefixedKey, redisResult, options.ttl || config.cache.ttl);
          return redisResult;
        }
      }

      logger.debug(`Cache MISS: ${prefixedKey}`);
      return null;
    } catch (error) {
      logger.error('Cache get error', { key: prefixedKey, error });
      return null; // Fail gracefully
    }
  }

  /**
   * Set value in cache (both memory and Redis if available)
   */
  async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key, options.prefix);
    const ttl = options.ttl || config.cache.ttl;

    try {
      // Set in memory cache
      this.setInMemory(prefixedKey, value, ttl);

      // Set in Redis cache if available
      if (this.isRedisConnected && this.redisClient) {
        await this.setInRedis(prefixedKey, value, ttl);
      }

      logger.debug(`Cache SET: ${prefixedKey}, TTL: ${ttl}s`);
    } catch (error) {
      logger.error('Cache set error', { key: prefixedKey, error });
      throw new CacheError('Failed to set cache', 'set');
    }
  }

  /**
   * Delete specific key from cache
   */
  async delete(key: string, options: CacheOptions = {}): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key, options.prefix);

    try {
      this.memoryCache.delete(prefixedKey);

      if (this.isRedisConnected && this.redisClient) {
        await this.redisClient.del(prefixedKey);
      }

      logger.debug(`Cache DELETE: ${prefixedKey}`);
    } catch (error) {
      logger.error('Cache delete error', { key: prefixedKey, error });
    }
  }

  /**
   * Clear all cache entries with a specific prefix
   */
  async clearPrefix(prefix: string): Promise<void> {
    try {
      // Clear memory cache
      for (const key of this.memoryCache.keys()) {
        if (key.startsWith(prefix)) {
          this.memoryCache.delete(key);
        }
      }

      // Clear Redis cache
      if (this.isRedisConnected && this.redisClient) {
        const keys = await this.redisClient.keys(`${prefix}*`);
        if (keys.length > 0) {
          await this.redisClient.del(keys);
        }
      }

      logger.info(`Cache cleared for prefix: ${prefix}`);
    } catch (error) {
      logger.error('Cache clear error', { prefix, error });
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    try {
      this.memoryCache.clear();

      if (this.isRedisConnected && this.redisClient) {
        await this.redisClient.flushAll();
      }

      logger.info('Cache completely cleared');
    } catch (error) {
      logger.error('Cache clear all error', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    memorySize: number;
    redisConnected: boolean;
  } {
    return {
      memorySize: this.memoryCache.size,
      redisConnected: this.isRedisConnected,
    };
  }

  // ============ Private Helper Methods ============

  private getFromMemory<T>(key: string): T | null {
    const cached = this.memoryCache.get(key);

    if (!cached) return null;

    // Check if expired
    if (Date.now() > cached.expiry) {
      this.memoryCache.delete(key);
      return null;
    }

    return cached.value as T;
  }

  private setInMemory<T>(key: string, value: T, ttl: number): void {
    const expiry = Date.now() + ttl * 1000;
    this.memoryCache.set(key, { value, expiry });
  }

  private async getFromRedis<T>(key: string): Promise<T | null> {
    if (!this.redisClient) return null;

    try {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis get error', { key, error });
      return null;
    }
  }

  private async setInRedis<T>(key: string, value: T, ttl: number): Promise<void> {
    if (!this.redisClient) return;

    try {
      await this.redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      logger.error('Redis set error', { key, error });
    }
  }

  private getPrefixedKey(key: string, prefix?: string): string {
    return prefix ? `${prefix}:${key}` : key;
  }

  /**
   * Clean up expired entries from memory cache
   */
  startCleanupInterval(intervalMs: number = 60000): void {
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;

      for (const [key, cached] of this.memoryCache.entries()) {
        if (now > cached.expiry) {
          this.memoryCache.delete(key);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        logger.debug(`Memory cache cleanup: removed ${cleaned} expired entries`);
      }
    }, intervalMs);
  }

  /**
   * Graceful shutdown
   */
  async disconnect(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.disconnect();
      logger.info('Redis disconnected');
    }
  }
}

// Export singleton instance
export const cacheService = new CacheService();