import { generateToken } from "../../utils/token";
import User from "../../modules/users/model";

export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    isVerified: true,
  };

  const user = new User({ ...defaultUser, ...overrides });
  await user.save();
  return user;
};

export const createTestAdmin = async () => {
  return createTestUser({
    email: "admin@example.com",
  });
};

export const getAuthToken = (userId: string, email: string) => {
  return generateToken(userId, email);
};
