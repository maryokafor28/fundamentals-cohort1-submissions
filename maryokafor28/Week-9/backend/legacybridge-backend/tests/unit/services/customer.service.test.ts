import { customerService } from "../../../src/services/customer.service";
import { legacyService } from "../../../src/services/legacy.service";
import { getCache, setCache } from "../../../src/utils/cache.util";
import { CustomerTransformer } from "../../../src/transformers/customer.transformer";
import { LegacyError } from "../../../src/errors/LegacyError";

// Mock dependencies
jest.mock("../../../src/services/legacy.service");
jest.mock("../../../src/utils/cache.util");

// Don't mock the transformer completely, just spy on it
jest.mock("../../../src/transformers/customer.transformer", () => ({
  CustomerTransformer: {
    toModern: jest.fn(),
  },
}));

describe("CustomerService", () => {
  const mockLegacyCustomer = {
    customer_id: 123,
    full_name: "John Doe",
    email_address: "john@example.com",
    phone_number: "1234567890",
    registration_date: "2024-01-15",
  };

  const mockModernCustomer = {
    id: 123,
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    createdAt: "2024-01-15",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset all mocks to their default state
    (getCache as jest.Mock).mockReturnValue(null);
    (setCache as jest.Mock).mockReturnValue(undefined);

    // Setup default transformer behavior
    (CustomerTransformer.toModern as jest.Mock).mockReturnValue(
      mockModernCustomer
    );
  });

  describe("getAllCustomers()", () => {
    it("should return cached data when cache hit", async () => {
      const cachedData = [mockModernCustomer];
      (getCache as jest.Mock).mockReturnValue(cachedData);

      const result = await customerService.getAllCustomers();

      expect(result).toEqual(cachedData);
      expect(getCache).toHaveBeenCalledWith("customers:all");
      expect(legacyService.fetchCustomers).not.toHaveBeenCalled();
      expect(setCache).not.toHaveBeenCalled();
      expect(CustomerTransformer.toModern).not.toHaveBeenCalled();
    });

    it("should fetch, transform, and cache data when cache miss", async () => {
      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue([
        mockLegacyCustomer,
      ]);

      const result = await customerService.getAllCustomers();

      expect(getCache).toHaveBeenCalledWith("customers:all");
      expect(legacyService.fetchCustomers).toHaveBeenCalledTimes(1);
      expect(CustomerTransformer.toModern).toHaveBeenCalledTimes(1);
      expect(setCache).toHaveBeenCalledWith("customers:all", [
        mockModernCustomer,
      ]);
      expect(result).toEqual([mockModernCustomer]);
    });

    it("should transform multiple customers correctly", async () => {
      const mockLegacyCustomers = [
        { ...mockLegacyCustomer, customer_id: 1 },
        { ...mockLegacyCustomer, customer_id: 2 },
        { ...mockLegacyCustomer, customer_id: 3 },
      ];

      const mockModernCustomers = [
        { ...mockModernCustomer, id: 1 },
        { ...mockModernCustomer, id: 2 },
        { ...mockModernCustomer, id: 3 },
      ];

      (legacyService.fetchCustomers as jest.Mock).mockResolvedValue(
        mockLegacyCustomers
      );
      (CustomerTransformer.toModern as jest.Mock)
        .mockReturnValueOnce(mockModernCustomers[0])
        .mockReturnValueOnce(mockModernCustomers[1])
        .mockReturnValueOnce(mockModernCustomers[2]);

      const result = await customerService.getAllCustomers();

      expect(CustomerTransformer.toModern).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockModernCustomers);
    });

    it("should propagate LegacyError when legacy service fails", async () => {
      const legacyError = new LegacyError("Legacy API failed");

      // Clear the default mock and set rejection for this test
      (legacyService.fetchCustomers as jest.Mock).mockRejectedValue(
        legacyError
      );

      await expect(customerService.getAllCustomers()).rejects.toThrow(
        LegacyError
      );

      expect(setCache).not.toHaveBeenCalled();
    });

    it("should propagate LegacyError when legacy service fails", async () => {
      const legacyError = new LegacyError("Legacy API failed");

      // Clear the default mock and set rejection for this test
      (legacyService.fetchCustomers as jest.Mock).mockRejectedValue(
        legacyError
      );

      await expect(customerService.getAllCustomers()).rejects.toThrow(
        LegacyError
      );

      expect(setCache).not.toHaveBeenCalled();
    });

    it("should wrap unexpected errors with descriptive message", async () => {
      const unexpectedError = new Error("Network timeout");
      (legacyService.fetchCustomers as jest.Mock).mockRejectedValue(
        unexpectedError
      );

      await expect(customerService.getAllCustomers()).rejects.toThrow(
        "Failed to fetch customers: Network timeout"
      );

      expect(setCache).not.toHaveBeenCalled();
    });

    it("should handle non-Error exceptions", async () => {
      (legacyService.fetchCustomers as jest.Mock).mockRejectedValue(
        "string error"
      );

      await expect(customerService.getAllCustomers()).rejects.toThrow(
        "Failed to fetch customers: Unknown error"
      );
    });
  });

  describe("getCustomerById()", () => {
    it("should return cached data when cache hit", async () => {
      (getCache as jest.Mock).mockReturnValue(mockModernCustomer);

      const result = await customerService.getCustomerById(123);

      expect(result).toEqual(mockModernCustomer);
      expect(getCache).toHaveBeenCalledWith("customers:123");
      expect(legacyService.fetchCustomerById).not.toHaveBeenCalled();
      expect(setCache).not.toHaveBeenCalled();
      expect(CustomerTransformer.toModern).not.toHaveBeenCalled();
    });

    it("should fetch, transform, and cache data when cache miss", async () => {
      (legacyService.fetchCustomerById as jest.Mock).mockResolvedValue(
        mockLegacyCustomer
      );

      const result = await customerService.getCustomerById(123);

      expect(getCache).toHaveBeenCalledWith("customers:123");
      expect(legacyService.fetchCustomerById).toHaveBeenCalledWith(123);
      expect(CustomerTransformer.toModern).toHaveBeenCalledTimes(1);
      expect(setCache).toHaveBeenCalledWith(
        "customers:123",
        mockModernCustomer
      );
      expect(result).toEqual(mockModernCustomer);
    });

    it("should handle string ID", async () => {
      (legacyService.fetchCustomerById as jest.Mock).mockResolvedValue(
        mockLegacyCustomer
      );

      const result = await customerService.getCustomerById("456");

      expect(getCache).toHaveBeenCalledWith("customers:456");
      expect(legacyService.fetchCustomerById).toHaveBeenCalledWith("456");
      expect(result).toEqual(mockModernCustomer);
    });

    it("should propagate LegacyError when legacy service fails", async () => {
      const legacyError = new LegacyError("Customer not found");

      // Override the cache mock to return null for this specific test
      (getCache as jest.Mock).mockReturnValue(null);
      (legacyService.fetchCustomerById as jest.Mock).mockRejectedValue(
        legacyError
      );

      await expect(customerService.getCustomerById(999)).rejects.toThrow(
        LegacyError
      );

      expect(setCache).not.toHaveBeenCalled();
    });

    it("should wrap unexpected errors with descriptive message", async () => {
      const unexpectedError = new Error("Database connection failed");
      (legacyService.fetchCustomerById as jest.Mock).mockRejectedValue(
        unexpectedError
      );

      await expect(customerService.getCustomerById(123)).rejects.toThrow(
        "Failed to fetch customer with id 123"
      );

      expect(setCache).not.toHaveBeenCalled();
    });

    it("should handle non-Error exceptions", async () => {
      (legacyService.fetchCustomerById as jest.Mock).mockRejectedValue(null);

      await expect(customerService.getCustomerById(123)).rejects.toThrow(
        "Failed to fetch customer with id 123"
      );
    });
  });
});
