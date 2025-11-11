"use client";

import { useEffect, useState } from "react";
import { CartItem, CartActions } from "@/components/widgets/GetCartCard";
import { cartService } from "@/components/api/cartservice";
import { Button } from "../ui/button";

type CartProduct = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Get userId from localStorage user object (same as shopping page)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) {
          console.log("No user found in localStorage");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const userId = user._id;

        if (!userId) {
          console.log("No userId found in user object");
          setLoading(false);
          return;
        }

        console.log("Fetching cart for userId:", userId);
        const cartData = await cartService.getCart(userId);
        console.log("Cart data received:", cartData);

        // Handle the response structure from your backend
        setCartItems(cartData?.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      // Remove item when quantity becomes 0
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className=" mb-4">Your cart is empty</p>
          <Button
            onClick={() => (window.location.href = "/cart")}
            className="px-4 py-2 rounded"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <CartItem
              key={item.productId}
              id={parseInt(item.productId)} // Convert string to number for the component
              image={item.imageUrl || "/images/placeholder.svg"} // 👈 use imageUrl from API
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              subtotal={item.price * item.quantity}
              onQuantityChange={(id, value) =>
                handleQuantityChange(String(id), value)
              } // Convert back to string for our handler
              onRemove={(id) => handleRemoveItem(String(id))} // 👈 add this line
            />
          ))}

          <CartActions
            onReturn={() => (window.location.href = "/")}
            onUpdate={() => console.log("Cart updated", cartItems)}
          />
        </>
      )}
    </div>
  );
}
