const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models/db');

describe('E2E Workflow Tests', () => {
  beforeEach(() => {
    db.clear();
  });

  describe('Complete Order Workflow', () => {
    it('should complete full user registration -> product creation -> order placement workflow', async () => {
      // Step 1: Register a user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(registerResponse.body.success).toBe(true);

      // Step 2: Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        })
        .expect(200);

      const authToken = loginResponse.body.data.token;
      expect(authToken).toBeDefined();

      // Step 3: Create a product
      const productResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Laptop',
          description: 'High-performance laptop',
          price: 1299.99,
          stock: 10,
        })
        .expect(201);

      const productId = productResponse.body.data.id;
      expect(productId).toBeDefined();

      // Step 4: Verify product is publicly available
      const getProductResponse = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(getProductResponse.body.data.name).toBe('Laptop');

      // Step 5: Create an order
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [
            {
              productId: productId,
              quantity: 2,
            },
          ],
        })
        .expect(201);

      expect(orderResponse.body.data.totalAmount).toBe(2599.98);
      expect(orderResponse.body.data.status).toBe('pending');

      // Step 6: Verify stock was reduced
      const updatedProductResponse = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(updatedProductResponse.body.data.stock).toBe(8);

      // Step 7: Get user's orders
      const ordersResponse = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(ordersResponse.body.data).toHaveLength(1);
      expect(ordersResponse.body.data[0].totalAmount).toBe(2599.98);
    });

    it('should handle order cancellation and stock restoration', async () => {
      // Setup: Register, login, create product
      await request(app).post('/api/auth/register').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: 'jane@example.com',
        password: 'password123',
      });

      const authToken = loginResponse.body.data.token;

      const productResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Phone',
          description: 'Smartphone',
          price: 799.99,
          stock: 20,
        });

      const productId = productResponse.body.data.id;

      // Create an order
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId, quantity: 5 }],
        });

      const orderId = orderResponse.body.data.id;

      // Verify stock reduced
      const productAfterOrder = await request(app).get(
        `/api/products/${productId}`
      );
      expect(productAfterOrder.body.data.stock).toBe(15);

      // Cancel the order
      const cancelResponse = await request(app)
        .post(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(cancelResponse.body.data.status).toBe('cancelled');

      // Verify stock restored
      const productAfterCancel = await request(app).get(
        `/api/products/${productId}`
      );
      expect(productAfterCancel.body.data.stock).toBe(20);
    });
  });

  describe('Multi-User Scenarios', () => {
    it('should handle multiple users ordering from same product', async () => {
      // Create first user
      await request(app).post('/api/auth/register').send({
        name: 'User One',
        email: 'user1@example.com',
        password: 'password123',
      });

      const login1 = await request(app).post('/api/auth/login').send({
        email: 'user1@example.com',
        password: 'password123',
      });

      const token1 = login1.body.data.token;

      // Create second user
      await request(app).post('/api/auth/register').send({
        name: 'User Two',
        email: 'user2@example.com',
        password: 'password123',
      });

      const login2 = await request(app).post('/api/auth/login').send({
        email: 'user2@example.com',
        password: 'password123',
      });

      const token2 = login2.body.data.token;

      // User 1 creates a product
      const productResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          name: 'Shared Product',
          description: 'Available to all',
          price: 49.99,
          stock: 10,
        });

      const productId = productResponse.body.data.id;

      // Both users place orders
      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token1}`)
        .send({ items: [{ productId, quantity: 3 }] })
        .expect(201);

      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token2}`)
        .send({ items: [{ productId, quantity: 4 }] })
        .expect(201);

      // Verify final stock
      const finalProduct = await request(app).get(`/api/products/${productId}`);
      expect(finalProduct.body.data.stock).toBe(3);

      // Verify each user sees only their orders
      const user1Orders = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token1}`);

      const user2Orders = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token2}`);

      expect(user1Orders.body.data).toHaveLength(1);
      expect(user2Orders.body.data).toHaveLength(1);
      expect(user1Orders.body.data[0].items[0].quantity).toBe(3);
      expect(user2Orders.body.data[0].items[0].quantity).toBe(4);
    });
  });

  describe('Error Handling in Workflows', () => {
    it('should prevent order when stock is insufficient', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      const authToken = loginResponse.body.data.token;

      const productResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Limited Product',
          description: 'Only 5 available',
          price: 99.99,
          stock: 5,
        });

      const productId = productResponse.body.data.id;

      // Try to order more than available
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          items: [{ productId, quantity: 10 }],
        })
        .expect(400);

      expect(orderResponse.body.success).toBe(false);
      expect(orderResponse.body.message).toContain('Insufficient stock');

      // Verify stock unchanged
      const productCheck = await request(app).get(`/api/products/${productId}`);
      expect(productCheck.body.data.stock).toBe(5);
    });

    it('should prevent unauthorized access to other users orders', async () => {
      // Create two users
      await request(app).post('/api/auth/register').send({
        name: 'User One',
        email: 'user1@example.com',
        password: 'password123',
      });

      await request(app).post('/api/auth/register').send({
        name: 'User Two',
        email: 'user2@example.com',
        password: 'password123',
      });

      const login1 = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user1@example.com', password: 'password123' });

      const login2 = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user2@example.com', password: 'password123' });

      const token1 = login1.body.data.token;
      const token2 = login2.body.data.token;

      // User 1 creates product
      const product = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          name: 'Product',
          description: 'Test',
          price: 50,
          stock: 10,
        });

      // User 1 creates order
      const order = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token1}`)
        .send({ items: [{ productId: product.body.data.id, quantity: 1 }] });

      const orderId = order.body.data.id;

      // User 2 tries to access User 1's order
      const unauthorizedAccess = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(403);

      expect(unauthorizedAccess.body.success).toBe(false);
      expect(unauthorizedAccess.body.message).toContain('Access denied');
    });
  });
});
