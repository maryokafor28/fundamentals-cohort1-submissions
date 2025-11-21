import { paymentService } from "../../../src/services/payment.service";
import { legacyService } from "../../../src/services/legacy.service";
import { getCache, setCache } from "../../../src/utils/cache.util";
import { PaymentTransformer } from "../../../src/transformers/payment.transformer";
import { LegacyError } from "../../../src/errors/LegacyError";

// Mock dependencies
jest.mock("../../../src/services/legacy.service");
jest.mock("../../../src/utils/cache.util");

// Mock the transformer
jest.mock("../../../src/transformers/payment.transformer", () => ({
  PaymentTransformer: {
    toModern: jest.fn(),
  },
}));

describe("PaymentService", () => {
  const mockLegacyPayment = {
    payment_id: 456,
    amount_cents: 10000,
    currency_code: "USD",
    status_code: "completed",
    created_timestamp: "2024-01-20T10:30:00Z",
  };

  const mockModernPayment = {
    id: 456,
    amount: 100.0,
    currency: "USD",
    status: "completed",
    createdAt: "2024-01-20T10:30:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Suppress console logs during tests
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Reset all mocks to their default state
    (getCache as jest.Mock).mockReturnValue(null);
    (setCache as jest.Mock).mockReturnValue(undefined);

    // Setup default transformer behavior
    (PaymentTransformer.toModern as jest.Mock).mockReturnValue(
      mockModernPayment
    );
  });

  afterEach(() => {
    // Restore console methods
    jest.restoreAllMocks();
  });

  describe("getAllPayments()", () => {
    it("should return cached data when cache hit", async () => {
      const cachedData = [mockModernPayment];
      (getCache as jest.Mock).mockReturnValue(cachedData);

      const result = await paymentService.getAllPayments();

      expect(result).toEqual(cachedData);
      expect(getCache).toHaveBeenCalledWith("payments:all");
      expect(legacyService.fetchPayments).not.toHaveBeenCalled();
      expect(setCache).not.toHaveBeenCalled();
      expect(PaymentTransformer.toModern).not.toHaveBeenCalled();
    });

    it("should fetch, transform, and cache data when cache miss", async () => {
      (legacyService.fetchPayments as jest.Mock).mockResolvedValue([
        mockLegacyPayment,
      ]);

      const result = await paymentService.getAllPayments();

      expect(getCache).toHaveBeenCalledWith("payments:all");
      expect(legacyService.fetchPayments).toHaveBeenCalledTimes(1);
      expect(PaymentTransformer.toModern).toHaveBeenCalledTimes(1);
      expect(setCache).toHaveBeenCalledWith("payments:all", [
        mockModernPayment,
      ]);
      expect(result).toEqual([mockModernPayment]);
    });

    it("should transform multiple payments correctly", async () => {
      const mockLegacyPayments = [
        { ...mockLegacyPayment, payment_id: 1 },
        { ...mockLegacyPayment, payment_id: 2 },
        { ...mockLegacyPayment, payment_id: 3 },
      ];

      const mockModernPayments = [
        { ...mockModernPayment, id: 1 },
        { ...mockModernPayment, id: 2 },
        { ...mockModernPayment, id: 3 },
      ];

      (legacyService.fetchPayments as jest.Mock).mockResolvedValue(
        mockLegacyPayments
      );
      (PaymentTransformer.toModern as jest.Mock)
        .mockReturnValueOnce(mockModernPayments[0])
        .mockReturnValueOnce(mockModernPayments[1])
        .mockReturnValueOnce(mockModernPayments[2]);

      const result = await paymentService.getAllPayments();

      expect(PaymentTransformer.toModern).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockModernPayments);
    });

    it("should propagate LegacyError when legacy service fails", async () => {
      const legacyError = new LegacyError("Legacy API failed");

      (legacyService.fetchPayments as jest.Mock).mockRejectedValue(legacyError);

      await expect(paymentService.getAllPayments()).rejects.toThrow(
        LegacyError
      );

      expect(setCache).not.toHaveBeenCalled();
    });

    it("should wrap unexpected errors with descriptive message", async () => {
      const unexpectedError = new Error("Database connection failed");
      (legacyService.fetchPayments as jest.Mock).mockRejectedValue(
        unexpectedError
      );

      await expect(paymentService.getAllPayments()).rejects.toThrow(
        "Failed to fetch payments: Database connection failed"
      );

      expect(setCache).not.toHaveBeenCalled();
    });

    it("should handle non-Error exceptions", async () => {
      (legacyService.fetchPayments as jest.Mock).mockRejectedValue(
        "string error"
      );

      await expect(paymentService.getAllPayments()).rejects.toThrow(
        "Failed to fetch payments: Unknown error"
      );
    });
  });

  describe("getPaymentById()", () => {
    it("should return cached data when cache hit", async () => {
      (getCache as jest.Mock).mockReturnValue(mockModernPayment);

      const result = await paymentService.getPaymentById(456);

      expect(result).toEqual(mockModernPayment);
      expect(getCache).toHaveBeenCalledWith("payments:456");
      expect(legacyService.fetchPaymentById).not.toHaveBeenCalled();
      expect(setCache).not.toHaveBeenCalled();
      expect(PaymentTransformer.toModern).not.toHaveBeenCalled();
    });

    it("should fetch, transform, and cache data when cache miss", async () => {
      (legacyService.fetchPaymentById as jest.Mock).mockResolvedValue(
        mockLegacyPayment
      );

      const result = await paymentService.getPaymentById(456);

      expect(getCache).toHaveBeenCalledWith("payments:456");
      expect(legacyService.fetchPaymentById).toHaveBeenCalledWith(456);
      expect(PaymentTransformer.toModern).toHaveBeenCalledTimes(1);
      expect(setCache).toHaveBeenCalledWith("payments:456", mockModernPayment);
      expect(result).toEqual(mockModernPayment);
    });

    it("should handle string ID", async () => {
      (legacyService.fetchPaymentById as jest.Mock).mockResolvedValue(
        mockLegacyPayment
      );

      const result = await paymentService.getPaymentById("789");

      expect(getCache).toHaveBeenCalledWith("payments:789");
      expect(legacyService.fetchPaymentById).toHaveBeenCalledWith("789");
      expect(result).toEqual(mockModernPayment);
    });

    it("should propagate LegacyError when legacy service fails", async () => {
      const legacyError = new LegacyError("Payment not found");

      (legacyService.fetchPaymentById as jest.Mock).mockRejectedValue(
        legacyError
      );

      await expect(paymentService.getPaymentById(999)).rejects.toThrow(
        LegacyError
      );

      expect(setCache).not.toHaveBeenCalled();
    });

    it("should wrap unexpected errors with descriptive message", async () => {
      const unexpectedError = new Error("Network timeout");
      (legacyService.fetchPaymentById as jest.Mock).mockRejectedValue(
        unexpectedError
      );

      await expect(paymentService.getPaymentById(456)).rejects.toThrow(
        "Failed to fetch payment 456: Network timeout"
      );

      expect(setCache).not.toHaveBeenCalled();
    });

    it("should handle non-Error exceptions", async () => {
      (legacyService.fetchPaymentById as jest.Mock).mockRejectedValue(null);

      await expect(paymentService.getPaymentById(456)).rejects.toThrow(
        "Failed to fetch payment 456: Unknown error"
      );
    });
  });
});
