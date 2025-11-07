"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { api } from "@/lib/api";

interface CartItem {
  _id: string;
  userId: string;
  productId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

export default function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setCartItems([]);
        return;
      }
      const items = await api.getCart(userId);
      setCartItems(items as CartItem[]);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }

    setCartItems((items) =>
      items.map((item) =>
        item._id === id
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item._id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + (item.total || item.price * item.quantity),
      0
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-8">
            <ShoppingBag className="w-8 h-8 text-foreground" />
            <h1 className="text-3xl font-bold text-foreground">Your Cart</h1>
            {cartItems.length > 0 && (
              <span className="text-muted-foreground">
                ({getTotalItems()} items)
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading your cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Add some products to get started!
              </p>
              <Button
                onClick={() => router.push("/")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item._id} className="bg-card border-border">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Product Image and Info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                              {item.description}
                            </p>
                            <p className="text-base sm:text-lg font-bold text-foreground mt-2">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls and Remove - Mobile: Full width, Desktop: Inline */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="h-8 w-8 sm:h-9 sm:w-9 border-border text-foreground hover:bg-accent"
                            >
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>

                            <span className="text-foreground font-medium w-8 sm:w-10 text-center text-sm sm:text-base">
                              {item.quantity}
                            </span>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="h-8 w-8 sm:h-9 sm:w-9 border-border text-foreground hover:bg-accent"
                            >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeItem(item._id)}
                            className="h-8 w-8 sm:h-9 sm:w-9 border-border text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border sm:hidden">
                        <span className="text-sm text-muted-foreground">
                          Subtotal:
                        </span>
                        <span className="font-semibold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1 order-first lg:order-last">
                <Card className="bg-card border-border lg:sticky lg:top-24">
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
                      Order Summary
                    </h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                        <span>Subtotal ({getTotalItems()} items)</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between text-base sm:text-lg font-bold text-foreground">
                          <span>Total</span>
                          <span>${getTotalPrice().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 sm:h-12 text-sm sm:text-base">
                        Proceed to Checkout
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border-border text-foreground hover:bg-accent bg-transparent h-10 sm:h-11 text-sm sm:text-base"
                        onClick={() => router.push("/")}
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
