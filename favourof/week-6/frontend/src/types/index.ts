export interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
  createdAt?: string;
}

export interface Transaction {
  id: number;
  type: "credit" | "debit";
  amount: number;
  description?: string | null;
  userId?: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt?: string;
}
