const request = require('supertest');
const app = require('../app');

describe('End-to-End Workflow Tests', () => {
  let authToken;
  let createdProductId;
  let createdOrderId;

  describe('Complete User Journey', () => {
    test('Should complete full e2e workflow: register -> login -> create product -> create order', async () => {
      // 1. Register new user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'e2e@test.com',
          password: 'password123'
        })
        .expect(201);

      expect(registerResponse.body.email).toBe('e2e@test.com');

      // 2. Login with new user
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'e2e@test.com',
          password: 'password123'
        })
        .expect(200);

      authToken = loginResponse.body.token;
      expect(authToken).toBeDefined();

      // 3. Create a product
      const productResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'E2E Test Product',
          price: 99.99,
          category: 'Test',
          stock: 10
        })
        .expect(201);

      createdProductId = productResponse.body.id;
      expect(productResponse.body.name).toBe('E2E Test Product');

      // 4. Create an order with the product
      const orderResponse = await request(app)
        .post('/api/orders')
        .send({
          userId: registerResponse.body.id,
          items: [{ productId: createdProductId, quantity: 2 }]
        })
        .expect(201);

      createdOrderId = orderResponse.body.id;
      expect(orderResponse.body.total).toBe(199.98);

      // 5. Update order status
      const statusResponse = await request(app)
        .patch(`/api/orders/${createdOrderId}/status`)
        .send({ status: 'shipped' })
        .expect(200);

      expect(statusResponse.body.status).toBe('shipped');
    });

    test('Should handle error scenarios in workflow', async () => {
      // Try to create order with insufficient stock
      await request(app)
        .post('/api/orders')
        .send({
          userId: 1,
          items: [{ productId: 1, quantity: 1000 }] // More than available stock
        })
        .expect(400);

      // Try to access non-existent resources
      await request(app)
        .get('/api/products/999')
        .expect(404);

      await request(app)
        .get('/api/orders/999')
        .expect(404);
    });
  });
});