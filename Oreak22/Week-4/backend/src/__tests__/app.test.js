import request from "supertest";
import app from "../app.js";

describe("GET /hello", () => {
  it("should return Hello World", async () => {
    const res = await request(app).get("/hello");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Hello World");
  });
});
