import { ENDPOINT } from "../api/api";

interface AddToCartData {
  userId: string;
  productId: string;
  name: string;
  price: number;
  quantity?: number;
  description?: string;
  imageUrl?: string;
}

export const cartService = {
  add: async (data: AddToCartData) => {
    const res = await fetch(ENDPOINT.addToCart, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(`Failed to add to cart: ${res.status}`);
    return res.json();
  },

  getCart: async (userId: string) => {
    const res = await fetch(ENDPOINT.getCart(userId), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
  },
};
