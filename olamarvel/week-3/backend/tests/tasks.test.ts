import request from "supertest";
import app from "../src/index";

let token: string;

beforeAll(async () => {
  await request(app).post("/api/auth/register").send({
    email: "user@example.com",
    password: "Password123!",
  });

  const login = await request(app).post("/api/auth/login").send({
    email: "user@example.com",
    password: "Password123!",
  });

  token = login.body.accessToken;
});

describe("Task Routes", () => {
  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGU5MmM2MjQ0NDk3ZTBmNDc2Zjg1NmMiLCJyb2xlIjoidXNlciIsImlhdCI6MTc2MDExMTczMiwiZXhwIjoxNzYwMTEyNjMyfQ.1RpldjjMzx15kOAkyeb-fSi1B6GAUiYzTDx_AAS8btk`)
      .send({ title: "My first task", description: "testing" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Task created");
  });

  it("should list tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
