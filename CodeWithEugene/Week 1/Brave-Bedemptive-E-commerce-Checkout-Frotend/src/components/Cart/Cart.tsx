import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Cart as CartType, CartItem } from '../../types';
import { cartService } from '../../services/cartService';
import './Cart.css';

interface CartProps {
  userId: string;
  onCartUpdate: (count: number) => void;
}

const Cart = ({ userId, onCartUpdate }: CartProps) => {
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart(userId);
      setCart(cartData);

      // Update cart count
      const totalItems = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
      onCartUpdate(totalItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Initialize empty cart on error
      setCart({
        _id: '',
        userId,
        items: [],
        totalPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      onCartUpdate(0);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

    try {
      await cartService.updateCartItem(userId, itemId, newQuantity);
      await fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

    try {
      await cartService.removeFromCart(userId, itemId);
      await fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    try {
      setLoading(true);
      await cartService.clearCart(userId);
      await fetchCart(); // Refresh cart data
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading-spinner">Loading your cart...</div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <ShoppingBag size={64} />
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button className="clear-cart-btn" onClick={clearCart}>
          <Trash2 size={16} />
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item: CartItem) => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image';
                  }}
                />
              </div>

              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p className="item-description">{item.product.description}</p>
                <div className="item-category">{item.product.category}</div>
              </div>

              <div className="item-controls">
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updatingItems[item._id]}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={updatingItems[item._id]}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="item-price">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item._id)}
                  disabled={updatingItems[item._id]}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Total Items:</span>
            <span>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="summary-row total">
            <span>Total Price:</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>

          <button className="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
