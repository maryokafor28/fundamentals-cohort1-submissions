const request = require('supertest');
const app = require('../app');

describe('API Integration Tests', () => {
  describe('Health Check', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Auth API', () => {
    test('POST /api/auth/login should login successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'password'
        })
        .expect(200);
      
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('admin@test.com');
    });

    test('POST /api/auth/login should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword'
        })
        .expect(401);
      
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    test('POST /api/auth/register should create new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'integration@test.com',
          password: 'password123'
        })
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('integration@test.com');
    });
  });

  describe('Products API', () => {
    test('GET /api/products should return all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /api/products/:id should return specific product', async () => {
      const response = await request(app)
        .get('/api/products/1')
        .expect(200);
      
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
    });

    test('POST /api/products should create new product', async () => {
      const productData = {
        name: 'Integration Test Product',
        price: 199.99,
        category: 'Test',
        stock: 5
      };
      
      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);
      
      expect(response.body.name).toBe('Integration Test Product');
      expect(response.body.price).toBe(199.99);
    });

    test('PUT /api/products/:id should update product', async () => {
      const response = await request(app)
        .put('/api/products/1')
        .send({ name: 'Updated Integration Laptop' })
        .expect(200);
      
      expect(response.body.name).toBe('Updated Integration Laptop');
    });
  });

  describe('Orders API', () => {
    test('GET /api/orders should return all orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/orders should create new order', async () => {
      const orderData = {
        userId: 1,
        items: [{ productId: 1, quantity: 1 }]
      };
      
      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.userId).toBe(1);
      expect(response.body.total).toBeGreaterThan(0);
    });

    test('PATCH /api/orders/:id/status should update order status', async () => {
      const response = await request(app)
        .patch('/api/orders/1/status')
        .send({ status: 'processing' })
        .expect(200);
      
      expect(response.body.status).toBe('processing');
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Route not found');
    });

    test('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/999')
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Product not found');
    });
  });
});