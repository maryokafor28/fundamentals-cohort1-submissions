import { registerUser } from "../services/authServices";
import bcrypt from "bcryptjs";
import User from "../models/users"; // mock the DB model

jest.mock("bcryptjs");
jest.mock("../models/users");

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedUser = User as jest.Mocked<typeof User>;

describe("Auth Service", () => {
  it("should hash password before saving user", async () => {
    // Mock bcrypt.hash to simulate hashing
    mockedBcrypt.hash.mockResolvedValue("hashedpass" as never);

    // Mock the User.create method (simulating DB save)
    mockedUser.create.mockResolvedValue({
      _id: "123",
      name: "Ada",
      email: "ada@example.com",
      password: "hashedpass",
    } as never);

    // Call your function
    const result = await registerUser("Ada", "ada@example.com", "123456");

    // ✅ Assertions
    expect(mockedBcrypt.hash).toHaveBeenCalledWith("123456", 10);
    expect(mockedUser.create).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      password: "hashedpass",
    });
    expect(result.email).toBe("ada@example.com");
  });
});
