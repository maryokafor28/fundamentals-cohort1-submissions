import request from "supertest";
import app from "../../../src/config/app.config";
import { legacyService } from "../../../src/services/legacy.service";
import { clearCache } from "../../../src/utils/cache.util";
import { LegacyError } from "../../../src/errors/LegacyError";
import config from "../../../src/config/env.config";

// Mock ONLY the legacy service (external dependency)
jest.mock("../../../src/services/legacy.service.ts");

describe("Customer V2 Integration Tests", () => {
  const baseUrl = `${config.api.versionPrefix}/v2/customers`;
  afterAll(() => {
    app.removeAllListeners();
    jest.clearAllTimers();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    clearCache(); // Clear cache before each test for isolation
  });

  describe("GET /api/v2/customers", () => {
    it("should return transformed customers with modern format", async () => {
      // Arrange: Mock legacy API response with JSONPlaceholder format
      const mockLegacyCustomers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          username: "johndoe",
          website: "john.com",
          address: {
            street: "123 Main St",
            suite: "Apt 1",
            city: "New York",
            zipcode: "10001",
          },
          company: {
            name: "Doe Inc",
            catchPhrase: "Innovation first",
            bs: "synergize solutions",
          },
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "0987654321",
          username: "janesmith",
          website: "jane.com",
          address: {
            street: "456 Oak Ave",
            suite: "Suite 200",
            city: "Los Angeles",
            zipcode: "90001",
          },
          company: {
            name: "Smith Corp",
            catchPhrase: "Quality matters",
            bs: "optimize workflows",
          },
        },
      ];

      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue(
        mockLegacyCustomers
      );

      // Act: Make HTTP request
      const response = await request(app).get(baseUrl);

      // Assert: Verify response has correct structure
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveLength(2);

      // Verify transformation happened correctly
      expect(response.body.data[0]).toMatchObject({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        username: "johndoe",
        website: "john.com",
        address: {
          street: "123 Main St",
          suite: "Apt 1",
          city: "New York",
          zipcode: "10001",
        },
        company: {
          name: "Doe Inc",
          catchPhrase: "Innovation first",
          bs: "synergize solutions",
        },
      });

      expect(response.body.data[1]).toMatchObject({
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "0987654321",
        username: "janesmith",
        website: "jane.com",
      });

      // Verify legacy service was called
      expect(legacyService.fetchCustomers).toHaveBeenCalledTimes(1);
    });

    it("should use cache on second request (cache hit)", async () => {
      const mockLegacyCustomers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          username: "johndoe",
          website: "john.com",
          address: {
            street: "123 Main St",
            suite: "Apt 1",
            city: "New York",
            zipcode: "10001",
          },
          company: {
            name: "Doe Inc",
            catchPhrase: "Innovation first",
            bs: "synergize solutions",
          },
        },
      ];

      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue(
        mockLegacyCustomers
      );

      // First request - should call legacy service
      const response1 = await request(app).get(baseUrl);
      expect(response1.status).toBe(200);
      expect(legacyService.fetchCustomers).toHaveBeenCalledTimes(1);

      // Second request - should use cache (no additional call to legacy service)
      const response2 = await request(app).get(baseUrl);
      expect(response2.status).toBe(200);
      expect(legacyService.fetchCustomers).toHaveBeenCalledTimes(1); // Still 1!

      // Both responses should be identical
      expect(response1.body.data).toEqual(response2.body.data);
    });

    it("should return empty array when no customers exist", async () => {
      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get(baseUrl);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it("should handle LegacyError and return proper error response", async () => {
      const legacyError = new LegacyError("Legacy API connection failed");
      (legacyService.fetchCustomers as jest.Mock).mockRejectedValue(
        legacyError
      );

      const response = await request(app).get(baseUrl);

      expect(response.status).toBe(503);
      expect(response.body).toMatchObject({
        success: false,
        status: 503,
        message:
          "Legacy system is temporarily unavailable. Please try again later.",
        source: "legacy-api",
      });

      // Cache should NOT be populated on error
      const response2 = await request(app).get(baseUrl);
      expect(legacyService.fetchCustomers).toHaveBeenCalledTimes(2); // Called again
    });

    it("should handle unexpected errors", async () => {
      const unexpectedError = new Error("Database connection lost");
      (legacyService.fetchCustomers as jest.Mock).mockRejectedValue(
        unexpectedError
      );

      const response = await request(app).get(baseUrl);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });

    it("should transform all customer fields correctly", async () => {
      // Mock JSONPlaceholder format (what V2 returns)
      const mockLegacyCustomer = {
        id: 999,
        name: "Bob Johnson",
        email: "bob@test.com",
        phone: "5551234567",
        username: "bobjohnson",
        website: "bob.com",
        address: {
          street: "789 Pine St",
          suite: "Unit 3",
          city: "Chicago",
          zipcode: "60601",
        },
        company: {
          name: "Johnson LLC",
          catchPhrase: "Excellence delivered",
          bs: "streamline processes",
        },
      };

      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue([
        mockLegacyCustomer,
      ]);

      const response = await request(app).get(baseUrl);

      // V2 returns JSONPlaceholder format as-is (no transformation)
      expect(response.body.data[0]).toMatchObject({
        id: 999,
        name: "Bob Johnson",
        email: "bob@test.com",
        phone: "5551234567",
        username: "bobjohnson",
        website: "bob.com",
        address: {
          street: "789 Pine St",
          suite: "Unit 3",
          city: "Chicago",
          zipcode: "60601",
        },
        company: {
          name: "Johnson LLC",
          catchPhrase: "Excellence delivered",
          bs: "streamline processes",
        },
      });
    });
  });

  describe("GET /api/v2/customers/:id", () => {
    it("should return single transformed customer", async () => {
      const customerId = "123";
      const mockLegacyCustomer = {
        id: 123,
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        username: "johndoe",
        website: "john.com",
        address: {
          street: "123 Main St",
          suite: "Apt 1",
          city: "New York",
          zipcode: "10001",
        },
        company: {
          name: "Doe Inc",
          catchPhrase: "Innovation first",
          bs: "synergize solutions",
        },
      };

      (legacyService.fetchCustomerById as jest.Mock).mockResolvedValue(
        mockLegacyCustomer
      );

      const response = await request(app).get(`${baseUrl}/${customerId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: 123,
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        username: "johndoe",
        website: "john.com",
        address: {
          street: "123 Main St",
          suite: "Apt 1",
          city: "New York",
          zipcode: "10001",
        },
        company: {
          name: "Doe Inc",
          catchPhrase: "Innovation first",
          bs: "synergize solutions",
        },
      });

      expect(legacyService.fetchCustomerById).toHaveBeenCalledWith(customerId);
      expect(legacyService.fetchCustomerById).toHaveBeenCalledTimes(1);
    });

    it("should use cache on second request for same ID", async () => {
      const customerId = "456";
      const mockLegacyCustomer = {
        id: 456,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "0987654321",
        username: "janesmith",
        website: "jane.com",
        address: {
          street: "456 Oak Ave",
          suite: "Suite 200",
          city: "Los Angeles",
          zipcode: "90001",
        },
        company: {
          name: "Smith Corp",
          catchPhrase: "Quality matters",
          bs: "optimize workflows",
        },
      };

      (legacyService.fetchCustomerById as jest.Mock).mockResolvedValue(
        mockLegacyCustomer
      );

      // First request
      const response1 = await request(app).get(`${baseUrl}/${customerId}`);
      expect(response1.status).toBe(200);
      expect(legacyService.fetchCustomerById).toHaveBeenCalledTimes(1);

      // Second request - should use cache
      const response2 = await request(app).get(`${baseUrl}/${customerId}`);
      expect(response2.status).toBe(200);
      expect(legacyService.fetchCustomerById).toHaveBeenCalledTimes(1); // Still 1!

      // Both responses should be identical
      expect(response1.body.data).toEqual(response2.body.data);
    });

    it("should handle numeric customer IDs", async () => {
      const customerId = 789;
      const mockLegacyCustomer = {
        id: 789,
        name: "Alice Brown",
        email: "alice@example.com",
        phone: "1112223333",
        username: "alicebrown",
        website: "alice.com",
        address: {
          street: "789 Elm St",
          suite: "Apt 5",
          city: "Boston",
          zipcode: "02101",
        },
        company: {
          name: "Brown Enterprises",
          catchPhrase: "Leading the way",
          bs: "revolutionize industries",
        },
      };

      (legacyService.fetchCustomerById as jest.Mock).mockResolvedValue(
        mockLegacyCustomer
      );

      const response = await request(app).get(`${baseUrl}/${customerId}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(789);
      expect(response.body.data.name).toBe("Alice Brown");
    });

    it("should handle LegacyError when customer not found", async () => {
      const legacyError = new LegacyError("Customer not found");
      (legacyService.fetchCustomerById as jest.Mock).mockRejectedValue(
        legacyError
      );

      const response = await request(app).get(`${baseUrl}/999`);

      expect(response.status).toBe(503);
      expect(response.body).toMatchObject({
        success: false,
        status: 503,
        source: "legacy-api",
      });
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

    it("should not share cache between different customer IDs", async () => {
      const customer1 = {
        id: 100,
        name: "Customer One",
        email: "one@example.com",
        phone: "1111111111",
        username: "customerone",
        website: "one.com",
        address: {
          street: "100 First St",
          suite: "Suite 1",
          city: "Seattle",
          zipcode: "98101",
        },
        company: {
          name: "Company One",
          catchPhrase: "First in class",
          bs: "deliver excellence",
        },
      };

      const customer2 = {
        id: 200,
        name: "Customer Two",
        email: "two@example.com",
        phone: "2222222222",
        username: "customertwo",
        website: "two.com",
        address: {
          street: "200 Second St",
          suite: "Suite 2",
          city: "Portland",
          zipcode: "97201",
        },
        company: {
          name: "Company Two",
          catchPhrase: "Second to none",
          bs: "maximize value",
        },
      };

      (legacyService.fetchCustomerById as jest.Mock)
        .mockResolvedValueOnce(customer1)
        .mockResolvedValueOnce(customer2);

      // Request customer 100
      const response1 = await request(app).get(`${baseUrl}/100`);
      expect(response1.body.data.id).toBe(100);

      // Request customer 200
      const response2 = await request(app).get(`${baseUrl}/200`);
      expect(response2.body.data.id).toBe(200);

      // Both should have been called (different cache keys)
      expect(legacyService.fetchCustomerById).toHaveBeenCalledTimes(2);
    });
  });

  describe("Cache Isolation Between Endpoints", () => {
    it("should have separate cache for getAllCustomers and getCustomerById", async () => {
      const mockCustomer = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        username: "johndoe",
        website: "john.com",
        address: {
          street: "123 Main St",
          suite: "Apt 1",
          city: "New York",
          zipcode: "10001",
        },
        company: {
          name: "Doe Inc",
          catchPhrase: "Innovation first",
          bs: "synergize solutions",
        },
      };

      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue([
        mockCustomer,
      ]);
      (legacyService.fetchCustomerById as jest.Mock).mockResolvedValue(
        mockCustomer
      );

      // Call getAllCustomers (caches with key "customers:all")
      await request(app).get(baseUrl);
      expect(legacyService.fetchCustomers).toHaveBeenCalledTimes(1);

      // Call getCustomerById (caches with key "customers:1")
      await request(app).get(`${baseUrl}/1`);
      expect(legacyService.fetchCustomerById).toHaveBeenCalledTimes(1);

      // Both should have been called (different cache keys)
      expect(legacyService.fetchCustomers).toHaveBeenCalledTimes(1);
      expect(legacyService.fetchCustomerById).toHaveBeenCalledTimes(1);
    });
  });

  describe("Data Transformation Pipeline", () => {
    it("should handle customers with special characters in names", async () => {
      const mockCustomer = {
        id: 1,
        name: "José García-López",
        email: "jose@example.com",
        phone: "+34123456789",
        username: "josegarcia",
        website: "jose.com",
        address: {
          street: "Calle Principal 123",
          suite: "Piso 2",
          city: "Madrid",
          zipcode: "28001",
        },
        company: {
          name: "García Corp",
          catchPhrase: "Excelencia en todo",
          bs: "optimizar soluciones",
        },
      };

      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue([
        mockCustomer,
      ]);

      const response = await request(app).get(baseUrl);

      expect(response.body.data[0].name).toBe("José García-López");
      expect(response.body.data[0].phone).toBe("+34123456789");
    });

    it("should handle multiple customers with different data", async () => {
      const mockCustomers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          username: "johndoe",
          website: "john.com",
          address: {
            street: "123 Main St",
            suite: "Apt 1",
            city: "New York",
            zipcode: "10001",
          },
          company: {
            name: "Doe Inc",
            catchPhrase: "Innovation first",
            bs: "synergize solutions",
          },
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "0987654321",
          username: "janesmith",
          website: "jane.com",
          address: {
            street: "456 Oak Ave",
            suite: "Suite 200",
            city: "Los Angeles",
            zipcode: "90001",
          },
          company: {
            name: "Smith Corp",
            catchPhrase: "Quality matters",
            bs: "optimize workflows",
          },
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          phone: "5555555555",
          username: "bobjohnson",
          website: "bob.com",
          address: {
            street: "789 Pine St",
            suite: "Unit 3",
            city: "Chicago",
            zipcode: "60601",
          },
          company: {
            name: "Johnson LLC",
            catchPhrase: "Excellence delivered",
            bs: "streamline processes",
          },
        },
      ];

      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue(
        mockCustomers
      );

      const response = await request(app).get(baseUrl);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0].name).toBe("John Doe");
      expect(response.body.data[1].name).toBe("Jane Smith");
      expect(response.body.data[2].name).toBe("Bob Johnson");
    });
  });

  describe("Error Handling Through All Layers", () => {
    it("should propagate errors through controller → service → transformer", async () => {
      // Simulate service returning null (invalid data)
      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get(baseUrl);

      // Should handle gracefully with error response
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });
  });
});
