import request from "supertest";
import app from "../src/server";
import mongoose from "mongoose";

describe("Auth Endpoints", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: `test${Date.now()}@mail.com`,
        password: "password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should not register with existing email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "duplicate@mail.com",
      password: "password123",
    });
    const res2 = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "duplicate@mail.com",
      password: "password123",
    });

    expect(res2.statusCode).toBe(400);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
