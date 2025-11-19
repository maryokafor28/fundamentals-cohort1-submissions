import request from "supertest";
import express from "express";
import errorHandler from "../middlewares/errorHandler";

const app = express();

app.get("/error-test", () => {
  throw new Error("Test error");
});

app.use(errorHandler);

describe("Error Handler", () => {
  it("should return 500 and error message", async () => {
    const res = await request(app).get("/error-test");

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("message");
  });
});
