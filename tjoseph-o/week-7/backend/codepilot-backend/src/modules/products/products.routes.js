const express = require('express');
const productController = require('./products.controller');
const { authenticate, authorize } = require('../auth/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));

// Protected routes (admin only)
router.post('/', authenticate, authorize('admin'), productController.createProduct.bind(productController));
router.put('/:id', authenticate, authorize('admin'), productController.updateProduct.bind(productController));
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct.bind(productController));

module.exports = router;