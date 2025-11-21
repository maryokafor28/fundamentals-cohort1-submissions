import { LegacyUser } from "../types/legacy.types";
import { ModernCustomer } from "../types/modern.types";

/**
 * Converts a legacy user object from JSONPlaceholder
 * into a modern customer object.
 */
export class CustomerTransformer {
  static toModern(legacy: LegacyUser): ModernCustomer {
    return {
      id: legacy.id,
      name: legacy.name,
      email: legacy.email,
      phone: legacy.phone,
      username: legacy.username,
      website: legacy.website,
      address: {
        street: legacy.address?.street,
        suite: legacy.address?.suite,
        city: legacy.address?.city,
        zipcode: legacy.address?.zipcode,
      },
      company: {
        name: legacy.company?.name,
        catchPhrase: legacy.company?.catchPhrase,
        bs: legacy.company?.bs,
      },
    };
  }
}
