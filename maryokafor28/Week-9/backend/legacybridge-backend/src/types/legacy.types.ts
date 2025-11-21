export interface LegacyPayment {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface LegacyCustomer {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}
export interface LegacyUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
export interface LegacyPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
