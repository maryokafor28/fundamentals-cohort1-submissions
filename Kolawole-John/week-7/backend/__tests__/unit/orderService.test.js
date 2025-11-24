const orderService = require('../../src/services/orderService');
const productService = require('../../src/services/productService');
const authService = require('../../src/services/authService');
const db = require('../../src/models/db');

describe('OrderService - Unit Tests', () => {
  let testUser;
  let testProduct;

  beforeEach(async () => {
    db.clear();

    // Create test user
    testUser = await authService.register({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    // Create test product
    testProduct = productService.createProduct({
      name: 'Test Product',
      description: 'A test product',
      price: 99.99,
      stock: 100,
    });
  });

  describe('createOrder()', () => {
    it('should create an order successfully', async () => {
      const items = [
        {
          productId: testProduct.id,
          quantity: 2,
        },
      ];

      const order = await orderService.createOrder(testUser.id, items);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.userId).toBe(testUser.id);
      expect(order.items).toHaveLength(1);
      expect(order.totalAmount).toBe(199.98);
      expect(order.status).toBe('pending');
    });

    it('should reduce product stock after order creation', async () => {
      const items = [
        {
          productId: testProduct.id,
          quantity: 10,
        },
      ];

      await orderService.createOrder(testUser.id, items);
      const product = productService.getProductById(testProduct.id);

      expect(product.stock).toBe(90);
    });

    it('should throw error if user not found', async () => {
      const items = [{ productId: testProduct.id, quantity: 2 }];

      await expect(orderService.createOrder(999, items)).rejects.toThrow(
        'User not found'
      );
    });

    it('should throw error if items array is empty', async () => {
      await expect(orderService.createOrder(testUser.id, [])).rejects.toThrow(
        'Order must contain at least one item'
      );
    });

    it('should throw error if insufficient stock', async () => {
      const items = [
        {
          productId: testProduct.id,
          quantity: 150,
        },
      ];

      await expect(orderService.createOrder(testUser.id, items)).rejects.toThrow(
        'Insufficient stock'
      );
    });

    it('should calculate total correctly for multiple items', async () => {
      const product2 = productService.createProduct({
        name: 'Product 2',
        description: 'Second product',
        price: 50.0,
        stock: 100,
      });

      const items = [
        { productId: testProduct.id, quantity: 2 },
        { productId: product2.id, quantity: 3 },
      ];

      const order = await orderService.createOrder(testUser.id, items);

      expect(order.totalAmount).toBe(349.98); // (99.99 * 2) + (50.00 * 3)
      expect(order.items).toHaveLength(2);
    });
  });

  describe('getAllOrders()', () => {
    it('should return all orders', async () => {
      await orderService.createOrder(testUser.id, [
        { productId: testProduct.id, quantity: 1 },
      ]);

      const orders = orderService.getAllOrders();

      expect(orders).toHaveLength(1);
    });

    it('should return empty array when no orders exist', () => {
      const orders = orderService.getAllOrders();

      expect(orders).toEqual([]);
    });
  });

  describe('getOrderById()', () => {
    it('should return order by ID', async () => {
      const created = await orderService.createOrder(testUser.id, [
        { productId: testProduct.id, quantity: 1 },
      ]);

      const order = orderService.getOrderById(created.id);

      expect(order).toBeDefined();
      expect(order.id).toBe(created.id);
    });

    it('should throw error if order not found', () => {
      expect(() => orderService.getOrderById(999)).toThrow('Order not found');
    });
  });

  describe('getOrdersByUserId()', () => {
    it('should return all orders for a user', async () => {
      await orderService.createOrder(testUser.id, [
        { productId: testProduct.id, quantity: 1 },
      ]);
      await orderService.createOrder(testUser.id, [
        { productId: testProduct.id, quantity: 2 },
      ]);

      const orders = orderService.getOrdersByUserId(testUser.id);

      expect(orders).toHaveLength(2);
      expect(orders[0].userId).toBe(testUser.id);
    });

    it('should return empty array if user has no orders', () => {
      const orders = orderService.getOrdersByUserId(999);

      expect(orders).toEqual([]);
    });
  });

  describe('updateOrderStatus()', () => {
    it('should update order status successfully', async () => {
      const order = await orderService.createOrder(testUser.id, [
        { productId: testProduct.id, quantity: 1 },
      ]);

      const updated = orderService.updateOrderStatus(order.id, 'shipped');

      expect(updated.status).toBe('shipped');
    });

    it('should throw error for invalid status', async () => {
      const order = await orderService.createOrder(testUser.id, [
        { productId: testProduct.id, quantity: 1 },
      ]);

      expect(() =>
        orderService.updateOrderStatus(order.id, 'invalid-status')
      ).toThrow('Invalid order status');
    });

    it('should throw error if order not found', () => {
      expect(() => orderService.updateOrderStatus(999, 'shipped')).toThrow(
        'Order not found'
      );
    });
  });

  describe('cancelOrder()', () => {
    it('should cancel pending order and restore stock', async () => {
      const order = await orderService.createOrder(testUser.id, [
        { productId: testProduct.id, quantity: 10 },
      ]);

      const initialStock = productService.getProductById(testProduct.id).stock;
      const cancelled = orderService.cancelOrder(order.id);

      expect(cancelled.status).toBe('cancelled');

      const finalStock = productService.getProductById(testProduct.id).stock;
      expect(finalStock).toBe(initialStock + 10);
    });

    it('should throw error if order is not pending', async () => {
      const order = await orderService.createOrder(testUser.id, [
        { productId: testProduct.id, quantity: 1 },
      ]);

      orderService.updateOrderStatus(order.id, 'shipped');

      expect(() => orderService.cancelOrder(order.id)).toThrow(
        'Only pending orders can be cancelled'
      );
    });

    it('should throw error if order not found', () => {
      expect(() => orderService.cancelOrder(999)).toThrow('Order not found');
    });
  });

  describe('getOrderStatistics()', () => {
    it('should calculate statistics correctly', async () => {
      await orderService.createOrder(testUser.id, [
        { productId: testProduct.id, quantity: 2 },
      ]);
      await orderService.createOrder(testUser.id, [
        { productId: testProduct.id, quantity: 1 },
      ]);

      const stats = orderService.getOrderStatistics(testUser.id);

      expect(stats.total).toBe(2);
      expect(stats.totalRevenue).toBe(299.97); // (99.99 * 2) + (99.99 * 1)
      expect(stats.byStatus.pending).toBe(2);
    });

    it('should return zero stats when no orders exist', () => {
      const stats = orderService.getOrderStatistics(testUser.id);

      expect(stats.total).toBe(0);
      expect(stats.totalRevenue).toBe(0);
    });

    it('should calculate global stats when userId is null', async () => {
      const user2 = await authService.register({
        name: 'User 2',
        email: 'user2@example.com',
        password: 'password123',
      });

      await orderService.createOrder(testUser.id, [
        { productId: testProduct.id, quantity: 1 },
      ]);
      await orderService.createOrder(user2.id, [
        { productId: testProduct.id, quantity: 1 },
      ]);

      const stats = orderService.getOrderStatistics();

      expect(stats.total).toBe(2);
    });
  });
});
