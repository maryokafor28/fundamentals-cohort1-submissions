const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const transactionService = {
  async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await prisma.transaction.findMany({
      skip,
      take: limit,
      include: {
        user: true
      }
    });
  },

  async getById(id) {
    return await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
  },

  async getUserTransactions(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await prisma.transaction.findMany({
      where: { userId },
      skip,
      take: limit,
      include: {
        user: true
      }
    });
  },

  async create(transactionData) {
    return await prisma.transaction.create({
      data: transactionData,
      include: {
        user: true
      }
    });
  }
};

module.exports = transactionService;