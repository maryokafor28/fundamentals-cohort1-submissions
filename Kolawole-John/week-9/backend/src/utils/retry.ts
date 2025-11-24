import logger from '../config/logger';
import { RetryOptions } from '../types';

/**
 * Retry utility with exponential backoff
 * Implements resilience patterns for API calls
 * 
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @returns Result of successful function execution
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { attempts, delay, backoff = 'exponential' } = options;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      logger.debug(`Attempt ${attempt}/${attempts}`);
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === attempts) {
        logger.error(`All ${attempts} attempts failed`, { error: lastError.message });
        break;
      }

      const waitTime = backoff === 'exponential' 
        ? delay * Math.pow(2, attempt - 1)
        : delay * attempt;

      logger.warn(
        `Attempt ${attempt} failed, retrying in ${waitTime}ms...`,
        { error: lastError.message }
      );

      await sleep(waitTime);
    }
  }

  throw lastError || new Error('Retry failed with unknown error');
}

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry with timeout
 * Adds timeout protection to retry logic
 */
export async function retryWithTimeout<T>(
  fn: () => Promise<T>,
  options: RetryOptions & { timeout: number }
): Promise<T> {
  const { timeout, ...retryOptions } = options;

  return Promise.race([
    retry(fn, retryOptions),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeout)
    ),
  ]);
}