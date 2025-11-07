import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const userService = {
  async createUser(data) {
    const user = await prisma.user.create({
      data,
    });
    return user;
  },

  // Get all users (with pagination)
  async getUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { id: "asc" },
    });

    return users;
  },

  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  },

  async updateUser(id, data) {
    try {
      const updated = await prisma.user.update({
        where: { id },
        data,
      });
      return updated;
    } catch (error) {
      return null;
    }
  },

  // Delete user
  async deleteUser(id) {
    try {
      const deleted = await prisma.user.delete({
        where: { id },
      });
      return deleted;
    } catch (err) {
      return null;
    }
  },
};
