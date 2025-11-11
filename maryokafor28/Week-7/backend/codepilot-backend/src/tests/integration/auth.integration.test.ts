import request from "supertest";
import app from "../../app";
import User from "../../modules/users/model";

describe("Auth Integration Tests", () => {
  const baseUrl = "/api/auth";

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should register a new user successfully", async () => {
    const res = await request(app).post(`${baseUrl}/register`).send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.user).toHaveProperty("email", "john@example.com"); // ✅ Changed to .user
    expect(res.body.user).not.toHaveProperty("password"); // ✅ Verify password is hidden
  });

  it("should not register a user with an existing email", async () => {
    // First registration (using the API to ensure password is hashed)
    await request(app).post(`${baseUrl}/register`).send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });

    // Try duplicate registration
    const res = await request(app).post(`${baseUrl}/register`).send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });

    expect(res.status).toBe(409); // ✅ Service throws error → 400
    expect(res.body.message).toMatch(/Email already exists/i); // ✅ Actual message
  });

  it("should login successfully with valid credentials", async () => {
    // Register first (so password gets hashed properly)
    await request(app).post(`${baseUrl}/register`).send({
      name: "Login User",
      email: "login@example.com",
      password: "password123",
    });

    // Then login
    const res = await request(app).post(`${baseUrl}/login`).send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "login@example.com");
  });

  it("should fail login with wrong password", async () => {
    // Register first
    await request(app).post(`${baseUrl}/register`).send({
      name: "Wrong Password",
      email: "wrongpass@example.com",
      password: "password123",
    });

    // Try login with wrong password
    const res = await request(app).post(`${baseUrl}/login`).send({
      email: "wrongpass@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401); // ✅ Correct status for wrong credentials
    expect(res.body.message).toMatch(/invalid credentials/i);
  });

  it("should fail login with non-existent email", async () => {
    const res = await request(app).post(`${baseUrl}/login`).send({
      email: "notfound@example.com",
      password: "password123",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid credentials/i);
  });
});
