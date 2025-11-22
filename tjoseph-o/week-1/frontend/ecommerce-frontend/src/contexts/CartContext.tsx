


// 'use client';

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// // Define the cart item interface
// export interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string;
//   description?: string;
// }

// // Define the context type
// interface CartContextType {
//   items: CartItem[];
//   cartItemCount: number;
//   totalPrice: number;
//   addItem: (item: CartItem) => void;
//   removeItem: (id: string) => void;
//   updateQuantity: (id: string, quantity: number) => void;
//   clearCart: () => void;
//   getItem: (id: string) => CartItem | undefined;
// }

// // Create the context
// const CartContext = createContext<CartContextType | undefined>(undefined);

// // Custom hook to use the cart context
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// // Cart provider props
// interface CartProviderProps {
//   children: ReactNode;
// }

// // Cart provider component
// export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
//   const [items, setItems] = useState<CartItem[]>([]);

//   // Load cart from localStorage on mount
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const savedCart = localStorage.getItem('cart_items');
//       if (savedCart) {
//         try {
//           setItems(JSON.parse(savedCart));
//         } catch (error) {
//           console.error('Error loading cart from localStorage:', error);
//         }
//       }
//     }
//   }, []);

//   // Save cart to localStorage whenever items change
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('cart_items', JSON.stringify(items));
//     }
//   }, [items]);

//   // Add item to cart
//   const addItem = (item: CartItem) => {
//     setItems(prevItems => {
//       const existingItem = prevItems.find(i => i.id === item.id);
      
//       if (existingItem) {
//         // If item exists, update quantity
//         return prevItems.map(i =>
//           i.id === item.id
//             ? { ...i, quantity: i.quantity + item.quantity }
//             : i
//         );
//       } else {
//         // If item doesn't exist, add it
//         return [...prevItems, item];
//       }
//     });
//   };

//   // Remove item from cart
//   const removeItem = (id: string) => {
//     setItems(prevItems => prevItems.filter(item => item.id !== id));
//   };

//   // Update item quantity
//   const updateQuantity = (id: string, quantity: number) => {
//     if (quantity <= 0) {
//       removeItem(id);
//       return;
//     }

//     setItems(prevItems =>
//       prevItems.map(item =>
//         item.id === id ? { ...item, quantity } : item
//       )
//     );
//   };

//   // Clear all items from cart
//   const clearCart = () => {
//     setItems([]);
//   };

//   // Get specific item from cart
//   const getItem = (id: string) => {
//     return items.find(item => item.id === id);
//   };

//   // Calculate total number of items
//   const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

//   // Calculate total price
//   const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

//   const value: CartContextType = {
//     items,
//     cartItemCount,
//     totalPrice,
//     addItem,
//     removeItem,
//     updateQuantity,
//     clearCart,
//     getItem,
//   };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockProducts, Product } from '@/lib/api';

// Define the cart item interface
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

// Define the context type - keeping your existing functions AND adding the ones your components expect
interface CartContextType {
  items: CartItem[];
  cartItemCount: number;
  totalPrice: number;
  // Your existing functions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (id: string) => CartItem | undefined;
  // New functions that your components expect
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  // For cart page compatibility
  cart: {
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
      subtotal: number;
    }>;
    totalAmount: number;
    totalItems: number;
  } | null;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  loading: boolean;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart provider props
interface CartProviderProps {
  children: ReactNode;
}

// Cart provider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart_items');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart_items', JSON.stringify(items));
    }
  }, [items]);

  // Add item to cart
  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // If item exists, update quantity
        return prevItems.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // If item doesn't exist, add it
        return [...prevItems, item];
      }
    });
  };

  // Add to cart function that your components expect (works with product ID)
  const addToCart = async (productId: string, quantity: number = 1): Promise<void> => {
    setLoading(true);
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Find the product in your mock products
      const product = mockProducts.find(p => p._id === productId);
      
      if (!product) {
        throw new Error('Product not found');
      }

      if (!product.inStock) {
        throw new Error('Product is out of stock');
      }

      // Convert product to cart item format
      const cartItem: CartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.imageUrl,
        description: product.description,
      };

      addItem(cartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Remove from cart (for cart page compatibility)
  const removeFromCart = async (productId: string): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    removeItem(productId);
    setLoading(false);
  };

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Update cart item (for cart page compatibility)
  const updateCartItem = async (productId: string, quantity: number): Promise<void> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    updateQuantity(productId, quantity);
    setLoading(false);
  };

  // Clear all items from cart
  const clearCart = () => {
    setItems([]);
  };

  // Get specific item from cart
  const getItem = (id: string) => {
    return items.find(item => item.id === id);
  };

  // Calculate total number of items
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Create cart object for cart page compatibility
  const cart = items.length > 0 ? {
    items: items.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    })),
    totalAmount: totalPrice,
    totalItems: cartItemCount,
  } : null;

  const value: CartContextType = {
    items,
    cartItemCount,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
    addToCart,
    cart,
    updateCartItem,
    removeFromCart,
    loading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};