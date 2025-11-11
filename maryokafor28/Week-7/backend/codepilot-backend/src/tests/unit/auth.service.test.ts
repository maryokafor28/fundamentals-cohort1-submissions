import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../../modules/users/model";
import * as AuthService from "../../modules/auth/service";
import { generateToken, verifyToken } from "../../utils/token";

// 🧩 Mock external dependencies
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../modules/users/model");

describe("Auth Service Unit Tests", () => {
  const mockUserId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 🧪 Test registration
  test("should register a new user successfully", async () => {
    const newUserId = new mongoose.Types.ObjectId();

    // Mock the created user instance
    const mockUserInstance = {
      _id: newUserId,
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
      save: jest.fn().mockResolvedValue({
        _id: newUserId,
        name: "Test User",
        email: "test@example.com",
      }),
    };

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (User.findOne as jest.Mock).mockResolvedValue(null);

    // ✅ Mock User as a constructor that returns our mock instance
    (User as unknown as jest.Mock).mockImplementation(() => mockUserInstance);

    const result = await AuthService.registerUser({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockUserInstance.save).toHaveBeenCalled();
    expect(result.email).toBe("test@example.com");
    expect(result.name).toBe("Test User");
    expect(result._id).toBe(newUserId.toString());
  });

  // ❌ Test duplicate email
  test("should throw error if email already exists", async () => {
    const existingUser = {
      _id: mockUserId,
      name: "Existing User",
      email: "test@example.com",
    };

    (User.findOne as jest.Mock).mockResolvedValue(existingUser);

    await expect(
      AuthService.registerUser({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toThrow("User already exists");

    // Ensure User constructor was never called
    expect(User).not.toHaveBeenCalled();
  });

  // 🧠 Test login success
  test("should login successfully with correct credentials", async () => {
    const mockUser = {
      _id: mockUserId,
      name: "Test User",
      email: "test@example.com",
      password: "hashedPassword",
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock).mockReturnValue("fake.jwt.token");

    const result = await AuthService.loginUser({
      email: "test@example.com",
      password: "password123",
    });

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockUser.comparePassword).toHaveBeenCalledWith("password123");
    expect(result.token).toBe("fake.jwt.token");
    expect(result.user._id).toBe(mockUserId.toString());
    expect(result.user.email).toBe("test@example.com");
    expect(result.user.name).toBe("Test User");
  });

  // 🚫 Test wrong password
  test("should throw error for invalid credentials", async () => {
    const mockUser = {
      _id: mockUserId,
      email: "test@example.com",
      comparePassword: jest.fn().mockResolvedValue(false),
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    await expect(
      AuthService.loginUser({
        email: "test@example.com",
        password: "wrongpass",
      })
    ).rejects.toThrow("Invalid credentials");

    expect(mockUser.comparePassword).toHaveBeenCalledWith("wrongpass");
  });

  // 🔍 Test login with non-existent user
  test("should throw error when user not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      AuthService.loginUser({
        email: "notfound@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  // 🧩 Test generateToken utility
  test("should generate a valid JWT token", () => {
    (jwt.sign as jest.Mock).mockReturnValue("mock.token");

    const token = generateToken("12345", "test@example.com");

    expect(jwt.sign).toHaveBeenCalled();
    expect(token).toBe("mock.token");
  });

  // 🧩 Test verifyToken utility
  test("should verify a valid JWT token", () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      id: "12345",
      email: "test@example.com",
    });

    const decoded = verifyToken("mock.token");

    expect(jwt.verify).toHaveBeenCalled();
    expect(decoded.email).toBe("test@example.com");
  });

  test("should throw error for invalid token", () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid or expired token");
    });

    expect(() => verifyToken("bad.token")).toThrow("Invalid or expired token");
  });
});
