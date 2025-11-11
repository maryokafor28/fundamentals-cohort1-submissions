// src/tests/integration/product.integration.test.ts
import request from "supertest";
import app from "../../app";
import { createTestUser, getAuthToken } from "../setup/helper";
import Product from "../../modules/products/model";

describe("Product Integration Tests", () => {
  let token: string;
  let productId: string;

  beforeAll(async () => {
    // Create a test user and token
    const user = await createTestUser({
      name: "Product Tester",
      email: "productuser@example.com",
    });

    token = getAuthToken(user._id.toString(), user.email);
  });

  // ✅ Create product
  it("should create a new product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Product",
        price: 99.99,
        description: "A great product for testing",
      })
      .expect(201);

    expect(res.body.message).toBe("Product created");
    expect(res.body.data.name).toBe("Test Product");
    expect(res.body.data.price).toBe(99.99);

    productId = res.body.data._id;
  });

  // ✅ Get all products
  it("should fetch all products", async () => {
    const res = await request(app).get("/api/products").expect(200);

    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty("name");
  });

  // ✅ Get single product
  it("should fetch a product by ID", async () => {
    const res = await request(app)
      .get(`/api/products/${productId}`)
      .expect(200);

    expect(res.body.data._id).toBe(productId);
  });

  // ✅ Update product
  it("should update a product", async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Product Name" })
      .expect(200);

    expect(res.body.message).toBe("Product updated");
    expect(res.body.data.name).toBe("Updated Product Name");
  });

  // ✅ Delete product
  it("should delete a product", async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe("Product deleted");

    // Verify it's gone
    const deleted = await Product.findById(productId);
    expect(deleted).toBeNull();
  });

  // 🚫 Unauthorized creation attempt
  it("should fail to create a product without token", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({
        name: "Unauthorized Product",
        price: 12.99,
      })
      .expect(401);

    expect(res.body.message).toMatch(/no token, authorization denied/i);
  });
});
