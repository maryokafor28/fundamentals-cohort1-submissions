import logger from '../config/logger';
import config from '../config';
import { CircuitBreakerState } from '../types';

/**
 * Circuit Breaker Pattern Implementation
 * 
 * Prevents cascading failures by failing fast when a service is unhealthy
 * 
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Service is failing, requests fail immediately
 * - HALF_OPEN: Testing if service has recovered
 * 
 * @example
 * const breaker = new CircuitBreaker('legacy-api', { 
 *   failureThreshold: 5,
 *   resetTimeout: 60000 
 * });
 * const result = await breaker.execute(() => apiCall());
 */
export class CircuitBreaker {
  private state: CircuitBreakerState = {
    failures: 0,
    lastFailureTime: 0,
    state: 'closed',
  };

  constructor(
    private name: string,
    private options = {
      failureThreshold: config.circuitBreaker.failureThreshold,
      resetTimeout: config.circuitBreaker.resetTimeout,
    }
  ) {}

  /**
   * Execute a function through the circuit breaker
   */
  async execute<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T> {
    // Check if circuit should transition to half-open
    if (this.state.state === 'open' && this.shouldAttemptReset()) {
      logger.info(`Circuit breaker ${this.name}: Transitioning to HALF_OPEN`);
      this.state.state = 'half-open';
    }

    // If circuit is open, fail fast
    if (this.state.state === 'open') {
      logger.warn(`Circuit breaker ${this.name}: OPEN - Request blocked`);
      
      if (fallback) {
        logger.info(`Circuit breaker ${this.name}: Using fallback`);
        return fallback();
      }
      
      throw new Error(`Circuit breaker ${this.name} is OPEN`);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    if (this.state.state === 'half-open') {
      logger.info(`Circuit breaker ${this.name}: Test successful - CLOSING`);
      this.reset();
    }
    
    // Reset failure count on success in closed state
    if (this.state.failures > 0) {
      this.state.failures = 0;
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(): void {
    this.state.failures++;
    this.state.lastFailureTime = Date.now();

    logger.warn(
      `Circuit breaker ${this.name}: Failure ${this.state.failures}/${this.options.failureThreshold}`
    );

    if (this.state.failures >= this.options.failureThreshold) {
      this.trip();
    }
  }

  /**
   * Trip the circuit breaker (open it)
   */
  private trip(): void {
    this.state.state = 'open';
    logger.error(
      `Circuit breaker ${this.name}: TRIPPED - Will retry in ${this.options.resetTimeout}ms`
    );
  }

  /**
   * Reset the circuit breaker
   */
  private reset(): void {
    this.state = {
      failures: 0,
      lastFailureTime: 0,
      state: 'closed',
    };
    logger.info(`Circuit breaker ${this.name}: CLOSED`);
  }

  /**
   * Check if enough time has passed to attempt reset
   */
  private shouldAttemptReset(): boolean {
    return Date.now() - this.state.lastFailureTime >= this.options.resetTimeout;
  }

  /**
   * Get current circuit breaker status
   */
  getStatus(): CircuitBreakerState {
    return { ...this.state };
  }

  /**
   * Manually reset the circuit breaker
   */
  manualReset(): void {
    logger.info(`Circuit breaker ${this.name}: Manual reset`);
    this.reset();
  }
}

// Export singleton instance for legacy API
export const legacyApiCircuitBreaker = new CircuitBreaker('legacy-api');