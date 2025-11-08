const OrderService = require('../modules/orders/orderService');

describe('OrderService Unit Tests', () => {
  describe('getAllOrders', () => {
    test('should return all orders', () => {
      const orders = OrderService.getAllOrders();
      expect(Array.isArray(orders)).toBe(true);
      expect(orders.length).toBeGreaterThan(0);
    });
  });

  describe('getOrderById', () => {
    test('should return order by valid id', () => {
      const order = OrderService.getOrderById(1);
      expect(order).toHaveProperty('id', 1);
      expect(order).toHaveProperty('userId');
      expect(order).toHaveProperty('items');
    });

    test('should throw error for invalid id', () => {
      expect(() => OrderService.getOrderById(999))
        .toThrow('Order not found');
    });
  });

  describe('getOrdersByUserId', () => {
    test('should return orders for valid user', () => {
      const orders = OrderService.getOrdersByUserId(1);
      expect(Array.isArray(orders)).toBe(true);
      orders.forEach(order => {
        expect(order.userId).toBe(1);
      });
    });

    test('should return empty array for user with no orders', () => {
      const orders = OrderService.getOrdersByUserId(999);
      expect(orders).toEqual([]);
    });
  });

  describe('createOrder', () => {
    test('should create order with valid data', () => {
      const orderData = {
        userId: 1,
        items: [{ productId: 1, quantity: 2 }]
      };
      
      const order = OrderService.createOrder(orderData);
      expect(order).toHaveProperty('id');
      expect(order.userId).toBe(1);
      expect(order.items).toHaveLength(1);
      expect(order.total).toBeGreaterThan(0);
    });

    test('should throw error with missing userId', () => {
      const orderData = {
        items: [{ productId: 1, quantity: 2 }]
      };
      
      expect(() => OrderService.createOrder(orderData))
        .toThrow('User ID and items are required');
    });

    test('should throw error with empty items', () => {
      const orderData = {
        userId: 1,
        items: []
      };
      
      expect(() => OrderService.createOrder(orderData))
        .toThrow('User ID and items are required');
    });

    test('should throw error with invalid item data', () => {
      const orderData = {
        userId: 1,
        items: [{ productId: 1 }] // missing quantity
      };
      
      expect(() => OrderService.createOrder(orderData))
        .toThrow('Invalid item data');
    });
  });

  describe('updateOrderStatus', () => {
    test('should update order status with valid status', () => {
      const updatedOrder = OrderService.updateOrderStatus(1, 'shipped');
      expect(updatedOrder.status).toBe('shipped');
    });

    test('should throw error with invalid status', () => {
      expect(() => OrderService.updateOrderStatus(1, 'invalid-status'))
        .toThrow('Invalid status');
    });

    test('should throw error for non-existent order', () => {
      expect(() => OrderService.updateOrderStatus(999, 'shipped'))
        .toThrow('Order not found');
    });
  });

  describe('calculateOrderTotal', () => {
    test('should calculate correct total', () => {
      const items = [{ productId: 1, quantity: 2 }];
      const total = OrderService.calculateOrderTotal(items);
      expect(total).toBe(1999.98);
    });
  });
});