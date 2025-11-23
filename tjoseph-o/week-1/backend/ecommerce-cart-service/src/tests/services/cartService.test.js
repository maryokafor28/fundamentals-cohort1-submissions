const CartService = require('../../services/cartService');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Cart = require('../../models/Cart');

describe('CartService', () => {
  let testUser;
  let testProduct1;
  let testProduct2;

  beforeEach(async () => {
    const userData = global.testUtils.createTestUser();
    testUser = new User(userData);
    await testUser.save();

    testProduct1 = new Product({
      name: 'Test Product 1',
      description: 'A test product',
      price: 29.99,
      category: 'electronics',
      inStock: true,
      stockQuantity: 10
    });
    await testProduct1.save();

    testProduct2 = new Product({
      name: 'Test Product 2',
      description: 'Another test product',
      price: 49.99,
      category: 'electronics',
      inStock: true,
      stockQuantity: 5
    });
    await testProduct2.save();
  });

  describe('addToCart', () => {
    test('should add item to empty cart', async () => {
      const result = await CartService.addToCart(
        testUser._id,
        testProduct1._id,
        2
      );

      expect(result.success).toBe(true);
      expect(result.cart.items).toHaveLength(1);
      expect(result.cart.items[0].productId.toString()).toBe(testProduct1._id.toString());
      expect(result.cart.items[0].quantity).toBe(2);
      expect(result.cart.totalAmount).toBe(59.98); 
    });

    test('should increase quantity if item already exists', async () => {
      await CartService.addToCart(testUser._id, testProduct1._id, 1);
      
      const result = await CartService.addToCart(testUser._id, testProduct1._id, 2);

      expect(result.success).toBe(true);
      expect(result.cart.items).toHaveLength(1);
      expect(result.cart.items[0].quantity).toBe(3);
      expect(result.cart.totalAmount).toBe(89.97); 
    });

    test('should add multiple different items', async () => {
      await CartService.addToCart(testUser._id, testProduct1._id, 1);
      const result = await CartService.addToCart(testUser._id, testProduct2._id, 1);

      expect(result.success).toBe(true);
      expect(result.cart.items).toHaveLength(2);
      expect(result.cart.totalAmount).toBe(79.98); 
    });

    test('should fail to add non-existent product', async () => {
      const fakeProductId = '507f1f77bcf86cd799439011';
      const result = await CartService.addToCart(testUser._id, fakeProductId, 1);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Product not found');
    });

    test('should fail to add out of stock product', async () => {
      testProduct1.inStock = false;
      await testProduct1.save();

      const result = await CartService.addToCart(testUser._id, testProduct1._id, 1);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Product is out of stock');
    });

    test('should fail to add more than available stock', async () => {
      const result = await CartService.addToCart(testUser._id, testProduct1._id, 15);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient stock');
    });
  });

  describe('getCart', () => {
    test('should get user cart with items', async () => {
      
      await CartService.addToCart(testUser._id, testProduct1._id, 2);
      await CartService.addToCart(testUser._id, testProduct2._id, 1);

      const result = await CartService.getCart(testUser._id);

      expect(result.success).toBe(true);
      expect(result.cart.items).toHaveLength(2);
      expect(result.cart.totalAmount).toBe(109.97); 
      expect(result.cart.totalItems).toBe(3); 
    });

    test('should return empty cart for new user', async () => {
      const result = await CartService.getCart(testUser._id);

      expect(result.success).toBe(true);
      expect(result.cart.items).toHaveLength(0);
      expect(result.cart.totalAmount).toBe(0);
      expect(result.cart.totalItems).toBe(0);
    });

    test('should get cart with populated product details', async () => {
      await CartService.addToCart(testUser._id, testProduct1._id, 1);
      
      const result = await CartService.getCartWithProducts(testUser._id);

      expect(result.success).toBe(true);
      expect(result.cart.items[0].productId.name).toBe(testProduct1.name);
      expect(result.cart.items[0].productId.price).toBe(testProduct1.price);
    });
  });

  describe('updateCartItem', () => {
    beforeEach(async () => {
      
      await CartService.addToCart(testUser._id, testProduct1._id, 2);
    });

    test('should update item quantity', async () => {
      const result = await CartService.updateCartItem(testUser._id, testProduct1._id, 5);

      expect(result.success).toBe(true);
      expect(result.cart.items[0].quantity).toBe(5);
      expect(result.cart.totalAmount).toBe(149.95); 
    });

    test('should remove item when quantity is 0', async () => {
      const result = await CartService.updateCartItem(testUser._id, testProduct1._id, 0);

      expect(result.success).toBe(true);
      expect(result.cart.items).toHaveLength(0);
      expect(result.cart.totalAmount).toBe(0);
    });

    test('should fail to update non-existent item', async () => {
      const result = await CartService.updateCartItem(testUser._id, testProduct2._id, 3);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Item not found in cart');
    });

    test('should fail to update with invalid quantity', async () => {
      const result = await CartService.updateCartItem(testUser._id, testProduct1._id, -1);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid quantity');
    });

    test('should fail to update beyond stock limit', async () => {
      const result = await CartService.updateCartItem(testUser._id, testProduct1._id, 15);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient stock');
    });
  });

  describe('removeFromCart', () => {
    beforeEach(async () => {
      
      await CartService.addToCart(testUser._id, testProduct1._id, 2);
      await CartService.addToCart(testUser._id, testProduct2._id, 1);
    });

    test('should remove item from cart', async () => {
      const result = await CartService.removeFromCart(testUser._id, testProduct1._id);

      expect(result.success).toBe(true);
      expect(result.cart.items).toHaveLength(1);
      expect(result.cart.items[0].productId.toString()).toBe(testProduct2._id.toString());
      expect(result.cart.totalAmount).toBe(49.99);
    });

    test('should fail to remove non-existent item', async () => {
      const fakeProductId = '507f1f77bcf86cd799439011';
      const result = await CartService.removeFromCart(testUser._id, fakeProductId);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Item not found in cart');
    });
  });

  describe('clearCart', () => {
    beforeEach(async () => {
      
      await CartService.addToCart(testUser._id, testProduct1._id, 2);
      await CartService.addToCart(testUser._id, testProduct2._id, 1);
    });

    test('should clear all items from cart', async () => {
      const result = await CartService.clearCart(testUser._id);

      expect(result.success).toBe(true);
      expect(result.cart.items).toHaveLength(0);
      expect(result.cart.totalAmount).toBe(0);
      expect(result.cart.totalItems).toBe(0);
    });
  });

  describe('getCartSummary', () => {
    test('should return cart summary', async () => {
      await CartService.addToCart(testUser._id, testProduct1._id, 2);
      await CartService.addToCart(testUser._id, testProduct2._id, 1);

      const result = await CartService.getCartSummary(testUser._id);

      expect(result.success).toBe(true);
      expect(result.summary.itemCount).toBe(3);
      expect(result.summary.totalAmount).toBe(109.97);
      expect(result.summary.uniqueItems).toBe(2);
      expect(result.summary.isEmpty).toBe(false);
    });

    test('should return empty cart summary for new user', async () => {
      const result = await CartService.getCartSummary(testUser._id);

      expect(result.success).toBe(true);
      expect(result.summary.itemCount).toBe(0);
      expect(result.summary.totalAmount).toBe(0);
      expect(result.summary.uniqueItems).toBe(0);
      expect(result.summary.isEmpty).toBe(true);
    });
  });
});