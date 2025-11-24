import { Router } from 'express';
import { legacyApiService } from '../../services/legacyApiServices';
import { transformService } from '../../services/transformService';
import { ApiResponseUtil } from '../../utils/apiResponse';
import { asyncHandler } from '../../middleware/errorHandler';
import { validate, customerSchemas, paymentSchemas } from '../../middleware/validator';
import logger from '../../config/logger';

const router = Router();

/**
 * GET /api/v2/customers
 * 
 * Get all customers with modern transformed format
 * Supports filtering, pagination, and caching
 */
router.get(
  '/',
  validate(customerSchemas.getCustomers),
  asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { 
      page = 1, 
      limit = 10, 
      city,
      useCache = true 
    } = req.query;

    logger.info('Fetching customers', { page, limit, city });

    // Fetch from legacy API
    const legacyCustomers = await legacyApiService.fetchCustomers(Boolean(useCache));

    // Transform to modern format
    let modernCustomers = transformService.transformCustomers(legacyCustomers);

    // Apply city filter if provided
    if (city) {
      modernCustomers = modernCustomers.filter(
        c => c.location.city.toLowerCase().includes(String(city).toLowerCase())
      );
    }

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedCustomers = modernCustomers.slice(startIndex, endIndex);

    const processingTime = Date.now() - startTime;

    ApiResponseUtil.paginated(
      res,
      paginatedCustomers,
      Number(page),
      Number(limit),
      modernCustomers.length,
      Boolean(useCache)
    );

    logger.info(`Returned ${paginatedCustomers.length} customers in ${processingTime}ms`);
  })
);

/**
 * GET /api/v2/customers/:id
 * 
 * Get single customer by ID with payment history
 */
router.get(
  '/:id',
  validate(customerSchemas.getCustomerById),
  asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const { id } = req.params;
    const { useCache = true } = req.query;

    logger.info(`Fetching customer ${id}`);

    // Fetch legacy customer
    const legacyCustomer = await legacyApiService.fetchCustomerById(
      Number(id),
      Boolean(useCache)
    );

    if (!legacyCustomer) {
      ApiResponseUtil.notFound(res, 'Customer');
      return;
    }

    // Transform to modern format
    const modernCustomer = transformService.transformCustomer(legacyCustomer);

    // Fetch customer's payment history
    const legacyPayments = await legacyApiService.fetchPaymentsByCustomerId(
      Number(id)
    );
    const modernPayments = transformService.transformPayments(legacyPayments);
    const paymentStats = transformService.calculatePaymentStats(modernPayments);

    // Enrich customer with payment data
    const enrichedCustomer = {
      ...modernCustomer,
      paymentHistory: {
        totalPayments: paymentStats.total,
        totalAmount: paymentStats.totalAmount,
        stats: {
          completed: paymentStats.completed,
          pending: paymentStats.pending,
          failed: paymentStats.failed,
        },
        recentPayments: modernPayments.slice(0, 5),
      },
    };

    const processingTime = Date.now() - startTime;

    ApiResponseUtil.success(
      res,
      enrichedCustomer,
      200,
      Boolean(useCache),
      processingTime
    );

    logger.info(`Returned customer ${id} in ${processingTime}ms`);
  })
);

/**
 * GET /api/v2/customers/:id/payments
 * 
 * Get all payments for a specific customer
 */
router.get(
  '/:id/payments',
  validate({
    params: customerSchemas.getCustomerById.params,
    query: paymentSchemas.getPayments.query,
  }),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page = 1, limit = 10, status, useCache = true } = req.query;

    logger.info(`Fetching payments for customer ${id}`);

    // Verify customer exists
    const customer = await legacyApiService.fetchCustomerById(
      Number(id),
      Boolean(useCache)
    );

    if (!customer) {
      ApiResponseUtil.notFound(res, 'Customer');
      return;
    }

    // Fetch customer's payments
    const legacyPayments = await legacyApiService.fetchPaymentsByCustomerId(
      Number(id)
    );

    let modernPayments = transformService.transformPayments(legacyPayments);

    // Apply status filter
    if (status) {
      modernPayments = modernPayments.filter(p => p.status === status);
    }

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedPayments = modernPayments.slice(startIndex, endIndex);

    ApiResponseUtil.paginated(
      res,
      paginatedPayments,
      Number(page),
      Number(limit),
      modernPayments.length,
      Boolean(useCache)
    );
  })
);

export default router;