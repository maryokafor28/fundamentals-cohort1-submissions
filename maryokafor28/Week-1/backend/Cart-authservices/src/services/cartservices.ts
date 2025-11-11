import Cart from "../models/cartschema";
import type { CartDocument, CartItem } from "../models/cartschema";

// Input type for adding to cart
interface AddToCartInput {
  userId: string;
  productId: string;
  name: string;
  price: number;
  quantity?: number;
  description?: string | null;
  imageUrl?: string;
}

// Add item to cart
export const addToCart = async ({
  userId,
  productId,
  name,
  price,
  description = "",
  quantity = 1,
  imageUrl = "",
}: AddToCartInput): Promise<CartDocument> => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    // If found, just update the quantity and maybe price
    existingItem.quantity += quantity;
    existingItem.price = price;
    if (description) existingItem.description = description;
    if (imageUrl) existingItem.imageUrl = imageUrl;
  } else {
    // If not found, create and push as new product
    const newItem: CartItem = {
      productId,
      name,
      price,
      description,
      quantity,
      imageUrl,
    };
    cart.items.push(newItem);
  }

  return await cart.save();
};

// Get cart by userId
export const getCart = async (userId: string): Promise<CartDocument | null> => {
  return await Cart.findOne({ userId });
};
