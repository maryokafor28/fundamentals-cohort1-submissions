const express = require('express');
const { body, param, validationResult } = require('express-validator');
const orderService = require('../services/orderService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post(
  '/',
  authenticateToken,
  [
    body('items').isArray({ min: 1 }).withMessage('Items array is required'),
    body('items.*.productId').isInt().withMessage('Valid product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const order = await orderService.createOrder(req.userId, req.body.items);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/orders
 * @desc    Get all orders (admin) or user's orders
 * @access  Private
 */
router.get('/', authenticateToken, (req, res) => {
  try {
    const orders = orderService.getOrdersByUserId(req.userId);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticateToken,
  [param('id').isInt().withMessage('Valid order ID is required')],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const order = orderService.getOrderById(parseInt(req.params.id));

      // Ensure user can only access their own orders
      if (order.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status
 * @access  Private
 */
router.patch(
  '/:id/status',
  authenticateToken,
  [
    param('id').isInt().withMessage('Valid order ID is required'),
    body('status')
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Valid status is required'),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const order = orderService.updateOrderStatus(
        parseInt(req.params.id),
        req.body.status
      );

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private
 */
router.post(
  '/:id/cancel',
  authenticateToken,
  [param('id').isInt().withMessage('Valid order ID is required')],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const order = orderService.getOrderById(parseInt(req.params.id));

      // Ensure user can only cancel their own orders
      if (order.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }

      const cancelledOrder = orderService.cancelOrder(parseInt(req.params.id));

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: cancelledOrder,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/orders/stats
 * @desc    Get order statistics
 * @access  Private
 */
router.get('/user/stats', authenticateToken, (req, res) => {
  try {
    const stats = orderService.getOrderStatistics(req.userId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
