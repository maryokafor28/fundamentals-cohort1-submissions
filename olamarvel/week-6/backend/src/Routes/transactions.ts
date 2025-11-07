import { Router } from "express";
import * as Transaction from "../Controllers/transactions";
import { protect } from "../Middlewares/protect";
import asyncHandler from "../Middlewares/aysncHandler";
import validate from "../Middlewares/validate";
import { sendFundsSchema, depositFundsSchema } from "../util/validationSchemas";
import { strictLimiter } from "../Middlewares/rateLimiter";

const router = Router();

router.use(strictLimiter)
router.use(protect);

router.get("/balance", asyncHandler(Transaction.getBalance));
router.get("/statement", asyncHandler(Transaction.getStatement));

router.post("/send", validate(sendFundsSchema), asyncHandler(Transaction.sendFunds));

router.post("/deposit", validate(depositFundsSchema), asyncHandler(Transaction.depositFunds));

export default router;
