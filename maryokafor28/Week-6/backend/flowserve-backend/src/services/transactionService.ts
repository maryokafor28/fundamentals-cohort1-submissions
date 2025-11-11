import { PrismaClient, TransactionStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const transactionService = {
  async createTransaction(
    amount: number,
    description: string | undefined,
    senderId: string,
    receiverId: string
  ) {
    // ensure sender ≠ receiver
    if (senderId === receiverId) {
      throw new Error("Sender and receiver cannot be the same user");
    }

    return await prisma.transaction.create({
      data: {
        amount,
        description,
        senderId,
        receiverId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
  },

  async getTransactions(
    page = 1,
    limit = 10,
    status?: TransactionStatus,
    userId?: string // ✅ Add userId parameter
  ) {
    const skip = (page - 1) * limit;

    // ✅ Build where clause with userId filter
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.OR = [{ senderId: userId }, { receiverId: userId }];
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: { sender: true, receiver: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: transactions,
    };
  },

  async updateStatus(id: string, status: TransactionStatus) {
    const transaction = await prisma.transaction.findUnique({ where: { id } });

    if (!transaction) throw new Error("Transaction not found");

    if (
      transaction.status === TransactionStatus.COMPLETED &&
      status !== TransactionStatus.COMPLETED
    ) {
      throw new Error("Completed transactions cannot be modified");
    }

    return prisma.transaction.update({
      where: { id },
      data: { status },
      include: {
        sender: true,
        receiver: true,
      },
    });
  },
};
