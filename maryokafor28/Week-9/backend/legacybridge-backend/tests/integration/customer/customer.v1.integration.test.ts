import request from "supertest";
import app from "../../../src/config/app.config";
import { legacyService } from "../../../src/services/legacy.service";
import { LegacyError } from "../../../src/errors/LegacyError";
import config from "../../../src/config/env.config";

// Mock ONLY the legacy service (external dependency)
jest.mock("../../../src/services/legacy.service.ts");

describe("Customer V1 Integration Tests", () => {
  const baseUrl = `${config.api.versionPrefix}/v1/customers`;
  afterAll(() => {
    app.removeAllListeners();
    jest.clearAllTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/v1/customers", () => {
    it("should return all customers with legacy format", async () => {
      // Arrange: Mock legacy API response
      const mockLegacyCustomers = [
        {
          customer_id: 1,
          full_name: "John Doe",
          email_address: "john@example.com",
          phone_number: "1234567890",
          registration_date: "2024-01-15",
        },
        {
          customer_id: 2,
          full_name: "Jane Smith",
          email_address: "jane@example.com",
          phone_number: "0987654321",
          registration_date: "2024-01-16",
        },
      ];

      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue(
        mockLegacyCustomers
      );

      // Act: Make HTTP request
      const response = await request(app).get(baseUrl);

      // Assert: Verify response returns legacy format (no transformation)
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toEqual(mockLegacyCustomers);
      expect(legacyService.fetchCustomers).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no customers exist", async () => {
      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get(baseUrl);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it("should handle legacy service errors with 503 status", async () => {
      const legacyError = new LegacyError("Legacy API is down");
      (legacyService.fetchCustomers as jest.Mock).mockRejectedValue(
        legacyError
      );

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
      (legacyService.fetchCustomers as jest.Mock).mockRejectedValue(
        unexpectedError
      );

      const response = await request(app).get(baseUrl);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.status).toBe(500);
    });

    it("should include correct headers in response", async () => {
      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get(baseUrl);

      expect(response.headers["content-type"]).toMatch(/json/);
    });
  });

  describe("GET /api/v1/customers/:id", () => {
    it("should return a single customer with legacy format", async () => {
      const customerId = "123";
      const mockLegacyCustomer = {
        customer_id: 123,
        full_name: "John Doe",
        email_address: "john@example.com",
        phone_number: "1234567890",
        registration_date: "2024-01-15",
      };

      (legacyService.fetchCustomerById as jest.Mock).mockResolvedValue(
        mockLegacyCustomer
      );

      const response = await request(app).get(`${baseUrl}/${customerId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockLegacyCustomer);
      expect(legacyService.fetchCustomerById).toHaveBeenCalledWith(customerId);
      expect(legacyService.fetchCustomerById).toHaveBeenCalledTimes(1);
    });

    it("should handle numeric customer IDs", async () => {
      const customerId = 456;
      const mockLegacyCustomer = {
        customer_id: 456,
        full_name: "Jane Smith",
        email_address: "jane@example.com",
        phone_number: "0987654321",
        registration_date: "2024-01-20",
      };

      (legacyService.fetchCustomerById as jest.Mock).mockResolvedValue(
        mockLegacyCustomer
      );

      const response = await request(app).get(`${baseUrl}/${customerId}`);

      expect(response.status).toBe(200);
      expect(response.body.data.customer_id).toBe(456);
    });

    it("should handle legacy error when customer not found", async () => {
      const legacyError = new LegacyError("Customer not found");
      (legacyService.fetchCustomerById as jest.Mock).mockRejectedValue(
        legacyError
      );

      const response = await request(app).get(`${baseUrl}/999`);

      expect(response.status).toBe(503);
      expect(response.body.success).toBe(false);
      expect(response.body.source).toBe("legacy-api");
    });

    it("should handle unexpected errors for specific customer", async () => {
      const unexpectedError = new Error("Network timeout");
      (legacyService.fetchCustomerById as jest.Mock).mockRejectedValue(
        unexpectedError
      );

      const response = await request(app).get(`${baseUrl}/123`);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

    it("should handle special characters in customer ID", async () => {
      const specialId = "abc-123";
      const mockCustomer = {
        customer_id: "abc-123",
        full_name: "Bob Johnson",
        email_address: "bob@example.com",
        phone_number: "5555555555",
        registration_date: "2024-01-15",
      };

      (legacyService.fetchCustomerById as jest.Mock).mockResolvedValue(
        mockCustomer
      );

      const response = await request(app).get(`${baseUrl}/${specialId}`);

      expect(response.status).toBe(200);
      expect(legacyService.fetchCustomerById).toHaveBeenCalledWith(specialId);
    });
  });

  describe("Error Middleware Integration", () => {
    it("should format LegacyError responses correctly", async () => {
      const legacyError = new LegacyError("Connection refused");
      (legacyService.fetchCustomers as jest.Mock).mockRejectedValue(
        legacyError
      );

      const response = await request(app).get(baseUrl);

      expect(response.body).toMatchObject({
        success: false,
        status: 503,
        message:
          "Legacy system is temporarily unavailable. Please try again later.",
        source: "legacy-api",
      });
    });

    it("should format generic errors correctly", async () => {
      const genericError = new Error("Something went wrong");
      (legacyService.fetchCustomers as jest.Mock).mockRejectedValue(
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

  describe("Multiple Concurrent Requests", () => {
    it("should handle multiple requests simultaneously", async () => {
      const mockCustomer = {
        customer_id: 1,
        full_name: "John Doe",
        email_address: "john@example.com",
        phone_number: "1234567890",
        registration_date: "2024-01-15",
      };

      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue([
        mockCustomer,
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

      // Legacy service should be called 3 times (no caching in v1)
      expect(legacyService.fetchCustomers).toHaveBeenCalledTimes(3);
    });
  });
});
