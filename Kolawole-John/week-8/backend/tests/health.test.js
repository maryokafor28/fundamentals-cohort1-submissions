const request = require('supertest');
const app = require('../src/app');

describe('Health Check Endpoints', () => {
  test('GET /api/health returns 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
  });

  test('GET /api/status returns service info', async () => {
    const response = await request(app).get('/api/status');
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('GET /api/metrics returns Prometheus metrics', async () => {
    const response = await request(app).get('/api/metrics');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('http_requests_total');
  });
});