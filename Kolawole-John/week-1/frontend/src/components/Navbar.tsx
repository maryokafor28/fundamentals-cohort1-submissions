// src/components/Navbar.tsx
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
    return (
        <header className="bg-gray-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

                {/* Logo */}s
                <div className="text-2xl font-bold text-yellow-400 cursor-pointer">
                    MyShop
                </div>

                {/* Search */}
                <div className="flex-1 mx-6">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full px-4 py-2 rounded-l-md border-none focus:ring-2 focus:ring-yellow-400 text-black"
                    />
                    <button className="bg-yellow-400 text-black px-4 py-2 rounded-r-md hover:bg-yellow-500 transition">
                        Search
                    </button>
                </div>

                {/* Cart */}
                <div className="flex items-center space-x-3 cursor-pointer hover:text-yellow-400 transition">
                    <ShoppingCart size={24} />
                    <span className="text-sm">Cart (0)</span>
                </div>
            </div>
        </header>
    );
}
