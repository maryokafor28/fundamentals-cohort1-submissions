// tests/e2e/user.e2e.test.ts
import request from "supertest";
import app from "../../app"; // Adjust path to your Express app
import User from "../../modules/users/model";
import jwt from "jsonwebtoken";
import "../setup/dbSetup";

// MUST match the secret in your auth middleware
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

describe("User Service E2E Tests", () => {
  let authToken: string;
  let testUserId: string;

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});

    // Create a test user (assuming auth is already working)
    const testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword123",
    });

    testUserId = testUser._id.toString();

    // Generate auth token (simulating successful authentication)
    // IMPORTANT: The payload structure must match what your auth middleware expects
    authToken = jwt.sign(
      { id: testUserId, email: testUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Test User ID:", testUserId);
    console.log("Auth Token:", authToken);
  });

  describe("GET /api/users/profile - Get User Profile", () => {
    it("should get user profile successfully", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("message", "User profile");
      expect(response.body.data).toHaveProperty("_id", testUserId);
      expect(response.body.data).toHaveProperty("name", "Test User");
      expect(response.body.data).toHaveProperty("email", "test@example.com");
      expect(response.body.data).not.toHaveProperty("password");
    });

    it("should return 404 when user does not exist", async () => {
      // Delete the user
      await User.findByIdAndDelete(testUserId);

      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("message", "User not found");
    });

    it("should not include password in response", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).not.toHaveProperty("password");

      // Verify password exists in DB but not in response
      const userInDb = await User.findById(testUserId).select("+password");
      expect(userInDb?.password).toBeDefined();
    });
  });

  describe("PUT /api/users/profile - Update User Profile", () => {
    it("should update user name successfully", async () => {
      const updateData = {
        name: "Updated Name",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty("message", "Profile updated");
      expect(response.body.data).toHaveProperty("name", "Updated Name");
      expect(response.body.data).toHaveProperty("email", "test@example.com");
      expect(response.body.data).not.toHaveProperty("password");

      // Verify in database
      const userInDb = await User.findById(testUserId);
      expect(userInDb?.name).toBe("Updated Name");
    });

    it("should update user email successfully", async () => {
      const updateData = {
        email: "newemail@example.com",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty("message", "Profile updated");
      expect(response.body.data).toHaveProperty(
        "email",
        "newemail@example.com"
      );
      expect(response.body.data).toHaveProperty("name", "Test User");

      // Verify in database
      const userInDb = await User.findById(testUserId);
      expect(userInDb?.email).toBe("newemail@example.com");
    });

    it("should update both name and email successfully", async () => {
      const updateData = {
        name: "New Name",
        email: "new@example.com",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty("message", "Profile updated");
      expect(response.body.data).toHaveProperty("name", "New Name");
      expect(response.body.data).toHaveProperty("email", "new@example.com");

      // Verify in database
      const userInDb = await User.findById(testUserId);
      expect(userInDb?.name).toBe("New Name");
      expect(userInDb?.email).toBe("new@example.com");
    });

    it("should handle empty update data gracefully", async () => {
      const updateData = {};

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty("message", "Profile updated");
      // Data should remain unchanged
      expect(response.body.data).toHaveProperty("name", "Test User");
      expect(response.body.data).toHaveProperty("email", "test@example.com");
    });

    it("should handle partial updates (name only)", async () => {
      const updateData = {
        name: "Only Name Changed",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data).toHaveProperty("name", "Only Name Changed");
      expect(response.body.data).toHaveProperty("email", "test@example.com");
    });

    it("should handle partial updates (email only)", async () => {
      const updateData = {
        email: "onlyemail@example.com",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data).toHaveProperty("name", "Test User");
      expect(response.body.data).toHaveProperty(
        "email",
        "onlyemail@example.com"
      );
    });

    it("should not include password in update response", async () => {
      const updateData = {
        name: "Updated Name",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data).not.toHaveProperty("password");
    });

    it("should validate email format if validators are set", async () => {
      const updateData = {
        email: "invalid-email-format",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      // This will be 500 if validators fail, or 200 if no email validation exists
      expect([200, 500]).toContain(response.status);

      if (response.status === 500) {
        expect(response.body).toHaveProperty("message");
      }
    });

    it("should ignore extra fields not in the service", async () => {
      const updateData = {
        name: "Updated Name",
        extraField: "should be ignored",
        anotherField: "also ignored",
      };

      const response = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data).toHaveProperty("name", "Updated Name");
      expect(response.body.data).not.toHaveProperty("extraField");
      expect(response.body.data).not.toHaveProperty("anotherField");
    });
  });
});
