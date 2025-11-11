"use client";

import CartCard from "@/components/widgets/AddCartCard";
import { Button } from "@/components/ui/button";
import { cartService } from "@/components/api/cartservice";

export default function Cart() {
  const wishlist = [
    { id: 1, img: "/images/gucci-bag.svg", title: "Gucci bag", price: 960 },
    { id: 2, img: "/images/laptop.svg", title: "Laptop", price: 1960 },
    { id: 3, img: "/images/gamepad.svg", title: "USB Gamepad", price: 550 },
    { id: 4, img: "/images/keyboard.svg", title: "Keyboard", price: 750 },
    { id: 5, img: "/images/chair.svg", title: "Chair", price: 750 },
    { id: 6, img: "/images/car.svg", title: "Car", price: 750 },
    { id: 7, img: "/images/television.svg", title: "Television", price: 750 },
    { id: 8, img: "/images/shoe.svg", title: "Shoe", price: 750 },
    {
      id: 9,
      img: "/images/sound-system.svg",
      title: "Sound System",
      price: 750,
    },
    { id: 10, img: "/images/black-gamepad.svg", title: "Gamepad", price: 750 },
    { id: 11, img: "/images/desk.svg", title: "Desk", price: 750 },
  ];

  const handleAddToCart = async (productId: number) => {
    try {
      // Get user object from localStorage and parse it
      const userString = localStorage.getItem("user");
      if (!userString) {
        alert("You need to log in first!");
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id; // Extract _id from the user object

      console.log("User:", user);
      console.log("UserId:", userId);

      if (!userId) {
        alert("You need to log in first!");
        return;
      }

      // Find the product details from wishlist
      const product = wishlist.find((item) => item.id === productId);
      if (!product) {
        alert("Product not found!");
        return;
      }

      const result = await cartService.add({
        userId,
        productId: productId.toString(), // Convert to string to match backend
        name: product.title,
        price: product.price,
        quantity: 1,
        description: `${product.title} - Premium quality item`, // Optional description
        imageUrl: product.img,
      });

      console.log("Added to cart:", result);
      alert("Item added to cart ");
    } catch (err) {
      console.error(err);
      alert("Failed to add item to cart ");
    }
  };

  return (
    <div className="px-15 py-18 max-w-5xl mx-auto">
      {/* Header with text left, cart button right */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">Shopping List</h2>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/getcart")}
          className="text-2xl font-bold"
        >
          Cart
        </Button>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
        {wishlist.map((item) => (
          <CartCard
            key={item.id}
            img={item.img}
            title={item.title}
            // format price with $
            price={`$${item.price}`}
            onAdd={() => handleAddToCart(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
