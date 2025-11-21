// routes/v1/customer.routes.ts
import { Router } from "express";
import {
  getAllCustomers,
  getCustomerById,
} from "../../controllers/v1/customer.controller";

const router = Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);

export default router;
