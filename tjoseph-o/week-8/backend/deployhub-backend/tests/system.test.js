
const request = require('supertest');

describe('System Tests', () => {
  let app;
  let server;

  beforeAll(() => {
    
    app = require('../src/app');
  });

  afterAll((done) => {
   
    if (server && server.close) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('Health Check', () => {
    it('should return 200 OK', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'healthy');
    });
  });

  describe('Metrics', () => {
    it('should return metrics', async () => {
      const response = await request(app)
        .get('/api/metrics')
        .expect(200);
      
      expect(response.text).toContain('# HELP');
    });
  });
});