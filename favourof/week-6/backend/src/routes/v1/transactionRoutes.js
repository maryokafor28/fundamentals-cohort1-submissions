import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
} from "../../controllers/transactionController.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createTransactionSchema } from "../../validations/transactionValidation.js";

const router = express.Router();

router
  .route("/")
  .post(validateRequest(createTransactionSchema), createTransaction)
  .get(getTransactions);

router.route("/:id").get(getTransactionById);

export default router;
