import { Router } from "express";
import customerRoutes from "./customer.routes";
import paymentRoutes from "./payment.routes";

const router = Router();

router.use("/customers", customerRoutes);
router.use("/payments", paymentRoutes);

export default router;
