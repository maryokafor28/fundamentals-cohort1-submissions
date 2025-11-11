import { Request, Response, NextFunction } from "express";
import { transactionService } from "../services/transactionService";
import { TransactionStatus } from "@prisma/client";
import { AppError } from "../utils/appError";

export const transactionController = {
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, description, senderId, receiverId } = req.body;

      if (!senderId || !receiverId || !amount) {
        throw new AppError("Missing required fields", 400);
      }

      const transaction = await transactionService.createTransaction(
        amount,
        description,
        senderId,
        receiverId
      );

      res.status(201).json({
        message: "Transaction created successfully",
        transaction,
      });
    } catch (error: any) {
      next(
        error instanceof AppError
          ? error
          : new AppError(error.message || "Failed to create transaction", 400)
      );
    }
  },

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, status, userId } = req.query; // ✅ Extract userId

      const result = await transactionService.getTransactions(
        Number(page) || 1,
        Number(limit) || 10,
        status as TransactionStatus | undefined,
        userId as string | undefined // ✅ Pass userId
      );

      res.json(result);
    } catch (error: any) {
      next(new AppError("Failed to fetch transactions", 500));
    }
  },

  async updateTransactionStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new AppError("Status is required", 400);
      }

      const updated = await transactionService.updateStatus(
        id,
        status as TransactionStatus
      );

      if (!updated) {
        throw new AppError("Transaction not found", 404);
      }

      res.json({
        message: `Transaction marked as ${status}`,
        transaction: updated,
      });
    } catch (error: any) {
      next(
        error instanceof AppError
          ? error
          : new AppError(error.message || "Failed to update status", 400)
      );
    }
  },
};
