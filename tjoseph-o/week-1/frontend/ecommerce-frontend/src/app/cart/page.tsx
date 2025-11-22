'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, updateCartItem, removeFromCart, clearCart, loading } = useCart();

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-lg mb-4">Please login to view your cart</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to get started</p>
        <Link href="/">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button variant="outline" onClick={clearCart} disabled={loading}>
          Clear Cart
        </Button>
      </div>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <Card key={item.productId} className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                    disabled={loading}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                    disabled={loading}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeFromCart(item.productId)}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total: ${cart.totalAmount.toFixed(2)}</span>
          <span>Items: {cart.totalItems}</span>
        </div>
      </Card>
    </div>
  );
}
