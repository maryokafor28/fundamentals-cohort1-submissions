export interface ModernCustomer {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street?: string;
    suite?: string;
    city?: string;
    zipcode?: string;
  };
  company: {
    name?: string;
    catchPhrase?: string;
    bs?: string;
  };
}
export type PaymentStatus = "pending" | "completed" | "failed";

export interface ModernPayment {
  id: number;
  customerId: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description: string;
  createdAt: string; // ISO timestamp
}
