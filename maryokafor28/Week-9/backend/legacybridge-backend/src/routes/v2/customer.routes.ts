// routes/v2/customers.routes.ts
import { Router } from "express";
import {
  getAllCustomers,
  getCustomerById,
} from "../../controllers/v2/customer.controller";

const router = Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);

export default router;
