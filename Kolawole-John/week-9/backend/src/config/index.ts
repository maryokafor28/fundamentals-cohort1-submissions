import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  legacyApi: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  cache: {
    type: 'redis' | 'memory';
    redis?: {
      host: string;
      port: number;
      password?: string;
    };
    ttl: number; // Time to live in seconds
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  cors: {
    origin: string | string[];
  };
  circuitBreaker: {
    failureThreshold: number;
    resetTimeout: number;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  legacyApi: {
    // Using JSONPlaceholder as mock legacy API
    baseUrl: process.env.LEGACY_API_URL || 'https://jsonplaceholder.typicode.com',
    timeout: parseInt(process.env.LEGACY_API_TIMEOUT || '10000', 10),
    retryAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3', 10),
    retryDelay: parseInt(process.env.RETRY_DELAY || '1000', 10),
  },
  
  cache: {
    type: (process.env.CACHE_TYPE as 'redis' | 'memory') || 'memory',
    redis: process.env.REDIS_URL ? {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
    } : undefined,
    ttl: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes default
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10), // 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
      : '*',
  },
  
  circuitBreaker: {
    failureThreshold: parseInt(process.env.CIRCUIT_BREAKER_THRESHOLD || '5', 10),
    resetTimeout: parseInt(process.env.CIRCUIT_BREAKER_RESET || '60000', 10),
  },
};

export default config;