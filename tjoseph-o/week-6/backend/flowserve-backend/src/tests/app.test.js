const request = require('supertest');
const app = require('../app');

describe('Express Application Tests', () => {

  describe('Health Check Endpoint', () => {
    test('GET /health should return 200 status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    test('GET /health should return OK status', async () => {
      const response = await request(app).get('/health');
      expect(response.body.status).toBe('OK');
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
    });
  });

  describe('Middleware Configuration', () => {
    test('should parse JSON request bodies', async () => {
      const response = await request(app)
        .post('/test-json')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');
      
      // Should not return 400 (bad request) if JSON parsing works
      expect(response.status).not.toBe(400);
    });

    test('should have security headers', async () => {
      const response = await request(app).get('/health');
      expect(response.headers).toHaveProperty('x-content-type-options');
    });
  });

});