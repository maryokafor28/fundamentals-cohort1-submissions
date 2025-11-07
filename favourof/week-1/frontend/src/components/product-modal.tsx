"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Product {
  userId: string;
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating?: {
    rate: number;
    count: number;
  };
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
}: ProductModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  if (!product) return null;

  const handleAddToCart = async () => {
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/products");
      router.push("/login");
      return;
    }

    try {
      await api.addToCart({
        productId: product.id.toString(),
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      alert("✅ Added to cart");
      onClose();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground text-balance">
            {product.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-contain p-4"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge
                variant="secondary"
                className="mb-2 bg-secondary text-secondary-foreground"
              >
                {product.category}
              </Badge>
              {product.rating && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating!.rate)
                            ? "text-yellow-400 fill-current"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating.rate} ({product.rating.count} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="text-3xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent bg-transparent"
                >
                  Add to Wishlist
                </Button>
                <Button
                  variant="outline"
                  className="border-border text-foreground hover:bg-accent bg-transparent"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
