import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { cartService } from '../../services/cartService';
import './ProductList.css';

interface ProductListProps {
  userId: string;
  onCartUpdate: (count: number) => void;
}

// Mock products data - in a real app, this would come from an API
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality noise-cancelling headphones with premium sound',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    category: 'Electronics',
    inStock: true
  },
  {
    _id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your workouts, heart rate, and daily activities',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    category: 'Electronics',
    inStock: true
  },
  {
    _id: '3',
    name: 'Premium Coffee Maker',
    description: 'Brew barista-quality coffee at home with this premium machine',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
    category: 'Appliances',
    inStock: true
  },
  {
    _id: '4',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable and supportive chair for long working hours',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    category: 'Furniture',
    inStock: true
  },
  {
    _id: '5',
    name: 'Wireless Phone Charger',
    description: 'Fast charging pad compatible with all modern smartphones',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop',
    category: 'Electronics',
    inStock: false
  },
  {
    _id: '6',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and eco-friendly casual wear for everyday use',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    category: 'Clothing',
    inStock: true
  }
];

const ProductList = ({ userId, onCartUpdate }: ProductListProps) => {
  const [products] = useState<Product[]>(mockProducts);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Update cart count on component mount
    updateCartCount();
  }, []);

  const updateCartCount = async () => {
    try {
      const cart = await cartService.getCart(userId);
      const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      onCartUpdate(totalItems);
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  const handleAddToCart = async (product: Product) => {
    setLoadingStates(prev => ({ ...prev, [product._id]: true }));

    try {
      await cartService.addToCart(userId, product._id, 1);
      await updateCartCount();

      // Show success feedback
      const button = document.querySelector(`[data-product-id="${product._id}"]`);
      if (button) {
        button.textContent = 'Added!';
        setTimeout(() => {
          button.innerHTML = '<svg>...</svg> Add to Cart'; // Reset button text
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [product._id]: false }));
    }
  };

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>Our Products</h2>
        <p>Discover amazing products at great prices</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image-container">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  // Fallback image if URL fails
                  e.currentTarget.src = 'https://via.placeholder.com/300x300?text=No+Image';
                }}
              />
              {!product.inStock && (
                <div className="out-of-stock-overlay">
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-category">{product.category}</div>
              <div className="product-price">${product.price.toFixed(2)}</div>

              <button
                className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''}`}
                onClick={() => handleAddToCart(product)}
                disabled={!product.inStock || loadingStates[product._id]}
                data-product-id={product._id}
              >
                {loadingStates[product._id] ? (
                  'Adding...'
                ) : !product.inStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
