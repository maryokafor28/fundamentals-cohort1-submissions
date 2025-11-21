import { CustomerTransformer } from "../../../src/transformers/customer.transformer";
import { LegacyUser } from "../../../src/types/legacy.types";

describe("CustomerTransformer", () => {
  const mockLegacyUser: LegacyUser = {
    id: 1,
    name: "John Doe",
    username: "johnny",
    email: "john@example.com",
    phone: "123-456",
    website: "example.com",
    address: {
      street: "Main St",
      suite: "Apt 1",
      city: "Lagos",
      zipcode: "100001",
      geo: {
        lat: "1",
        lng: "1",
      },
    },
    company: {
      name: "Tech Corp",
      catchPhrase: "Building the future",
      bs: "business strategy",
    },
  };

  it("should transform a complete LegacyUser into ModernCustomer correctly", () => {
    const result = CustomerTransformer.toModern(mockLegacyUser);

    expect(result).toEqual({
      id: 1,
      name: "John Doe",
      username: "johnny",
      email: "john@example.com",
      phone: "123-456",
      website: "example.com",
      address: {
        street: "Main St",
        suite: "Apt 1",
        city: "Lagos",
        zipcode: "100001",
      },
      company: {
        name: "Tech Corp",
        catchPhrase: "Building the future",
        bs: "business strategy",
      },
    });
  });

  it("should handle missing address safely", () => {
    const userWithoutAddress: LegacyUser = {
      ...mockLegacyUser,
      address: undefined,
    };

    const result = CustomerTransformer.toModern(userWithoutAddress);

    expect(result.address).toEqual({
      street: undefined,
      suite: undefined,
      city: undefined,
      zipcode: undefined,
    });
  });

  it("should handle missing company safely", () => {
    const userWithoutCompany: LegacyUser = {
      ...mockLegacyUser,
      company: undefined,
    };

    const result = CustomerTransformer.toModern(userWithoutCompany);

    expect(result.company).toEqual({
      name: undefined,
      catchPhrase: undefined,
      bs: undefined,
    });
  });

  it("should not include extra legacy fields (e.g. geo)", () => {
    const result = CustomerTransformer.toModern(mockLegacyUser);

    // Expect geo to be removed
    expect((result as any).geo).toBeUndefined();
  });
});
