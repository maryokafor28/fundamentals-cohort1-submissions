// src/pages/Cart.tsx
import { useEffect, useState } from "react";
import { getCartItems, removeFromCart } from "../services/cartService";
import { type Product } from "../services/productService";

type CartResponse = {
  _id: string;
  userId: string;
  products: Array<string | Product>;
  orderConfirmed: boolean;
} | null;

export default function Cart({ userId }: { userId: string }) {
  const [cart, setCart] = useState<CartResponse>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function fetchCart() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCartItems(userId);
        if (mounted) setCart(data);
      } catch (err) {
        if (mounted && err instanceof Error) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCart();
    return () => {
      mounted = false;
    };
  }, [userId, refreshKey]);

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(userId, productId);
      setRefreshKey((k) => k + 1);
    } catch {
      setError("Failed to remove item");
    }
  };

  if (loading) return <p className="p-4 text-center">Loading cart...</p>;
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
  if (!cart || !cart.products || cart.products.length === 0)
    return <p className="p-4 text-center">Your cart is empty</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-10 h-full w-full">
        {cart.products.map((p) => {
          const product =
            typeof p === "string"
              ? { _id: p, name: "Unknown product", image: "", inStock: 0 }
              : p;
          return (
            <div
              key={product._id}
              className="flex items-center gap-4 border rounded-lg p-3"
            >
              <img
                src={product.image || "https://via.placeholder.com/80"}
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-gray-500">In stock: {product.inStock}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRemove(product._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
