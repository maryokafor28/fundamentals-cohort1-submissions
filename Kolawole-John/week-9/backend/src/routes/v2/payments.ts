import { Router } from 'express';
import { legacyApiService } from '../../services/legacyApiServices';
import { transformService } from '../../services/transformService';
import { ApiResponseUtil } from '../../utils/apiResponse';
import { asyncHandler } from '../../middleware/errorHandler';
import { validate, paymentSchemas } from '../../middleware/validator';
import logger from '../../config/logger';

const router = Router();

/**
 * GET /api/v2/payments
 * 
 * Get all payments with modern transformed format
 * Supports filtering, pagination, and caching
 */
router.get(
  '/',
  validate(paymentSchemas.getPayments),
  asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { 
      page = 1, 
      limit = 10, 
      status, 
      customerId,
      useCache = true 
    } = req.query;

    logger.info('Fetching payments', { page, limit, status, customerId });

    // Fetch from legacy API
    let legacyPayments = customerId
      ? await legacyApiService.fetchPaymentsByCustomerId(Number(customerId))
      : await legacyApiService.fetchPayments(Boolean(useCache));

    // Transform to modern format
    let modernPayments = transformService.transformPayments(legacyPayments);

    // Apply status filter if provided
    if (status) {
      modernPayments = modernPayments.filter(p => p.status === status);
    }

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedPayments = modernPayments.slice(startIndex, endIndex);

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Return paginated response
    ApiResponseUtil.paginated(
      res,
      paginatedPayments,
      Number(page),
      Number(limit),
      modernPayments.length,
      Boolean(useCache)
    );

    logger.info(`Returned ${paginatedPayments.length} payments in ${processingTime}ms`);
  })
);

/**
 * GET /api/v2/payments/stats
 * 
 * Get payment statistics
 */
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    logger.info('Fetching payment statistics');

    const legacyPayments = await legacyApiService.fetchPayments();
    const modernPayments = transformService.transformPayments(legacyPayments);
    const stats = transformService.calculatePaymentStats(modernPayments);

    ApiResponseUtil.success(res, {
      ...stats,
      recentPayments: modernPayments.slice(0, 5),
    });
  })
);

/**
 * GET /api/v2/payments/:id
 * 
 * Get single payment by ID with enriched customer data
 */
router.get(
  '/:id',
  validate(paymentSchemas.getPaymentById),
  asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { id } = req.params;
    const { useCache = true } = req.query;

    logger.info(`Fetching payment ${id}`);

    // Fetch legacy payment
    const legacyPayment = await legacyApiService.fetchPaymentById(
      Number(id),
      Boolean(useCache)
    );

    if (!legacyPayment) {
      ApiResponseUtil.notFound(res, 'Payment');
      return;
    }

    // Transform to modern format
    let modernPayment = transformService.transformPayment(legacyPayment);

    // Enrich with customer data
    const legacyCustomer = await legacyApiService.fetchCustomerById(
      legacyPayment.userId,
      Boolean(useCache)
    );

    if (legacyCustomer) {
      const modernCustomer = transformService.transformCustomer(legacyCustomer);
      modernPayment = transformService.enrichPaymentWithCustomer(
        modernPayment,
        modernCustomer
      );
    }

    const processingTime = Date.now() - startTime;

    ApiResponseUtil.success(
      res,
      modernPayment,
      200,
      Boolean(useCache),
      processingTime
    );

    logger.info(`Returned payment ${id} in ${processingTime}ms`);
  })
);

export default router;