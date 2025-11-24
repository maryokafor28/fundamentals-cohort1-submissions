import { Router } from 'express';
import { legacyApiService } from '../services/legacyApiServices';
import { cacheService } from '../services/cacheServices';
import { legacyApiCircuitBreaker } from '../utils/circuitBreaker';
import { ApiResponseUtil } from '../utils/apiResponse';
import { asyncHandler } from '../middleware/errorHandler';
import { HealthCheck, ServiceHealth } from '../types';
import logger from '../config/logger';

const router = Router();

// Store server start time for uptime calculation
const serverStartTime = Date.now();

/**
 * GET /health
 * 
 * Comprehensive health check endpoint
 * Returns status of all critical services
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    logger.debug('Health check requested');

    const healthCheck: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        legacyApi: await checkLegacyApiHealth(),
        cache: checkCacheHealth(),
      },
      uptime: Math.floor((Date.now() - serverStartTime) / 1000), // seconds
    };

    // Determine overall status
    const serviceStatuses = Object.values(healthCheck.services).map(s => s.status);
    
    if (serviceStatuses.some(status => status === 'down')) {
      healthCheck.status = 'unhealthy';
    } else if (serviceStatuses.some(status => status === 'degraded')) {
      healthCheck.status = 'degraded';
    }

    // Return appropriate status code
    const statusCode = healthCheck.status === 'healthy' ? 200 
      : healthCheck.status === 'degraded' ? 200 
      : 503;

    ApiResponseUtil.success(res, healthCheck, statusCode);
  })
);

/**
 * GET /health/live
 * 
 * Kubernetes liveness probe
 * Simple check that the service is running
 */
router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

/**
 * GET /health/ready
 * 
 * Kubernetes readiness probe
 * Checks if service is ready to accept traffic
 */
router.get(
  '/ready',
  asyncHandler(async (req, res) => {
    const legacyApiHealth = await checkLegacyApiHealth();

    if (legacyApiHealth.status === 'down') {
      res.status(503).json({
        status: 'not ready',
        reason: 'Legacy API unavailable',
      });
      return;
    }

    res.status(200).json({ status: 'ready' });
  })
);

/**
 * GET /health/circuit-breaker
 * 
 * Check circuit breaker status
 */
router.get('/circuit-breaker', (req, res) => {
  const status = legacyApiCircuitBreaker.getStatus();

  res.json({
    circuitBreaker: {
      state: status.state,
      failures: status.failures,
      lastFailureTime: status.lastFailureTime 
        ? new Date(status.lastFailureTime).toISOString() 
        : null,
    },
  });
});

// ============ Helper Functions ============

/**
 * Check legacy API health
 */
async function checkLegacyApiHealth() {
  try {
    const result = await legacyApiService.healthCheck();

    return {
      status: result.status,
      responseTime: result.responseTime,
      message: result.status === 'up' 
        ? 'Legacy API responding normally' 
        : 'Legacy API not responding',
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Legacy API health check failed', error);
    return {
      status: 'down' as const,
      responseTime: 0,
      message: 'Legacy API health check failed',
      lastChecked: new Date().toISOString(),
    };
  }
}

/**
 * Check cache health
 */
function checkCacheHealth(): ServiceHealth {
  try {
    const stats = cacheService.getStats();

    return {
      status: stats.redisConnected ? 'up' : 'degraded',
      message: stats.redisConnected 
        ? 'Cache operational (Redis + Memory)' 
        : 'Cache degraded (Memory only)',
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Cache health check failed', error);
    return {
      status: 'degraded',
      message: 'Cache check failed, using memory fallback',
      lastChecked: new Date().toISOString(),
    };
  }
}

export default router;