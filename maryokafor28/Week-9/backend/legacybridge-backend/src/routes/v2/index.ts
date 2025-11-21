import { Router } from "express";
import customerRoutes from "./customer.routes";
import paymentRoutes from "./paymet.routes";

const router = Router();

router.use("/customers", customerRoutes);
router.use("/payments", paymentRoutes);

export default router;
