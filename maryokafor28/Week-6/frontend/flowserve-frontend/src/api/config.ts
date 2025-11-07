// Base configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
console.log("API URL = ", import.meta.env.VITE_API_BASE_URL);

// Request options type
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

// Custom fetch wrapper with error handling
export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { params, ...fetchOptions } = options;

  // Build URL with query parameters
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  // Log outgoing request
  console.log(`📤 ${fetchOptions.method || "GET"} ${url}`);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Log response status
    console.log(`✅ ${response.status} ${url}`);

    // Parse response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      const error = {
        status: response.status,
        message: data.error || data.message || "Request failed",
        details: data,
      };
      throw error;
    }

    return data as T;
  } catch (error) {
    // Type guard for error handling
    if (error instanceof Error) {
      console.error(`❌ Network Error ${url}:`, error.message);
    } else if (
      typeof error === "object" &&
      error !== null &&
      "status" in error
    ) {
      console.error(`❌ ${error.status} ${url}`);
    }
    throw error;
  }
};

// Export base URL for direct usage if needed
export { API_BASE_URL };
