import { Router } from "express";
import usersRouter from "./userRoutes";
import transactionRouter from "./transactionRoutes"

const router = Router();

router.use("/users", usersRouter);
router.use("/transactions", transactionRouter)

export default router;
