import request from "supertest";
import app from "../app";

describe("App.ts", () => {
  it("should return 404 for unknown route", async () => {
    const res = await request(app).get("/unknown-route");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
  });
});
