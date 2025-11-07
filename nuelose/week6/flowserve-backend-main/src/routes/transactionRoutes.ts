import { Router } from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller";
import { validate } from "../middlewares/validate";
import {
  transactionSchema,
  transactionIdSchema,
} from "../schemas/transaction.schema";

const router = Router();

router.get("/", getAllTransactions);
router.get("/:id", validate(transactionIdSchema), getTransactionById);
router.post("/", validate(transactionSchema), createTransaction);
router.put(
  "/:id",
  validate(transactionIdSchema),
  validate(transactionSchema.partial()),
  updateTransaction
);
router.delete("/:id", validate(transactionIdSchema), deleteTransaction);

export default router;
