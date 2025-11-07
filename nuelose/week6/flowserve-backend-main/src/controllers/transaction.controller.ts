import { Request, Response, NextFunction } from "express";
import * as TransactionService from "../services/transaction.service";
import { ApiError } from "../middlewares/errorHandler";
import logger from "../utils/logger";

export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Incoming body:" ,req.body)
    const transaction = await TransactionService.createTransaction(req.body);
    // logger.info("Transaction created", { transactionId: transaction.id });
    res
      .status(201)
      .json({ message: "Transaction created successfully", data: transaction });
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await TransactionService.getAllTransactions(page, limit);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const transaction = await TransactionService.getTransactionById(id);
    if (!transaction) throw new ApiError("Transaction not found", 404);
    res.status(200).json({ data: transaction });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updated = await TransactionService.updateTransaction(id, req.body);
    res
      .status(200)
      .json({ message: "Transaction updated successfully", data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await TransactionService.deleteTransaction(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};
