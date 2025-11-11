import request from "supertest";
import app from "../../app";
import User from "../../modules/users/model";

describe("Auth E2E Tests - Complete Workflow", () => {
  const authUrl = "/api/auth";
  const usersUrl = "/api/users";
  const productsUrl = "/api/products";

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
  });

  describe("Complete Registration and Login Flow", () => {
    it("should register, login, and access protected routes", async () => {
      // 1. REGISTER - Create new account
      const registerRes = await request(app).post(`${authUrl}/register`).send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(registerRes.status).toBe(201);
      expect(registerRes.body.message).toBe("User registered successfully");
      expect(registerRes.body.user).toHaveProperty("_id");
      expect(registerRes.body.user.email).toBe("john@example.com");
      expect(registerRes.body.user).not.toHaveProperty("password");

      // 2. LOGIN - Get authentication token
      const loginRes = await request(app).post(`${authUrl}/login`).send({
        email: "john@example.com",
        password: "password123",
      });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body).toHaveProperty("token");
      expect(loginRes.body.user.email).toBe("john@example.com");

      const token = loginRes.body.token;

      // 3. ACCESS PROTECTED ROUTE - Get user profile
      const profileRes = await request(app)
        .get(`${usersUrl}/profile`)
        .set("Authorization", `Bearer ${token}`);

      expect(profileRes.status).toBe(200);
      expect(profileRes.body.data.email).toBe("john@example.com");
      expect(profileRes.body.data).not.toHaveProperty("password");

      // 4. UPDATE PROFILE - Modify user data
      const updateRes = await request(app)
        .put(`${usersUrl}/profile`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "John Updated",
          email: "john.updated@example.com",
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.name).toBe("John Updated");
      expect(updateRes.body.data.email).toBe("john.updated@example.com");

      // 5. VERIFY UPDATE - Login with new email
      const newLoginRes = await request(app).post(`${authUrl}/login`).send({
        email: "john.updated@example.com",
        password: "password123",
      });

      expect(newLoginRes.status).toBe(200);
      expect(newLoginRes.body).toHaveProperty("token");

      // 6. CREATE PROTECTED RESOURCE - Create product
      const productRes = await request(app)
        .post(productsUrl)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Test Product",
          price: 99.99,
          stock: 10,
        });

      expect(productRes.status).toBe(201);
      expect(productRes.body.data.name).toBe("Test Product");
    });
  });

  describe("Authentication Security Workflow", () => {
    it("should prevent access without authentication", async () => {
      // Try to access protected routes without token
      const profileRes = await request(app).get(`${usersUrl}/profile`);
      expect(profileRes.status).toBe(401);
      expect(profileRes.body.message).toMatch(/no token/i);

      const updateRes = await request(app)
        .put(`${usersUrl}/profile`)
        .send({ name: "Hacker" });
      expect(updateRes.status).toBe(401);

      const createProductRes = await request(app)
        .post(productsUrl)
        .send({ name: "Unauthorized Product" });
      expect(createProductRes.status).toBe(401);
    });

    it("should reject invalid tokens", async () => {
      const invalidToken = "invalid.jwt.token";

      const res = await request(app)
        .get(`${usersUrl}/profile`)
        .set("Authorization", `Bearer ${invalidToken}`);

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid or expired token/i);
    });

    it("should reject malformed authorization header", async () => {
      // Missing "Bearer" prefix
      const res1 = await request(app)
        .get(`${usersUrl}/profile`)
        .set("Authorization", "some-token");

      expect(res1.status).toBe(401);

      // No token after Bearer
      const res2 = await request(app)
        .get(`${usersUrl}/profile`)
        .set("Authorization", "Bearer ");

      expect(res2.status).toBe(401);
    });
  });

  describe("Multiple Users Workflow", () => {
    it("should handle multiple users independently", async () => {
      // Register User 1
      const user1RegisterRes = await request(app)
        .post(`${authUrl}/register`)
        .send({
          name: "User One",
          email: "user1@example.com",
          password: "password123",
        });
      expect(user1RegisterRes.status).toBe(201);

      // Register User 2
      const user2RegisterRes = await request(app)
        .post(`${authUrl}/register`)
        .send({
          name: "User Two",
          email: "user2@example.com",
          password: "password456",
        });
      expect(user2RegisterRes.status).toBe(201);

      // Login User 1
      const user1LoginRes = await request(app).post(`${authUrl}/login`).send({
        email: "user1@example.com",
        password: "password123",
      });
      const token1 = user1LoginRes.body.token;

      // Login User 2
      const user2LoginRes = await request(app).post(`${authUrl}/login`).send({
        email: "user2@example.com",
        password: "password456",
      });
      const token2 = user2LoginRes.body.token;

      // User 1 accesses their profile
      const user1ProfileRes = await request(app)
        .get(`${usersUrl}/profile`)
        .set("Authorization", `Bearer ${token1}`);
      expect(user1ProfileRes.body.data.email).toBe("user1@example.com");

      // User 2 accesses their profile
      const user2ProfileRes = await request(app)
        .get(`${usersUrl}/profile`)
        .set("Authorization", `Bearer ${token2}`);
      expect(user2ProfileRes.body.data.email).toBe("user2@example.com");

      // Verify tokens are user-specific (User 1 can't see User 2's data)
      expect(user1ProfileRes.body.data.email).not.toBe(
        user2ProfileRes.body.data.email
      );
    });
  });

  describe("Password Security Workflow", () => {
    it("should hash passwords and never expose them", async () => {
      // Register user
      const registerRes = await request(app).post(`${authUrl}/register`).send({
        name: "Secure User",
        email: "secure@example.com",
        password: "mysecretpassword",
      });

      // Password should not be in response
      expect(registerRes.body.user).not.toHaveProperty("password");

      // Login and get token
      const loginRes = await request(app).post(`${authUrl}/login`).send({
        email: "secure@example.com",
        password: "mysecretpassword",
      });
      const token = loginRes.body.token;

      // Check profile - password should not be exposed
      const profileRes = await request(app)
        .get(`${usersUrl}/profile`)
        .set("Authorization", `Bearer ${token}`);

      expect(profileRes.body.data).not.toHaveProperty("password");

      // Check database directly
      const userInDb = await User.findOne({ email: "secure@example.com" });

      // Password should be hashed (not plain text)
      expect(userInDb?.password).not.toBe("mysecretpassword");
      expect(userInDb?.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
    });

    it("should reject wrong passwords", async () => {
      // Register user
      await request(app).post(`${authUrl}/register`).send({
        name: "Test User",
        email: "test@example.com",
        password: "correctpassword",
      });

      // Try login with wrong password
      const res = await request(app).post(`${authUrl}/login`).send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });
  });

  describe("Token Expiration Workflow", () => {
    it("should generate valid tokens with user data", async () => {
      // Register and login
      await request(app).post(`${authUrl}/register`).send({
        name: "Token User",
        email: "token@example.com",
        password: "password123",
      });

      const loginRes = await request(app).post(`${authUrl}/login`).send({
        email: "token@example.com",
        password: "password123",
      });

      const token = loginRes.body.token;

      // Token should have 3 parts (JWT format)
      expect(token.split(".").length).toBe(3);

      // Should be able to use token immediately
      const profileRes = await request(app)
        .get(`${usersUrl}/profile`)
        .set("Authorization", `Bearer ${token}`);

      expect(profileRes.status).toBe(200);
    });
  });

  describe("Registration Validation Workflow", () => {
    it("should prevent duplicate registrations", async () => {
      // First registration
      await request(app).post(`${authUrl}/register`).send({
        name: "First User",
        email: "duplicate@example.com",
        password: "password123",
      });

      // Try duplicate registration
      const res = await request(app).post(`${authUrl}/register`).send({
        name: "Second User",
        email: "duplicate@example.com",
        password: "password456",
      });

      expect(res.status).toBe(409);
      expect(res.body.message).toMatch(/email already exists/i);
    });

    it("should reject incomplete registration data", async () => {
      // Missing name
      const res1 = await request(app).post(`${authUrl}/register`).send({
        email: "test@example.com",
        password: "password123",
      });
      expect(res1.status).toBe(400);

      // Missing email
      const res2 = await request(app).post(`${authUrl}/register`).send({
        name: "Test User",
        password: "password123",
      });
      expect(res2.status).toBe(400);

      // Missing password
      const res3 = await request(app).post(`${authUrl}/register`).send({
        name: "Test User",
        email: "test@example.com",
      });
      expect(res3.status).toBe(400);
    });
  });

  describe("Login Validation Workflow", () => {
    it("should reject login with missing credentials", async () => {
      // Missing email
      const res1 = await request(app)
        .post(`${authUrl}/login`)
        .send({ password: "password123" });
      expect(res1.status).toBe(400);
      expect(res1.body.message).toMatch(/missing credentials/i);

      // Missing password
      const res2 = await request(app)
        .post(`${authUrl}/login`)
        .send({ email: "test@example.com" });
      expect(res2.status).toBe(400);
    });

    it("should reject login for non-existent user", async () => {
      const res = await request(app).post(`${authUrl}/login`).send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });
  });

  describe("Session Persistence Workflow", () => {
    it("should maintain session across multiple requests", async () => {
      // Register and login
      await request(app).post(`${authUrl}/register`).send({
        name: "Session User",
        email: "session@example.com",
        password: "password123",
      });

      const loginRes = await request(app).post(`${authUrl}/login`).send({
        email: "session@example.com",
        password: "password123",
      });

      const token = loginRes.body.token;

      // Make multiple authenticated requests with same token
      const requests = Array(5)
        .fill(null)
        .map(() =>
          request(app)
            .get(`${usersUrl}/profile`)
            .set("Authorization", `Bearer ${token}`)
        );

      const responses = await Promise.all(requests);

      // All requests should succeed with same token
      responses.forEach((res) => {
        expect(res.status).toBe(200);
        expect(res.body.data.email).toBe("session@example.com");
      });
    });
  });
});
