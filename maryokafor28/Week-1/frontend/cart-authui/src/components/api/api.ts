export const API_BASE_URL = "https://cart-auth-services.onrender.com";

export const ENDPOINT = {
  // Auth
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,

  // Cart
  addToCart: `${API_BASE_URL}/cart/add-to-cart`,
  getCart: (userId: string) => `${API_BASE_URL}/cart/get-cart/${userId}`,
};
