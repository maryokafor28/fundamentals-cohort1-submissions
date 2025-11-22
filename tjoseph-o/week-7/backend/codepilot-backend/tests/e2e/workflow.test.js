const request = require('supertest');
const app = require('../../src/app');
const { authenticatedRequest } = require('../helpers');

describe('E2E - Complete Order Workflow', () => {
  let token;
  let userId;

  describe('Complete user journey: Register -> Create Products -> Place Order -> Track Order', () => {
    it('should complete full e-commerce workflow', async () => {
      // Step 1: Register a new user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'securepass123'
        })
        .expect(201);

      expect(registerResponse.body.status).toBe('success');
      token = registerResponse.body.data.token;
      userId = registerResponse.body.data.user.id;

      // Step 2: Create multiple products
      const product1Response = await authenticatedRequest('post', '/api/products', token)
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 1299.99,
          stock: 50,
          category: 'Electronics'
        })
        .expect(201);

      const product2Response = await authenticatedRequest('post', '/api/products', token)
        .send({
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse',
          price: 29.99,
          stock: 100,
          category: 'Electronics'
        })
        .expect(201);

      const product1Id = product1Response.body.data.product.id;
      const product2Id = product2Response.body.data.product.id;

      // Step 3: View all products
      const productsResponse = await authenticatedRequest('get', '/api/products', token)
        .expect(200);

      expect(productsResponse.body.results).toBe(2);

      // Step 4: Filter products by category
      const electronicsResponse = await authenticatedRequest(
        'get',
        '/api/products?category=Electronics',
        token
      ).expect(200);

      expect(electronicsResponse.body.results).toBe(2);

      // Step 5: Create an order with multiple items
      const orderResponse = await authenticatedRequest('post', '/api/orders', token)
        .send({
          items: [
            { productId: product1Id, quantity: 1 },
            { productId: product2Id, quantity: 2 }
          ],
          shippingAddress: '456 Main St, Tech City, TC 12345'
        })
        .expect(201);

      const orderId = orderResponse.body.data.order.id;
      const expectedTotal = 1299.99 + (29.99 * 2);
      
      expect(orderResponse.body.data.order.totalAmount).toBeCloseTo(expectedTotal, 2);
      expect(orderResponse.body.data.order.status).toBe('pending');
      expect(orderResponse.body.data.order.items).toHaveLength(2);

      // Step 6: Verify product stock was decreased
      const product1Updated = await authenticatedRequest('get', `/api/products/${product1Id}`, token)
        .expect(200);
      const product2Updated = await authenticatedRequest('get', `/api/products/${product2Id}`, token)
        .expect(200);

      expect(product1Updated.body.data.product.stock).toBe(49);
      expect(product2Updated.body.data.product.stock).toBe(98);

      // Step 7: View user's orders
      const ordersResponse = await authenticatedRequest('get', '/api/orders', token)
        .expect(200);

      expect(ordersResponse.body.results).toBe(1);
      expect(ordersResponse.body.data.orders[0].id).toBe(orderId);

      // Step 8: Get specific order details
      const orderDetailResponse = await authenticatedRequest('get', `/api/orders/${orderId}`, token)
        .expect(200);

      expect(orderDetailResponse.body.data.order.status).toBe('pending');

      // Step 9: Update order status to processing
      const processingResponse = await authenticatedRequest('patch', `/api/orders/${orderId}/status`, token)
        .send({ status: 'processing' })
        .expect(200);

      expect(processingResponse.body.data.order.status).toBe('processing');

      // Step 10: Update order status to shipped
      const shippedResponse = await authenticatedRequest('patch', `/api/orders/${orderId}/status`, token)
        .send({ status: 'shipped' })
        .expect(200);

      expect(shippedResponse.body.data.order.status).toBe('shipped');

      // Step 11: Update order status to delivered
      const deliveredResponse = await authenticatedRequest('patch', `/api/orders/${orderId}/status`, token)
        .send({ status: 'delivered' })
        .expect(200);

      expect(deliveredResponse.body.data.order.status).toBe('delivered');

      // Step 12: Attempt to cancel delivered order (should fail)
      await authenticatedRequest('post', `/api/orders/${orderId}/cancel`, token)
        .expect(400);

      // Step 13: Get order statistics
      const statsResponse = await authenticatedRequest('get', '/api/orders/stats', token)
        .expect(200);

      expect(statsResponse.body.data.stats.total).toBe(1);
      expect(statsResponse.body.data.stats.byStatus.delivered).toBe(1);
      expect(statsResponse.body.data.stats.totalRevenue).toBeCloseTo(expectedTotal, 2);

      // Step 14: Get user profile
      const profileResponse = await authenticatedRequest('get', '/api/auth/profile', token)
        .expect(200);

      expect(profileResponse.body.data.user.email).toBe('jane@example.com');
    });
  });

  describe('Order cancellation workflow', () => {
    it('should handle order cancellation and stock restoration', async () => {
      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Smith',
          email: 'john.smith@example.com',
          password: 'password123'
        })
        .expect(201);

      token = registerResponse.body.data.token;

      // Create product
      const productResponse = await authenticatedRequest('post', '/api/products', token)
        .send({
          name: 'Gaming Console',
          description: 'Latest gaming console',
          price: 499.99,
          stock: 20,
          category: 'Electronics'
        })
        .expect(201);

      const productId = productResponse.body.data.product.id;

      // Create order
      const orderResponse = await authenticatedRequest('post', '/api/orders', token)
        .send({
          items: [{ productId, quantity: 5 }],
          shippingAddress: '789 Gaming Ave, Game City'
        })
        .expect(201);

      const orderId = orderResponse.body.data.order.id;

      // Verify stock decreased
      const productAfterOrder = await authenticatedRequest('get', `/api/products/${productId}`, token)
        .expect(200);
      expect(productAfterOrder.body.data.product.stock).toBe(15);

      // Cancel order
      await authenticatedRequest('post', `/api/orders/${orderId}/cancel`, token)
        .expect(200);

      // Verify stock restored
      const productAfterCancel = await authenticatedRequest('get', `/api/products/${productId}`, token)
        .expect(200);
      expect(productAfterCancel.body.data.product.stock).toBe(20);

      // Verify order status
      const cancelledOrder = await authenticatedRequest('get', `/api/orders/${orderId}`, token)
        .expect(200);
      expect(cancelledOrder.body.data.order.status).toBe('cancelled');
    });
  });

  describe('Multiple users workflow', () => {
    it('should handle multiple users with separate orders', async () => {
      // Register first user
      const user1Response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User One',
          email: 'user1@example.com',
          password: 'password123'
        })
        .expect(201);

      const token1 = user1Response.body.data.token;

      // Register second user
      const user2Response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User Two',
          email: 'user2@example.com',
          password: 'password123'
        })
        .expect(201);

      const token2 = user2Response.body.data.token;

      // User 1 creates a product
      const productResponse = await authenticatedRequest('post', '/api/products', token1)
        .send({
          name: 'Shared Product',
          description: 'Product for testing',
          price: 99.99,
          stock: 100,
          category: 'Test'
        })
        .expect(201);

      const productId = productResponse.body.data.product.id;

      // User 1 creates an order
      const order1Response = await authenticatedRequest('post', '/api/orders', token1)
        .send({
          items: [{ productId, quantity: 3 }],
          shippingAddress: 'User 1 Address'
        })
        .expect(201);

      const order1Id = order1Response.body.data.order.id;

      // User 2 creates an order
      const order2Response = await authenticatedRequest('post', '/api/orders', token2)
        .send({
          items: [{ productId, quantity: 2 }],
          shippingAddress: 'User 2 Address'
        })
        .expect(201);

      const order2Id = order2Response.body.data.order.id;

      // User 1 should only see their order
      const user1Orders = await authenticatedRequest('get', '/api/orders', token1)
        .expect(200);
      expect(user1Orders.body.results).toBe(1);
      expect(user1Orders.body.data.orders[0].id).toBe(order1Id);

      // User 2 should only see their order
      const user2Orders = await authenticatedRequest('get', '/api/orders', token2)
        .expect(200);
      expect(user2Orders.body.results).toBe(1);
      expect(user2Orders.body.data.orders[0].id).toBe(order2Id);

      
      await authenticatedRequest('get', `/api/orders/${order1Id}`, token2)
        .expect(403);

      
      const finalProduct = await authenticatedRequest('get', `/api/products/${productId}`, token1)
        .expect(200);
      expect(finalProduct.body.data.product.stock).toBe(95); 
    });
  });
});