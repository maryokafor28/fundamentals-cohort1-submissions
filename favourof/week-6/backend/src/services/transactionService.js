import { PrismaClient } from "@prisma/client";
import AppError from "../utils/AppError.js";

const prisma = new PrismaClient();

export const transactionService = {
  // Create transaction (credit or debit)
  async createTransaction(data) {
    const { userId, type, amount, description } = data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    // Update user balance
    let newBalance = user.balance;

    if (type === "credit") newBalance += amount;
    else if (type === "debit") {
      if (user.balance < amount)
        throw new AppError("Insufficient balance", 400);
      newBalance -= amount;
    } else {
      throw new AppError("Invalid transaction type", 400);
    }

    // Perform both update + transaction creation atomically
    const transaction = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });

      return await tx.transaction.create({
        data: { type, amount, description, userId },
      });
    });

    return transaction;
  },

  async getAllTransactions(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const transactions = await prisma.transaction.findMany({
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    return transactions;
  },

  async getTransactionById(id) {
    return await prisma.transaction.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  },
};
