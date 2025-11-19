import request from "supertest";
import app from "../app";

describe("Metrics Endpoint", () => {
  it("should return Prometheus metrics text format", async () => {
    const res = await request(app).get("/api/metrics");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/plain");
    expect(res.text).toContain("process_cpu_user_seconds_total");
    expect(res.text).toContain("http_requests_total"); // your custom metric
  });
});
