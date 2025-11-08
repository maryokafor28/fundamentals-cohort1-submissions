import { Router } from 'express';
import * as txController from '../controllers/transactionController';
import { validateBody } from '../middlewares/validate';
import { simulateTransactionSchema } from '../schemas/transactionSchemas';
import rateLimit from 'express-rate-limit';

const router = Router();

const txLimiter = rateLimit({ windowMs: 60_000, max: 20, standardHeaders: true, legacyHeaders: false });

router.post('/simulate', txLimiter, validateBody(simulateTransactionSchema), txController.simulateTransaction);
router.get('/', txController.listTransactions);
router.get('/:id', txController.getTransaction);

export default router;
