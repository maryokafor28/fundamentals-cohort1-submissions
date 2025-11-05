import request from "supertest";
import app from "../src/index";
import mongoose from "mongoose";
import Product from "../src/models/Product";
// import Cart from "../src/models/Cart";
jest.setTimeout(60000); // 30 seconds


beforeAll(async () => {
  await mongoose.connect(process.env.Mongo_URI as string);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Cart Routes", () => {
  let productId: string;
  let userId = "guest-12345";

  beforeAll(async () => {
    const product = new Product({ 
  name: "Cart Product " + Date.now(), 
  image: "cart.png", 
  inStock: 20 
});
    const saved = await product.save();
    productId = saved._id.toString();
  });

  it("should add item to cart", async () => {
    const res = await request(app)
      .post("/api/cart/add")
      .send({ userId, productId });

    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(userId);
    expect(res.body.products).toContain(productId);
  });

  it("should get cart items", async () => {
    const res = await request(app).get(`/api/cart/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it("should remove item from cart", async () => {
    const res = await request(app)
      .post("/api/cart/remove")
      .send({ userId, productId });

    expect(res.status).toBe(200);
    expect(res.body.products).not.toContain(productId);
  });
});
