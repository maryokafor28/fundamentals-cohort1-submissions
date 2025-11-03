export interface Product {
  productId: string;
  name: string;
  price: number;
  description: string;
  image: string;
  inStock: boolean;
}

export const mockProducts: Product[] = [
  {
    productId: "001",
    name: "Wireless Headphones",
    price: 199.99,
    description:
      "High-quality wireless headphones with noise cancellation and 30-hours battery life.",
    inStock: true,
    image: "../images/headset.jpg",
  },
  {
    productId: "002",
    name: "Smart Watch",
    price: 299.99,
    description:
      "Feature-rich smartwatch with health monitoring, GPS, and water resistance.",
    inStock: true,
    image: "../images/watch.jpg",
  },

  {
    productId: "003",
    name: "Laptop Stand",
    price: 79.99,
    description:
      "Ergonomic aluminum laptop stand with adjustable height and angle.",
    inStock: true,
    image: "../images/stand.jpg",
  },

  {
    productId: "004",
    name: "Mechanical Keyboard",
    price: 159.99,
    description:
      "Premium mechanical keyboard with RGB backlighting and tactile switches.",
    inStock: false,
    image: "../images/keyboard.jpg",
  },

  {
    productId: "005",
    name: "Coffee Mug",
    price: 24.99,
    description:
      "Insulated ceramic coffee mug that keeps your drink hot for hours.",
    inStock: true,
    image: "../images/mug.jpg",
  },

  {
    productId: "006",
    name: "Desk Lamp",
    price: 89.99,
    description:
      "Modern LED desk lamp with adjustable brightness and color temperature.",
    inStock: true,
    image: "../images/lamp.jpg",
  },
];
