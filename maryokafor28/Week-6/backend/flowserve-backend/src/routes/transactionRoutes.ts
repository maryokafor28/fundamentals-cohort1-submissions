import { Router } from "express";
import { transactionController } from "../controllers/transactionController";
import { validate } from "../middlewares/validate";
import {
  createTransactionSchema,
  getTransactionsSchema,
  updateTransactionStatusSchema,
} from "../validations/transactionValidation";

const router = Router();

router.post(
  "/",
  validate(createTransactionSchema),
  transactionController.createTransaction
);
router.get(
  "/",
  validate(getTransactionsSchema),
  transactionController.getTransactions
);
router.patch(
  "/:id/status",
  validate(updateTransactionStatusSchema),
  transactionController.updateTransactionStatus
);

export default router;
