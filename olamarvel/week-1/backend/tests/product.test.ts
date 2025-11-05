import request from "supertest";
import app from "../src/index"; // <-- your Express app export
import mongoose from "mongoose";
import Product from "../src/models/Product";
jest.setTimeout(30000); // 30 seconds

let productname="Cart Product " + Date.now()
beforeAll(async () => {
  // connect to in-memory Mongo or test DB
  await mongoose.connect(process.env.Mongo_URI as string);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Product Routes", () => {
  it("should add a product", async () => {
    const res = await request(app)
      .post("/api/products/add")
      .send({ 
        name: productname, 
        image: "cart.png", 
        inStock: 20 
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe(productname);
  });

  it("should get a product", async () => {
  const product = new Product({ 
    name: "Cart Product " + Date.now(), 
    image: "cart.png", 
    inStock: 20 
  });
  await product.save();

  const res = await request(app).get(`/api/products/product/${product._id}`);
  expect(res.status).toBe(200);
  expect(res.body.name).toBe(product.name); // match the actual saved name
  });

});
