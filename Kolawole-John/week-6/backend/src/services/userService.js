const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const userService = {
  async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await prisma.user.findMany({
      skip,
      take: limit
    });
  },

  async getById(id) {
    return await prisma.user.findUnique({
      where: { id }
    });
  },

  async create(userData) {
    return await prisma.user.create({
      data: userData
    });
  },

  async update(id, userData) {
    return await prisma.user.update({
      where: { id },
      data: userData
    });
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

module.exports = userService;