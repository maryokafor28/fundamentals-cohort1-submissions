import prisma from "../prisma/client";
import { TransactionInput } from "../schemas/transaction.schema";
import { ApiError } from "../middlewares/errorHandler";
export const createTransaction = async (data: TransactionInput) => {
  return await prisma.$transaction(async (tx) => {
    if (data.type === "TRANSFER") {
      const sender = await tx.user.findUnique({
        where: { email: data.senderEmail },
      });
      const receiver = await tx.user.findUnique({
        where: { email: data.receiverEmail },
      });

      if (!sender || !receiver)
        throw new ApiError("Sender or receiver not found", 404);
      if (sender.email === receiver.email)
        throw new ApiError("Sender and receiver cannot be the same", 400);
      if (sender.balance < data.amount)
        throw new ApiError("Insufficient funds in sender’s wallet", 400);

      const updatedSender = await tx.user.update({
        where: { id: sender.id },
        data: { balance: sender.balance - data.amount },
      });

      const updatedReceiver = await tx.user.update({
        where: { id: receiver.id },
        data: { balance: receiver.balance + data.amount },
      });

      const transaction = await tx.transaction.create({
        data: {
          type: "TRANSFER",
          amount: data.amount,
          description: data.description,
          senderId: sender.id,
          receiverId: receiver.id,
        },
      });

      return { transaction, updatedSender, updatedReceiver };
    }

    if (data.type === "DEPOSIT" || data.type === "WITHDRAWAL") {
      const user = await tx.user.findUnique({
        where: { email: data.userEmail! },
      });
      if (!user) throw new ApiError("User not found", 404);

      let newBalance = user.balance;
      if (data.type === "DEPOSIT") {
        newBalance += data.amount;
      } else if (data.type === "WITHDRAWAL") {
        if (user.balance < data.amount)
          throw new ApiError("Insufficient funds for withdrawal", 400);
        newBalance -= data.amount;
      }

      const transaction = await tx.transaction.create({
        data: {
          type: data.type,
          amount: data.amount,
          description: data.description,
          senderId: user.id,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { balance: newBalance },
      });

      return { transaction };
    }

    throw new ApiError("Invalid transaction type", 400);
  });
};

export const getAllTransactions = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { sender: true, receiver: true },
    }),
    prisma.transaction.count(),
  ]);

  return { transactions, total, page, pages: Math.ceil(total / limit) };
};

export const getTransactionById = async (id: string) => {
  return await prisma.transaction.findUnique({
    where: { id },
    include: { sender: true, receiver: true },
  });
  Object;
};

export const updateTransaction = async (
  id: string,
  data: Partial<TransactionInput>
) => {
  return await prisma.transaction.update({ where: { id }, data });
};

export const deleteTransaction = async (id: string) => {
  return await prisma.transaction.delete({ where: { id } });
};
