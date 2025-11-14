import { useState } from "react";

export function useApi<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
