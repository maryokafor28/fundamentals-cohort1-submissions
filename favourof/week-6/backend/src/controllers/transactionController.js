import { transactionService } from "../services/transactionService.js";
import catchAsync from "../utils/asyncWrapper.js";
import { addHATEOASLinks } from "../utils/hateoasHelper.js";

export const createTransaction = catchAsync(async (req, res, next) => {
  const transaction = await transactionService.createTransaction(req.body);
  const resource = addHATEOASLinks(transaction, "/api/v1/transactions");

  res.status(201).json({
    status: "success",
    data: resource,
  });
});

export const getTransactions = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const transactions = await transactionService.getAllTransactions(
    Number(page),
    Number(limit)
  );

  const data = transactions.map((t) =>
    addHATEOASLinks(t, "/api/v1/transactions")
  );

  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
});

export const getTransactionById = catchAsync(async (req, res, next) => {
  const transaction = await transactionService.getTransactionById(
    Number(req.params.id)
  );
  if (!transaction)
    return res
      .status(404)
      .json({ status: "fail", message: "Transaction not found" });

  const resource = addHATEOASLinks(transaction, "/api/v1/transactions");
  res.status(200).json({ status: "success", data: resource });
});
