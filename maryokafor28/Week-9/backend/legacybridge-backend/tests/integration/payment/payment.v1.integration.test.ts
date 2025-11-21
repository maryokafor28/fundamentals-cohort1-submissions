import request from "supertest";
import app from "../../../src/config/app.config";
import { legacyService } from "../../../src/services/legacy.service";
import { LegacyError } from "../../../src/errors/LegacyError";
import config from "../../../src/config/env.config";

// Mock the legacy service (the only external dependency)
jest.mock("../../../src/services/legacy.service.ts");

describe("Payment Integration Tests", () => {
  const baseUrl = `${config.api.versionPrefix}/v1/payments`;
  afterAll(() => {
    app.removeAllListeners();
    jest.clearAllTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/v1/payments", () => {
    it("should return all payments with 200 status", async () => {
      // Arrange: Mock legacy API response
      const mockLegacyPayments = [
        {
          payment_id: 1,
          amount_cents: 5000,
          currency_code: "USD",
          status_code: "completed",
          created_timestamp: "2024-01-15T10:00:00Z",
        },
        {
          payment_id: 2,
          amount_cents: 10000,
          currency_code: "EUR",
          status_code: "pending",
          created_timestamp: "2024-01-16T11:00:00Z",
        },
      ];

      (legacyService.fetchPayments as jest.Mock).mockResolvedValue(
        mockLegacyPayments
      );

      // Act: Make HTTP request
      const response = await request(app).get(baseUrl);

      // Assert: Verify response
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toEqual(mockLegacyPayments);
      expect(legacyService.fetchPayments).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no payments exist", async () => {
      (legacyService.fetchPayments as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get(baseUrl);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it("should handle legacy service errors with 503 status", async () => {
      const legacyError = new LegacyError("Legacy API is down");
      (legacyService.fetchPayments as jest.Mock).mockRejectedValue(legacyError);

      const response = await request(app).get(baseUrl);

      expect(response.status).toBe(503);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("status", 503);
      expect(response.body.message).toBe(
        "Legacy system is temporarily unavailable. Please try again later."
      );
      expect(response.body).toHaveProperty("source", "legacy-api");
    });

    it("should handle unexpected errors with 500 status", async () => {
      const unexpectedError = new Error("Database connection failed");
      (legacyService.fetchPayments as jest.Mock).mockRejectedValue(
        unexpectedError
      );

      const response = await request(app).get(baseUrl);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.status).toBe(500);
    });

    it("should include correct headers in response", async () => {
      (legacyService.fetchPayments as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get(baseUrl);

      expect(response.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("GET /api/v1/payments/:id", () => {
    it("should return a single payment with 200 status", async () => {
      const mockPaymentId = "123";
      const mockLegacyPayment = {
        payment_id: 123,
        amount_cents: 7500,
        currency_code: "USD",
        status_code: "completed",
        created_timestamp: "2024-01-15T10:00:00Z",
      };

      (legacyService.fetchPaymentById as jest.Mock).mockResolvedValue(
        mockLegacyPayment
      );

      const response = await request(app).get(`${baseUrl}/${mockPaymentId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockLegacyPayment);
      expect(legacyService.fetchPaymentById).toHaveBeenCalledWith(
        mockPaymentId
      );
      expect(legacyService.fetchPaymentById).toHaveBeenCalledTimes(1);
    });

    it("should handle numeric payment IDs", async () => {
      const mockPaymentId = 456;
      const mockLegacyPayment = {
        payment_id: 456,
        amount_cents: 2500,
        currency_code: "GBP",
        status_code: "pending",
        created_timestamp: "2024-01-20T14:30:00Z",
      };

      (legacyService.fetchPaymentById as jest.Mock).mockResolvedValue(
        mockLegacyPayment
      );

      const response = await request(app).get(`${baseUrl}/${mockPaymentId}`);

      expect(response.status).toBe(200);
      expect(response.body.data.payment_id).toBe(456);
    });

    it("should handle legacy error when payment not found", async () => {
      const legacyError = new LegacyError("Payment not found");
      (legacyService.fetchPaymentById as jest.Mock).mockRejectedValue(
        legacyError
      );

      const response = await request(app).get(`${baseUrl}/999`);

      expect(response.status).toBe(503);
      expect(response.body.success).toBe(false);
      expect(response.body.source).toBe("legacy-api");
    });

    it("should handle unexpected errors for specific payment", async () => {
      const unexpectedError = new Error("Network timeout");
      (legacyService.fetchPaymentById as jest.Mock).mockRejectedValue(
        unexpectedError
      );

      const response = await request(app).get(`${baseUrl}/123`);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

    it("should handle special characters in payment ID", async () => {
      const specialId = "abc-123";
      const mockPayment = {
        payment_id: "abc-123",
        amount_cents: 1000,
        currency_code: "USD",
        status_code: "completed",
        created_timestamp: "2024-01-15T10:00:00Z",
      };

      (legacyService.fetchPaymentById as jest.Mock).mockResolvedValue(
        mockPayment
      );

      const response = await request(app).get(`${baseUrl}/${specialId}`);

      expect(response.status).toBe(200);
      expect(legacyService.fetchPaymentById).toHaveBeenCalledWith(specialId);
    });
  });

  describe("Error Middleware Integration", () => {
    it("should format LegacyError responses correctly", async () => {
      const legacyError = new LegacyError("Connection refused");
      (legacyService.fetchPayments as jest.Mock).mockRejectedValue(legacyError);

      const response = await request(app).get(baseUrl);

      expect(response.body).toMatchObject({
        success: false,
        status: 503,
        source: "legacy-api",
      });
      expect(response.body).toHaveProperty("message");
      expect(typeof response.body.message).toBe("string");
    });

    it("should format generic errors correctly", async () => {
      const genericError = new Error("Something went wrong");
      (legacyService.fetchPayments as jest.Mock).mockRejectedValue(
        genericError
      );

      const response = await request(app).get(baseUrl);

      expect(response.body).toMatchObject({
        success: false,
        status: 500,
        message: expect.any(String),
      });
      expect(response.body).not.toHaveProperty("source");
    });
  });

  describe("Route Not Found", () => {
    it("should handle non-existent routes", async () => {
      const response = await request(app).get(
        `${config.api.versionPrefix}/v1/nonexistent`
      );

      // Express default 404 behavior or your custom 404 handler
      expect(response.status).toBe(404);
    });
  });

  describe("Health Check Integration", () => {
    it("should respond to health check endpoint", async () => {
      const response = await request(app).get(
        `${config.api.versionPrefix}/health`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
      expect(response.body).toHaveProperty("uptime");
      expect(typeof response.body.uptime).toBe("number");
    });
  });

  describe("Multiple Concurrent Requests", () => {
    it("should handle multiple requests simultaneously", async () => {
      const mockPayment = {
        payment_id: 1,
        amount_cents: 5000,
        currency_code: "USD",
        status_code: "completed",
        created_timestamp: "2024-01-15T10:00:00Z",
      };

      (legacyService.fetchPayments as jest.Mock).mockResolvedValue([
        mockPayment,
      ]);

      // Make 3 concurrent requests
      const promises = [
        request(app).get(baseUrl),
        request(app).get(baseUrl),
        request(app).get(baseUrl),
      ];

      const responses = await Promise.all(promises);

      // All should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      // Legacy service should be called 3 times (once per request)
      expect(legacyService.fetchPayments).toHaveBeenCalledTimes(3);
    });
  });
});
