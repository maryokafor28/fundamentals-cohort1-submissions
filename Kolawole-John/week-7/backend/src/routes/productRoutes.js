const express = require('express');
const { body, param, validationResult } = require('express-validator');
const productService = require('../services/productService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private
 */
router.post(
  '/',
  authenticateToken,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('stock').isInt({ min: 0 }).withMessage('Valid stock quantity is required'),
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

      const product = productService.createProduct(req.body);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
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
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const products = productService.getAllProducts();

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get(
  '/:id',
  [param('id').isInt().withMessage('Valid product ID is required')],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const product = productService.getProductById(parseInt(req.params.id));

      res.json({
        success: true,
        data: product,
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
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private
 */
router.put(
  '/:id',
  authenticateToken,
  [
    param('id').isInt().withMessage('Valid product ID is required'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Valid stock is required'),
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

      const product = productService.updateProduct(
        parseInt(req.params.id),
        req.body
      );

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product,
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
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private
 */
router.delete(
  '/:id',
  authenticateToken,
  [param('id').isInt().withMessage('Valid product ID is required')],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      productService.deleteProduct(parseInt(req.params.id));

      res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
