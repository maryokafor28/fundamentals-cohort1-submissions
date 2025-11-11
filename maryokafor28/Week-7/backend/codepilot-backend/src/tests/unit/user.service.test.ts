import User from "../../modules/users/model";
import * as UserService from "../../modules/users/service";

// 🧩 Mock the User model - path must match the import!
jest.mock("../../modules/users/model");

describe("User Service Unit Tests", () => {
  const mockUser = {
    _id: "12345",
    name: "John Doe",
    email: "john@example.com",
    password: "hashedPassword",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 🧠 getUserById
  test("should get user by ID successfully", async () => {
    const mockSelect = jest.fn().mockResolvedValue({
      _id: "12345",
      name: "John Doe",
      email: "john@example.com",
    });

    (User.findById as jest.Mock).mockReturnValue({ select: mockSelect });

    const result = await UserService.getUserById("12345");

    expect(User.findById).toHaveBeenCalledWith("12345");
    expect(mockSelect).toHaveBeenCalledWith("-password");
    expect(result).not.toBeNull();

    if (result) {
      expect(result.email).toBe("john@example.com");
      expect(result).not.toHaveProperty("password"); // ✅ Ensure password is excluded
    }
  });

  // 🧠 getUserById — user not found
  test("should return null if user is not found", async () => {
    const mockSelect = jest.fn().mockResolvedValue(null);

    (User.findById as jest.Mock).mockReturnValue({ select: mockSelect });

    const result = await UserService.getUserById("99999");

    expect(User.findById).toHaveBeenCalledWith("99999");
    expect(mockSelect).toHaveBeenCalledWith("-password");
    expect(result).toBeNull();
  });

  // ✏️ updateUser
  test("should update user successfully", async () => {
    const updatedUser = {
      _id: "12345",
      name: "Jane Updated",
      email: "john@example.com",
    };

    const mockSelect = jest.fn().mockResolvedValue(updatedUser);

    (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await UserService.updateUser("12345", {
      name: "Jane Updated",
    });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "12345",
      { $set: { name: "Jane Updated" } },
      { new: true, runValidators: true }
    );
    expect(mockSelect).toHaveBeenCalledWith("-password");
    expect(result).not.toBeNull();

    if (result) {
      expect(result.name).toBe("Jane Updated");
    }
  });

  // ✏️ updateUser — user not found
  test("should return null if user not found during update", async () => {
    const mockSelect = jest.fn().mockResolvedValue(null);

    (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await UserService.updateUser("notfound", { name: "Ghost" });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "notfound",
      { $set: { name: "Ghost" } },
      { new: true, runValidators: true }
    );
    expect(mockSelect).toHaveBeenCalledWith("-password");
    expect(result).toBeNull();
  });

  // 🔒 updateUser — should handle empty update data
  test("should handle empty update data", async () => {
    const mockSelect = jest.fn().mockResolvedValue(mockUser);

    (User.findByIdAndUpdate as jest.Mock).mockReturnValue({
      select: mockSelect,
    });

    const result = await UserService.updateUser("12345", {});

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "12345",
      { $set: {} },
      { new: true, runValidators: true }
    );

    expect(result).not.toBeNull();
    if (result) {
      expect(result.name).toBe("John Doe");
    }
  });
});
