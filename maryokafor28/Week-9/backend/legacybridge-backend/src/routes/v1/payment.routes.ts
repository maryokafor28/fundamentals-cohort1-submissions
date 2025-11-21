// routes/v1/payment.routes.ts
import { Router } from "express";
import {
  getAllPayments,
  getPaymentById,
} from "../../controllers/v1/payment.controller";

const router = Router();

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);

export default router;
