export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    // 🔹 Auto logout on expired/invalid token
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-logout")); // broadcast logout
    }

    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
}
export const api = {
  register: (data: { username: string; email: string; password: string }) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),

  getProfile: () =>
    request(`/api/auth/onAuthStateChanged?t=${Date.now()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),

  addToCart: (productData: {
    productId: string;
    title: string;
    description: string;
    category: string;
    price: number;
    quantity: number;
    image: string;
  }) =>
    request("/api/cart/add-to-cart", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  getCart: (userId: string) => request(`/api/cart/get-cart/${userId}`),
};

export { request };
