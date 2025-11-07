// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { type Product, getProducts } from "../services/productService";
import { addToCart, removeFromCart } from "../services/cartService";

interface HomeProps {
  userId: string;
}

export default function Home({ userId }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
    await addToCart(userId, productId);
    alert("Added to cart!");
  };

  const handleRemoveFromCart = async (productId: string) => {
    await removeFromCart(userId, productId); // assumes productId is used in cart
    alert("Removed from cart!");
  };

  if (loading) return <p className="text-center p-4">Loading products...</p>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-10 h-full w-full">
      {products.map((product) => (
        <div key={product._id} className="border rounded-lg shadow p-4 flex flex-col">
          <img src={product.image} alt={product.name} className="h-40 object-cover mb-2 rounded" />
          <h2 className="font-bold text-lg">{product.name}</h2>
          <p className="text-sm text-gray-500 mb-2">In stock: {product.inStock}</p>
          <div className="mt-auto flex gap-2">
            <button
              onClick={() => handleAddToCart(product._id)}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Add
            </button>
            <button
              onClick={() => handleRemoveFromCart(product._id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
