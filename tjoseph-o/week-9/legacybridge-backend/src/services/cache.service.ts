import { createClient, RedisClientType } from 'redis';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface CacheService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

// In-Memory Cache Implementation
class InMemoryCache implements CacheService {
  private cache: Map<string, { value: string; expiry: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    logger.debug(`Cache HIT (in-memory): ${key}`);
    return item.value;
  }

  async set(key: string, value: string, ttl: number = config.cache.ttl): Promise<void> {
    const expiry = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiry });
    logger.debug(`Cache SET (in-memory): ${key}, TTL: ${ttl}s`);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    logger.debug(`Cache DELETE (in-memory): ${key}`);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    logger.debug('Cache CLEARED (in-memory)');
  }

  // Cleanup expired entries periodically
  startCleanup(intervalMs: number = 60000): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiry) {
          this.cache.delete(key);
        }
      }
    }, intervalMs);
  }
}

// Redis Cache Implementation
class RedisCache implements CacheService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password,
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      logger.info('Redis connected successfully');
      this.isConnected = true;
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis', error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      if (value) {
        logger.debug(`Cache HIT (Redis): ${key}`);
      }
      return value;
    } catch (error) {
      logger.error(`Cache GET error: ${key}`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttl: number = config.cache.ttl): Promise<void> {
    try {
      await this.client.setEx(key, ttl, value);
      logger.debug(`Cache SET (Redis): ${key}, TTL: ${ttl}s`);
    } catch (error) {
      logger.error(`Cache SET error: ${key}`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
      logger.debug(`Cache DELETE (Redis): ${key}`);
    } catch (error) {
      logger.error(`Cache DELETE error: ${key}`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.flushDb();
      logger.debug('Cache CLEARED (Redis)');
    } catch (error) {
      logger.error('Cache CLEAR error', error);
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
    }
  }
}

// Cache Factory
class CacheFactory {
  private static instance: CacheService;

  static async createCache(): Promise<CacheService> {
    if (this.instance) {
      return this.instance;
    }

    // Try Redis first, fall back to in-memory
    try {
      const redisCache = new RedisCache();
      await redisCache.connect();
      this.instance = redisCache;
      logger.info('Using Redis cache');
    } catch (error) {
      logger.warn('Redis not available, using in-memory cache');
      const memoryCache = new InMemoryCache();
      memoryCache.startCleanup();
      this.instance = memoryCache;
    }

    return this.instance;
  }

  static getInstance(): CacheService {
    if (!this.instance) {
      throw new Error('Cache not initialized. Call createCache() first.');
    }
    return this.instance;
  }
}

export { CacheFactory, InMemoryCache, RedisCache };