import request from 'supertest';
import app, { initializeServices } from '../../app';
import { legacyApiService } from '../../services/legacyApiServices';
import { cacheService } from '../../services/cacheServices';

/**
 * Integration Tests for V2 Payment Routes
 * 
 * These tests demonstrate:
 * - API endpoint testing
 * - Mocking external services
 * - Testing error scenarios
 * - Validating response structures
 */

// Mock the services
jest.mock('../../services/legacyApiService');
jest.mock('../../services/cacheService');

describe('V2 Payments API', () => {
  beforeAll(async () => {
    await initializeServices();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v2/payments', () => {
    it('should return paginated payments in modern format', async () => {
      // Mock data
      const mockLegacyPayments = [
        { id: 1, userId: 1, title: 'Payment 1', body: 'Description 1' },
        { id: 2, userId: 1, title: 'Payment 2', body: 'Description 2' },
      ];

      // Mock service call
      (legacyApiService.fetchPayments as jest.Mock).mockResolvedValue(
        mockLegacyPayments
      );
      (cacheService.get as jest.Mock).mockResolvedValue(null);

      // Make request
      const response = await request(app)
        .get('/api/v2/payments')
        .query({ page: 1, limit: 10 })
        .expect(200);

      // Assertions
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toMatchObject({
        id: expect.stringContaining('PAY-'),
        customerId: expect.stringContaining('CUST-'),
        description: expect.any(String),
        amount: expect.any(Number),
        status: expect.stringMatching(/pending|completed|failed/),
        currency: 'USD',
      });
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
      expect(response.body.metadata).toMatchObject({
        timestamp: expect.any(String),
        version: 'v2',
        cached: expect.any(Boolean),
      });
    });

    it('should filter payments by status', async () => {
      const mockLegacyPayments = [
        { id: 1, userId: 1, title: 'Payment 1', body: 'Description 1' },
        { id: 2, userId: 1, title: 'Payment 2', body: 'Description 2' },
        { id: 3, userId: 1, title: 'Payment 3', body: 'Description 3' },
      ];

      (legacyApiService.fetchPayments as jest.Mock).mockResolvedValue(
        mockLegacyPayments
      );

      const response = await request(app)
        .get('/api/v2/payments')
        .query({ status: 'completed' })
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((payment: any) => {
        expect(payment.status).toBe('completed');
      });
    });

    it('should return cached data when available', async () => {
      const cachedPayments = [
        { id: 'PAY-000001', customerId: 'CUST-000001', amount: 100 },
      ];

      (cacheService.get as jest.Mock).mockResolvedValue(cachedPayments);

      const response = await request(app)
        .get('/api/v2/payments')
        .expect(200);

      expect(response.body.metadata.cached).toBe(true);
      expect(legacyApiService.fetchPayments).not.toHaveBeenCalled();
    });

    it('should validate pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v2/payments')
        .query({ page: -1, limit: 1000 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('BAD_REQUEST');
    });

    it('should handle legacy API errors gracefully', async () => {
      (legacyApiService.fetchPayments as jest.Mock).mockRejectedValue(
        new Error('Legacy API unavailable')
      );

      const response = await request(app)
        .get('/api/v2/payments')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/v2/payments/:id', () => {
    it('should return single payment with customer data', async () => {
      const mockPayment = {
        id: 1,
        userId: 1,
        title: 'Test Payment',
        body: 'Description',
      };

      const mockCustomer = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        address: {
          street: '123 Main St',
          suite: 'Apt 1',
          city: 'New York',
          zipcode: '10001',
          geo: { lat: '40.7128', lng: '-74.0060' },
        },
        phone: '555-1234',
        website: 'example.com',
        company: {
          name: 'Acme Corp',
          catchPhrase: 'Innovative solutions',
          bs: 'tech',
        },
      };

      (legacyApiService.fetchPaymentById as jest.Mock).mockResolvedValue(
        mockPayment
      );
      (legacyApiService.fetchCustomerById as jest.Mock).mockResolvedValue(
        mockCustomer
      );

      const response = await request(app)
        .get('/api/v2/payments/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('PAY-000001');
      expect(response.body.data.customer).toBeDefined();
      expect(response.body.data.customer.fullName).toBe('John Doe');
    });

    it('should return 404 for non-existent payment', async () => {
      (legacyApiService.fetchPaymentById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v2/payments/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should validate ID parameter', async () => {
      const response = await request(app)
        .get('/api/v2/payments/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v2/payments/stats', () => {
    it('should return payment statistics', async () => {
      const mockPayments = [
        { id: 1, userId: 1, title: 'Payment 1', body: 'Desc 1' },
        { id: 2, userId: 1, title: 'Payment 2', body: 'Desc 2' },
      ];

      (legacyApiService.fetchPayments as jest.Mock).mockResolvedValue(
        mockPayments
      );

      const response = await request(app)
        .get('/api/v2/payments/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        total: expect.any(Number),
        completed: expect.any(Number),
        pending: expect.any(Number),
        failed: expect.any(Number),
        totalAmount: expect.any(Number),
        averageAmount: expect.any(Number),
      });
      expect(response.body.data.recentPayments).toBeInstanceOf(Array);
    });
  });
});