import { Router } from 'express';
import { legacyApiService } from '../../services/legacyApiServices';
import { ApiResponseUtil } from '../../utils/apiResponse';
import { asyncHandler } from '../../middleware/errorHandler';
import logger from '../../config/logger';

/**
 * V1 Routes - Legacy Compatible
 * 
 * These routes maintain backward compatibility with existing clients
 * Returns data in the original legacy format
 */
const router = Router();

/**
 * GET /api/v1/payments
 * 
 * Legacy-compatible endpoint - returns original format
 */
router.get(
  '/payments',
  asyncHandler(async (req, res) => {
    logger.info('V1: Fetching payments (legacy format)');

    const payments = await legacyApiService.fetchPayments();

    // Return in legacy format (simple array)
    res.json(payments);
  })
);

/**
 * GET /api/v1/payments/:id
 */
router.get(
  '/payments/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    logger.info(`V1: Fetching payment ${id} (legacy format)`);

    const payment = await legacyApiService.fetchPaymentById(Number(id));

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    res.json(payment);
  })
);

/**
 * GET /api/v1/customers
 */
router.get(
  '/customers',
  asyncHandler(async (req, res) => {
    logger.info('V1: Fetching customers (legacy format)');

    const customers = await legacyApiService.fetchCustomers();

    res.json(customers);
  })
);

/**
 * GET /api/v1/customers/:id
 */
router.get(
  '/customers/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    logger.info(`V1: Fetching customer ${id} (legacy format)`);

    const customer = await legacyApiService.fetchCustomerById(Number(id));

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json(customer);
  })
);

export default router;