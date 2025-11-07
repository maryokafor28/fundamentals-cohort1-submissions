export interface CartItem {
  productId: string;
  quantity: number;
}

export type CartProp = {
  userId: string;
  items: CartItem[];
  onFetchCart: () => void;
  token: string;
};
