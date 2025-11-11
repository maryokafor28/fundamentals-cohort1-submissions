import request from "supertest";
import app from "../../app";
import User from "../../modules/users/model";
import Product from "../../modules/products/model";
import { generateToken } from "../../utils/token";

describe("Product E2E Tests - Complete Workflow", () => {
  const baseUrl = "/api/products";
  let authToken: string;
  let userId: string;
  let productId: string;

  beforeAll(async () => {
    // Create a test user and get auth token
    const user = new User({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    await user.save();

    userId = user._id.toString();
    authToken = generateToken(userId, user.email);
  });

  afterEach(async () => {
    // Clean up products after each test
    await Product.deleteMany({});
  });

  afterAll(async () => {
    // Clean up users after all tests
    await User.deleteMany({});
  });

  describe("Complete Product Lifecycle", () => {
    it("should complete full CRUD workflow", async () => {
      // 1. CREATE - Create a new product
      const createRes = await request(app)
        .post(baseUrl)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "iPhone 15",
          description: "Latest Apple smartphone",
          price: 999.99,
          stock: 50,
        });

      expect(createRes.status).toBe(201);
      expect(createRes.body.message).toBe("Product created");
      expect(createRes.body.data).toHaveProperty("_id");
      expect(createRes.body.data.name).toBe("iPhone 15");

      productId = createRes.body.data._id;

      // 2. READ ALL - Get all products
      const getAllRes = await request(app).get(baseUrl);

      expect(getAllRes.status).toBe(200);
      expect(getAllRes.body.data).toBeInstanceOf(Array);
      expect(getAllRes.body.data.length).toBe(1);
      expect(getAllRes.body.data[0].name).toBe("iPhone 15");

      // 3. READ ONE - Get single product by ID
      const getOneRes = await request(app).get(`${baseUrl}/${productId}`);

      expect(getOneRes.status).toBe(200);
      expect(getOneRes.body.data._id).toBe(productId);
      expect(getOneRes.body.data.name).toBe("iPhone 15");
      expect(getOneRes.body.data.price).toBe(999.99);

      // 4. UPDATE - Update the product
      const updateRes = await request(app)
        .put(`${baseUrl}/${productId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "iPhone 15 Pro",
          price: 1199.99,
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.message).toBe("Product updated");
      expect(updateRes.body.data.name).toBe("iPhone 15 Pro");
      expect(updateRes.body.data.price).toBe(1199.99);

      // 5. VERIFY UPDATE - Get the updated product
      const verifyRes = await request(app).get(`${baseUrl}/${productId}`);

      expect(verifyRes.status).toBe(200);
      expect(verifyRes.body.data.name).toBe("iPhone 15 Pro");
      expect(verifyRes.body.data.price).toBe(1199.99);

      // 6. DELETE - Delete the product
      const deleteRes = await request(app)
        .delete(`${baseUrl}/${productId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toBe("Product deleted");

      // 7. VERIFY DELETION - Try to get deleted product
      const verifyDeleteRes = await request(app).get(`${baseUrl}/${productId}`);

      expect(verifyDeleteRes.status).toBe(404);
      expect(verifyDeleteRes.body.message).toBe("Product not found");

      // 8. VERIFY EMPTY LIST - Get all products (should be empty)
      const emptyListRes = await request(app).get(baseUrl);

      expect(emptyListRes.status).toBe(200);
      expect(emptyListRes.body.data.length).toBe(0);
    });
  });

  describe("Multi-Product Workflow", () => {
    it("should handle multiple products correctly", async () => {
      // Create multiple products
      const products = [
        { name: "Product 1", price: 100, stock: 10 },
        { name: "Product 2", price: 200, stock: 20 },
        { name: "Product 3", price: 300, stock: 30 },
      ];

      for (const product of products) {
        await request(app)
          .post(baseUrl)
          .set("Authorization", `Bearer ${authToken}`)
          .send(product);
      }

      // Get all products
      const res = await request(app).get(baseUrl);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(3);

      // Verify they're sorted by createdAt (newest first)
      expect(res.body.data[0].name).toBe("Product 3");
      expect(res.body.data[1].name).toBe("Product 2");
      expect(res.body.data[2].name).toBe("Product 1");
    });
  });

  describe("Authentication Workflow", () => {
    it("should require authentication for protected routes", async () => {
      // Try to create without token
      const createRes = await request(app)
        .post(baseUrl)
        .send({ name: "Unauthorized Product", price: 99 });

      expect(createRes.status).toBe(401);

      // Try to update without token
      const updateRes = await request(app)
        .put(`${baseUrl}/someid`)
        .send({ name: "Updated" });

      expect(updateRes.status).toBe(401);

      // Try to delete without token
      const deleteRes = await request(app).delete(`${baseUrl}/someid`);

      expect(deleteRes.status).toBe(401);

      // Public routes should work without token
      const getAllRes = await request(app).get(baseUrl);
      expect(getAllRes.status).toBe(200);
    });
  });

  describe("Error Handling Workflow", () => {
    it("should handle non-existent products", async () => {
      const getRes = await request(app).get(
        `${baseUrl}/507f1f77bcf86cd799439011`
      );
      expect(getRes.status).toBe(404);
    });

    it("should handle update of non-existent product", async () => {
      const updateRes = await request(app)
        .put(`${baseUrl}/507f1f77bcf86cd799439011`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Updated" });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data).toBeNull();
    });
  });

  describe("Data Integrity Workflow", () => {
    it("should maintain data integrity across operations", async () => {
      // Create product
      const createRes = await request(app)
        .post(baseUrl)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Test Product",
          description: "Original description",
          price: 100,
          stock: 50,
        });

      productId = createRes.body.data._id;

      // Update only some fields
      await request(app)
        .put(`${baseUrl}/${productId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          price: 150,
        });

      // Verify other fields remain unchanged
      const res = await request(app).get(`${baseUrl}/${productId}`);

      expect(res.body.data.name).toBe("Test Product");
      expect(res.body.data.description).toBe("Original description");
      expect(res.body.data.price).toBe(150);
      expect(res.body.data.stock).toBe(50);
    });
  });

  describe("Concurrent Operations Workflow", () => {
    it("should handle concurrent requests correctly", async () => {
      // Create multiple products concurrently
      const promises = Array(5)
        .fill(null)
        .map((_, i) =>
          request(app)
            .post(baseUrl)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
              name: `Product ${i + 1}`,
              price: (i + 1) * 100,
              stock: 10,
            })
        );

      const results = await Promise.all(promises);

      // All should succeed
      results.forEach((res) => {
        expect(res.status).toBe(201);
      });

      // Verify all products exist
      const getAllRes = await request(app).get(baseUrl);
      expect(getAllRes.body.data.length).toBe(5);
    });
  });
});
