"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  id: number;
  image: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  onQuantityChange: (id: number, value: number) => void;
  onRemove?: (id: number) => void;
}

function CartItem({
  id,
  image,
  name,
  price,
  quantity,
  subtotal,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <Card className="w-full border rounded-lg mb-4">
      <CardContent className="flex justify-between items-center p-4">
        {/* Product Info */}
        <div className="flex items-center gap-4">
          <Image src={image} alt={name} width={60} height={60} />
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-gray-600">${price}</p>
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between gap-3">
          <select
            className="border rounded px-2 py-1 h-8"
            value={quantity}
            onChange={(e) => onQuantityChange(id, Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 7, 8].map((q) => (
              <option key={q} value={q}>
                {q.toString().padStart(2, "0")}
              </option>
            ))}
          </select>

          {/* Remove Button */}
          {onRemove && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(id)}
              className="px-3 py-1 text-xs"
            >
              Remove
            </Button>
          )}
        </div>

        {/* Subtotal */}
        <div className="font-semibold">${subtotal}</div>
      </CardContent>
    </Card>
  );
}

interface CartActionsProps {
  onReturn: () => void;
  onUpdate: () => void;
}

function CartActions({ onUpdate }: CartActionsProps) {
  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={() => (window.location.href = "/cart")}
      >
        Return To Shop
      </Button>
      <Button onClick={onUpdate}>Update Cart</Button>
    </div>
  );
}

export { CartItem, CartActions };
