import request from "supertest";
import app from "../src/server";
import mongoose from "mongoose";

describe("Comment Endpoints", () => {
  let token: string;
  let projectId: string;

  beforeAll(async () => {
    const userRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Commenter",
        email: `comment${Date.now()}@mail.com`,
        password: "123456",
      });
    token = userRes.body.token;

    const projRes = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Comment Project",
        description: "Test project for comments",
        techStack: ["Express"],
      });
    projectId = projRes.body._id;
  });

  it("should add a comment to project", async () => {
    const res = await request(app)
      .post(`/api/comments/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Nice work!" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("text", "Nice work!");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
