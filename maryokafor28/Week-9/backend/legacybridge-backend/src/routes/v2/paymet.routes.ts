// routes/v2/payments.routes.ts
import { Router } from "express";
import {
  getAllPayments,
  getPaymentById,
} from "../../controllers/v2/payment.controller";

const router = Router();

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);

export default router;
