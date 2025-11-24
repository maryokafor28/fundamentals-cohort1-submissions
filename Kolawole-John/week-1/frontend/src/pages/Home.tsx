// src/pages/Home.tsx
import React from "react";

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: "$59.99",
        image: "https://images.unsplash.com/photo-1580894908361-96719503378d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        name: "Smart Watch",
        price: "$129.99",
        image: "https://images.unsplash.com/photo-1517414204284-4721a9bda2c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: "$39.99",
        image: "https://images.unsplash.com/photo-1616400619174-b7d021fd74e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        name: "Gaming Mouse",
        price: "$49.99",
        image: "https://images.unsplash.com/photo-1616628182509-6ad419c92fef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
];

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* HERO SECTION */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-12">
                <img
                    src="https://images.unsplash.com/photo-1515169067865-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                    alt="Shop Banner"
                    className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
                        <p className="mb-6 text-lg">Discover amazing deals on the latest gadgets</p>
                        <button className="bg-yellow-400 text-black font-medium py-2 px-6 rounded hover:bg-yellow-500 transition">
                            Shop Now
                        </button>
                    </div>
                </div>
            </div>

            {/* PRODUCT GRID */}
            <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white border rounded-lg shadow-sm hover:shadow-lg transition"
                    >
                        <div className="overflow-hidden rounded-t-lg">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-56 object-cover transform hover:scale-105 transition duration-300"
                            />
                        </div>
                        <div className="p-4 flex flex-col justify-between h-40">
                            <h3 className="text-lg font-semibold line-clamp-2">
                                {product.name}
                            </h3>
                            <p className="text-xl font-bold text-green-700">{product.price}</p>
                            <button className="mt-3 w-full bg-yellow-400 text-black font-medium py-2 px-4 rounded hover:bg-yellow-500 transition">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
