import { config } from "../config/env.config";

/**
 * Retries an async function a specified number of times with a delay.
 * @param fn - The async function to execute
 * @param maxAttempts - Maximum retry attempts (default from env)
 * @param delay - Delay between retries in ms (default from env)
 * @returns The result of the async function
 * @throws The last error if all retries fail
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = config.retry.maxAttempts,
  delay: number = config.retry.delay
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < maxAttempts) {
        console.warn(
          ` Retry attempt ${attempt}/${maxAttempts} failed. Retrying in ${delay}ms...`,
          { error: lastError.message }
        );
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }

  // All retries failed
  console.error(`❌ All ${maxAttempts} retry attempts failed.`, {
    error: lastError!.message,
  });
  throw lastError!;
};
