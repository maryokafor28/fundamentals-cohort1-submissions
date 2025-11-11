import request from "supertest";
import app from "../../app";
import { createTestUser, getAuthToken } from "../setup/helper";

describe("User Integration Tests", () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const user = await createTestUser({
      name: "User Tester",
      email: "userint@example.com",
    });
    token = getAuthToken(user._id.toString(), user.email);
    userId = user._id.toString();
  });

  // ✅ Get user profile
  it("should get the logged-in user's profile", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("data");
    expect(res.body.data.email).toBe("userint@example.com");
  });

  // ✅ Update user profile
  it("should update the logged-in user's profile", async () => {
    const res = await request(app)
      .put("/api/users/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Name",
        email: "updated@example.com",
      })
      .expect(200);

    expect(res.body.data.name).toBe("Updated Name");
    expect(res.body.data.email).toBe("updated@example.com");
  });

  // 🚫 Unauthorized access
  it("should fail when no token is provided", async () => {
    const res = await request(app).get("/api/users/profile").expect(401);
    expect(res.body.message).toMatch(/(unauthorized|no token)/i);
  });
});
