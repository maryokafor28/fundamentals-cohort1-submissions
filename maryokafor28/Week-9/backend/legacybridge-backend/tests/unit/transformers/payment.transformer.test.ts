import { PaymentTransformer } from "../../../src/transformers/payment.transformer";
import { LegacyPost } from "../../../src/types/legacy.types";
import { PaymentStatus } from "../../../src/types/modern.types";

describe("PaymentTransformer.toModern", () => {
  const mockLegacyPost: LegacyPost = {
    id: 7,
    userId: 3,
    title: "Test payment description",
    body: "Lorem ipsum",
  };

  it("should convert LegacyPost into ModernPayment format", () => {
    const result = PaymentTransformer.toModern(mockLegacyPost);

    // Core fields
    expect(result.id).toBe(mockLegacyPost.id);
    expect(result.customerId).toBe(mockLegacyPost.userId);
    expect(result.description).toBe(mockLegacyPost.title);

    // Amount is a number
    expect(typeof result.amount).toBe("number");

    // Currency is correct
    expect(result.currency).toBe("Naira");

    // Status matches expected calculation (id % 3)
    const statuses: PaymentStatus[] = ["pending", "completed", "failed"];
    const expectedStatus = statuses[mockLegacyPost.id % statuses.length];
    expect(result.status).toBe(expectedStatus);

    // createdAt is a valid timestamp
    expect(new Date(result.createdAt).toString()).not.toBe("Invalid Date");
  });
});
