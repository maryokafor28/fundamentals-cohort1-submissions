'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProductCard from '@/components/products/ProductCard';
import { mockProducts } from '@/lib/api';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Cart Service Demo
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90">
            Microservices-based E-commerce Cart System
          </p>
          {!user && (
            <div className="space-x-4">
              <a href="/login" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Login
              </a>
              <a href="/register" className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Register
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Our Products</h2>
            <p className="text-gray-600 mt-2">
              {user ? 'Click "Add to Cart" to test the cart service' : 'Login to add items to your cart'}
            </p>
          </div>
          
          {user && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back, {user.username}!</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12 place-items-center">
          {mockProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
