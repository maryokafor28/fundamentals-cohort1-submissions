const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/models/db');

describe('Product Routes - Integration Tests', () => {
  let authToken;

  beforeEach(async () => {
    db.clear();

    // Register and login a user
    await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    authToken = loginResponse.body.data.token;
  });

  describe('POST /api/products', () => {
    it('should create a product with valid data', async () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(productData.name);
      expect(response.body.data.price).toBe(productData.price);
    });

    it('should return 401 without auth token', async () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid data', async () => {
      const productData = {
        name: '',
        description: 'A test product',
        price: -10,
        stock: 50,
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Product 1',
          description: 'Description 1',
          price: 10,
          stock: 5,
        });

      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Product 2',
          description: 'Description 2',
          price: 20,
          stock: 10,
        });
    });

    it('should return all products', async () => {
      const response = await request(app).get('/api/products').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should not require authentication', async () => {
      const response = await request(app).get('/api/products').expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          description: 'A test product',
          price: 99.99,
          stock: 50,
        });

      productId = createResponse.body.data.id;
    });

    it('should return product by ID', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(productId);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app).get('/api/products/999').expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/products/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          description: 'A test product',
          price: 99.99,
          stock: 50,
        });

      productId = createResponse.body.data.id;
    });

    it('should update product successfully', async () => {
      const updates = {
        price: 149.99,
        stock: 75,
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.price).toBe(updates.price);
      expect(response.body.data.stock).toBe(updates.stock);
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send({ price: 149.99 })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .put('/api/products/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ price: 149.99 })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          description: 'A test product',
          price: 99.99,
          stock: 50,
        });

      productId = createResponse.body.data.id;
    });

    it('should delete product successfully', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify product is deleted
      await request(app).get(`/api/products/${productId}`).expect(404);
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .delete('/api/products/999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
