export interface UserType {
  id: string;
  name: string;
  email: string;
  balance: number;
  createdAt: string;
}

export interface SenderType {
  id: string;
  email: string;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiverType {
  id: string;
  email: string;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionType {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
  description: string;
  sender: SenderType;
  receiver: ReceiverType;
  user: UserType;
}
export interface NewUserFormData {
  name: string;
  email: string;
  balance: number;
}


export interface TransactionFormData {
  type: string;
  senderEmail?: string;
  receiverEmail?: string;
  userEmail?: string;
  amount: number;
  description: string;
}

