const Cart = require('../../models/Cart');
const User = require('../../models/User');
const mongoose = require('mongoose');

describe('Cart Model', () => {
  let testUser;

  beforeEach(async () => {
    const userData = global.testUtils.createTestUser();
    testUser = new User(userData);
    await testUser.save();
  });

  describe('Cart Creation', () => {
    test('should create a valid empty cart for user', async () => {
      const cart = new Cart({
        userId: testUser._id,
        items: []
      });

      const savedCart = await cart.save();

      expect(savedCart._id).toBeDefined();
      expect(savedCart.userId.toString()).toBe(testUser._id.toString());
      expect(savedCart.items).toEqual([]);
      expect(savedCart.totalAmount).toBe(0);
      expect(savedCart.createdAt).toBeDefined();
      expect(savedCart.updatedAt).toBeDefined();
    });

    test('should fail to create cart without userId', async () => {
      const cart = new Cart({
        items: []
      });

      await expect(cart.save()).rejects.toThrow();
    });

    test('should create cart with items', async () => {
      const testProduct = global.testUtils.createTestProduct();
      
      const cart = new Cart({
        userId: testUser._id,
        items: [{
          productId: testProduct._id,
          name: testProduct.name,
          price: testProduct.price,
          quantity: 2
        }]
      });

      const savedCart = await cart.save();

      expect(savedCart.items).toHaveLength(1);
      expect(savedCart.items[0].productId.toString()).toBe(testProduct._id.toString());
      expect(savedCart.items[0].quantity).toBe(2);
      expect(savedCart.totalAmount).toBe(testProduct.price * 2);
    });
  });

  describe('Cart Methods', () => {
    test('should add item to empty cart', async () => {
      const cart = new Cart({
        userId: testUser._id,
        items: []
      });
      
      const testProduct = global.testUtils.createTestProduct();
      
      cart.addItem(testProduct._id, testProduct.name, testProduct.price, 1);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].productId.toString()).toBe(testProduct._id.toString());
      expect(cart.items[0].quantity).toBe(1);
    });

    test('should increase quantity if item already exists', async () => {
      const testProduct = global.testUtils.createTestProduct();
      
      const cart = new Cart({
        userId: testUser._id,
        items: [{
          productId: testProduct._id,
          name: testProduct.name,
          price: testProduct.price,
          quantity: 1
        }]
      });

      cart.addItem(testProduct._id, testProduct.name, testProduct.price, 2);

      expect(cart.items).toHaveLength(1);
      expect(cart.items[0].quantity).toBe(3);
    });

    test('should remove item from cart', async () => {
      const testProduct = global.testUtils.createTestProduct();
      
      const cart = new Cart({
        userId: testUser._id,
        items: [{
          productId: testProduct._id,
          name: testProduct.name,
          price: testProduct.price,
          quantity: 2
        }]
      });

      cart.removeItem(testProduct._id);

      expect(cart.items).toHaveLength(0);
    });

    test('should update item quantity', async () => {
      const testProduct = global.testUtils.createTestProduct();
      
      const cart = new Cart({
        userId: testUser._id,
        items: [{
          productId: testProduct._id,
          name: testProduct.name,
          price: testProduct.price,
          quantity: 2
        }]
      });

      cart.updateItemQuantity(testProduct._id, 5);

      expect(cart.items[0].quantity).toBe(5);
    });

    test('should remove item when quantity is set to 0', async () => {
      const testProduct = global.testUtils.createTestProduct();
      
      const cart = new Cart({
        userId: testUser._id,
        items: [{
          productId: testProduct._id,
          name: testProduct.name,
          price: testProduct.price,
          quantity: 2
        }]
      });

      cart.updateItemQuantity(testProduct._id, 0);

      expect(cart.items).toHaveLength(0);
    });

    test('should calculate total amount correctly', async () => {
      const product1 = { ...global.testUtils.createTestProduct(), price: 10.00 };
      const product2 = { ...global.testUtils.createTestProduct(), _id: new mongoose.Types.ObjectId(), price: 20.00 };
      
      const cart = new Cart({
        userId: testUser._id,
        items: [
          {
            productId: product1._id,
            name: product1.name,
            price: product1.price,
            quantity: 2 
          },
          {
            productId: product2._id,
            name: product2.name,
            price: product2.price,
            quantity: 1 
          }
        ]
      });

      cart.calculateTotal();

      expect(cart.totalAmount).toBe(40.00);
    });

    test('should clear all items from cart', async () => {
      const testProduct = global.testUtils.createTestProduct();
      
      const cart = new Cart({
        userId: testUser._id,
        items: [{
          productId: testProduct._id,
          name: testProduct.name,
          price: testProduct.price,
          quantity: 2
        }]
      });

      cart.clearCart();

      expect(cart.items).toHaveLength(0);
      expect(cart.totalAmount).toBe(0);
    });
  });
});