import request from "supertest";
import app from "../src/server";
import mongoose from "mongoose";

describe("Project Endpoints", () => {
  let token: string;
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "ProjUser",
        email: `proj${Date.now()}@mail.com`,
        password: "123456",
      });
    token = res.body.token;
  });

  it("should create a project", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My Test Project",
        description: "This is a test",
        techStack: ["Node.js", "React"],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("title", "My Test Project");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
