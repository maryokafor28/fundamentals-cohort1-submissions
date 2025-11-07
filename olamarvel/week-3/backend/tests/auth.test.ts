import request from "supertest";
import app from "../src/index";
//import { connectDb } from "../src/config/db";

describe("Auth Routes", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "Password123!" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User created");
  });

  it("should login a user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "Password123!" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "Password123!" });
		console.log(res.body)
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should reject invalid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "wrongpass" });

    expect(res.status).toBe(401);
  });
});