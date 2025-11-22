const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

class CartService {
 
  static async addToCart(userId, productId, quantity = 1) {
    try {
      if (quantity <= 0) {
        return {
          success: false,
          error: 'Invalid quantity. Quantity must be greater than 0'
        };
      }

      const user = await User.findById(userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const product = await Product.findById(productId);
      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      if (!product.isActive) {
        return {
          success: false,
          error: 'Product is not available'
        };
      }

      if (!product.inStock) {
        return {
          success: false,
          error: 'Product is out of stock'
        };
      }

      let cart = await Cart.findOrCreateForUser(userId);

      const existingItem = cart.getItem(productId);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      const totalRequiredQuantity = currentQuantityInCart + quantity;

      if (totalRequiredQuantity > product.stockQuantity) {
        return {
          success: false,
          error: `Insufficient stock. Available: ${product.stockQuantity}, In cart: ${currentQuantityInCart}, Requested: ${quantity}`
        };
      }

      cart.addItem(productId, product.name, product.price, quantity);

      await cart.save();

      return {
        success: true,
        cart: cart.toJSON(),
        message: 'Item added to cart successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to add item to cart'
      };
    }
  }


  static async getCart(userId) {
    try {
      const cart = await Cart.findOrCreateForUser(userId);

      return {
        success: true,
        cart: cart.toJSON()
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to get cart'
      };
    }
  }


  static async getCartWithProducts(userId) {
    try {
      const cart = await Cart.getCartWithProducts(userId);

      if (!cart) {
        const newCart = await Cart.findOrCreateForUser(userId);
        return {
          success: true,
          cart: newCart.toJSON()
        };
      }

      return {
        success: true,
        cart: cart.toJSON()
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to get cart with product details'
      };
    }
  }


  static async updateCartItem(userId, productId, quantity) {
    try {
      if (quantity < 0) {
        return {
          success: false,
          error: 'Invalid quantity. Quantity cannot be negative'
        };
      }

      const cart = await Cart.findOne({ userId, status: 'active' });
      if (!cart) {
        return {
          success: false,
          error: 'Cart not found'
        };
      }

      if (!cart.hasItem(productId)) {
        return {
          success: false,
          error: 'Item not found in cart'
        };
      }

      if (quantity === 0) {
        cart.removeItem(productId);
        await cart.save();

        return {
          success: true,
          cart: cart.toJSON(),
          message: 'Item removed from cart'
        };
      }

      const product = await Product.findById(productId);
      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        };
      }

      if (quantity > product.stockQuantity) {
        return {
          success: false,
          error: `Insufficient stock. Available: ${product.stockQuantity}, Requested: ${quantity}`
        };
      }

      cart.updateItemQuantity(productId, quantity);
      await cart.save();

      return {
        success: true,
        cart: cart.toJSON(),
        message: 'Cart item updated successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to update cart item'
      };
    }
  }

 
  static async removeFromCart(userId, productId) {
    try {
      const cart = await Cart.findOne({ userId, status: 'active' });
      if (!cart) {
        return {
          success: false,
          error: 'Cart not found'
        };
      }

      if (!cart.hasItem(productId)) {
        return {
          success: false,
          error: 'Item not found in cart'
        };
      }

      cart.removeItem(productId);
      await cart.save();

      return {
        success: true,
        cart: cart.toJSON(),
        message: 'Item removed from cart successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to remove item from cart'
      };
    }
  }

  
  static async clearCart(userId) {
    try {
      const cart = await Cart.findOne({ userId, status: 'active' });
      if (!cart) {
        const newCart = await Cart.findOrCreateForUser(userId);
        return {
          success: true,
          cart: newCart.toJSON(),
          message: 'Cart is already empty'
        };
      }

      cart.clearCart();
      await cart.save();

      return {
        success: true,
        cart: cart.toJSON(),
        message: 'Cart cleared successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to clear cart'
      };
    }
  }

 
  static async getCartSummary(userId) {
    try {
      const cart = await Cart.findOrCreateForUser(userId);

      const summary = {
        itemCount: cart.totalItems,
        totalAmount: cart.totalAmount,
        uniqueItems: cart.items.length,
        isEmpty: cart.items.length === 0,
        currency: 'USD' 
      };

      return {
        success: true,
        summary
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to get cart summary'
      };
    }
  }

  
  static async transferCart(sessionId, userId) {
    try {
      const sessionCart = await Cart.findOne({ sessionId, status: 'active' });
      if (!sessionCart) {
        return {
          success: true,
          message: 'No session cart found to transfer'
        };
      }

      let userCart = await Cart.findOrCreateForUser(userId);

     
      for (const item of sessionCart.items) {
        
        if (userCart.hasItem(item.productId)) {
         
          const existingItem = userCart.getItem(item.productId);
          const newQuantity = existingItem.quantity + item.quantity;
          
         
          const product = await Product.findById(item.productId);
          if (product && newQuantity <= product.stockQuantity) {
            userCart.updateItemQuantity(item.productId, newQuantity);
          }
        } else {
         
          userCart.addItem(item.productId, item.name, item.price, item.quantity);
        }
      }

      await userCart.save();
      sessionCart.status = 'converted';
      await sessionCart.save();

      return {
        success: true,
        cart: userCart.toJSON(),
        message: 'Cart transferred successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to transfer cart'
      };
    }
  }

 
  static async validateCart(userId) {
    try {
      const cart = await Cart.findOne({ userId, status: 'active' });
      if (!cart || cart.items.length === 0) {
        return {
          success: true,
          valid: true,
          message: 'Cart is empty or not found'
        };
      }

      const validationResults = {
        valid: true,
        issues: [],
        updatedItems: []
      };

      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          validationResults.valid = false;
          validationResults.issues.push({
            type: 'PRODUCT_NOT_FOUND',
            productId: item.productId,
            productName: item.name,
            message: `Product "${item.name}" is no longer available`
          });
          cart.removeItem(item.productId);
          continue;
        }

        if (!product.isActive || !product.inStock) {
          validationResults.valid = false;
          validationResults.issues.push({
            type: 'PRODUCT_UNAVAILABLE',
            productId: item.productId,
            productName: item.name,
            message: `Product "${item.name}" is currently unavailable`
          });
          cart.removeItem(item.productId);
          continue;
        }

        if (item.quantity > product.stockQuantity) {
          validationResults.valid = false;
          validationResults.issues.push({
            type: 'INSUFFICIENT_STOCK',
            productId: item.productId,
            productName: item.name,
            requestedQuantity: item.quantity,
            availableQuantity: product.stockQuantity,
            message: `Only ${product.stockQuantity} units of "${item.name}" are available`
          });
          
          if (product.stockQuantity > 0) {
            cart.updateItemQuantity(item.productId, product.stockQuantity);
            validationResults.updatedItems.push({
              productId: item.productId,
              oldQuantity: item.quantity,
              newQuantity: product.stockQuantity
            });
          } else {
            cart.removeItem(item.productId);
          }
          continue;
        }

        if (item.price !== product.price) {
          validationResults.issues.push({
            type: 'PRICE_CHANGED',
            productId: item.productId,
            productName: item.name,
            oldPrice: item.price,
            newPrice: product.price,
            message: `Price of "${item.name}" has changed from $${item.price} to $${product.price}`
          });

          const cartItem = cart.getItem(item.productId);
          if (cartItem) {
            cartItem.price = product.price;
            cartItem.subtotal = product.price * cartItem.quantity;
          }
        }
      }

      if (validationResults.issues.length > 0) {
        cart.calculateTotal();
        await cart.save();
      }

      return {
        success: true,
        ...validationResults,
        cart: cart.toJSON()
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to validate cart'
      };
    }
  }


  static async getCartStats(userId) {
    try {
      const cart = await Cart.findOne({ userId, status: 'active' });
      
      if (!cart || cart.items.length === 0) {
        return {
          success: true,
          stats: {
            totalItems: 0,
            totalValue: 0,
            averageItemValue: 0,
            categories: {},
            lastUpdated: null
          }
        };
      }

      const productIds = cart.items.map(item => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });
      const productMap = products.reduce((map, product) => {
        map[product._id.toString()] = product;
        return map;
      }, {});

      const categories = {};
      let totalValue = 0;

      cart.items.forEach(item => {
        const product = productMap[item.productId.toString()];
        if (product) {
          categories[product.category] = (categories[product.category] || 0) + item.quantity;
        }
        totalValue += item.price * item.quantity;
      });

      const stats = {
        totalItems: cart.totalItems,
        totalValue: cart.totalAmount,
        averageItemValue: cart.items.length > 0 ? cart.totalAmount / cart.items.length : 0,
        categories,
        uniqueProducts: cart.items.length,
        lastUpdated: cart.updatedAt
      };

      return {
        success: true,
        stats
      };

    } catch (error) {
      return {
        success: false,
        error: 'Failed to get cart statistics'
      };
    }
  }
}

module.exports = CartService;