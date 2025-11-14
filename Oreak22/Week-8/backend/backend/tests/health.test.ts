import request from "supertest";
import { app } from "../src/server";

describe("Health Route", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("Health Route", () => {
  it("returns a timestamp", async () => {
    const res = await request(app).get("/health");
    expect(res.body).toHaveProperty("timestamp");
    expect(typeof res.body.timestamp).toBe("number");
  });
});

describe("Metrics Route", () => {
  it("returns metrics", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.text).toContain("http_requests_total");
  });
});
