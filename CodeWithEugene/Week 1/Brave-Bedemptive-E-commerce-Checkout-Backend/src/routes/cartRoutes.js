const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const {
  validateAddToCart,
  validateUpdateCartItem,
  validateRemoveFromCart,
  validateUserId
} = require('../middleware/validation');

// @route   GET /get-cart/:userId
// @desc    Get user cart
// @access  Public
router.get('/get-cart/:userId', validateUserId, getCart);

// @route   POST /add-to-cart
// @desc    Add item to cart
// @access  Public
router.post('/add-to-cart', validateAddToCart, addToCart);

// @route   PUT /update-cart-item
// @desc    Update cart item quantity
// @access  Public
router.put('/update-cart-item', validateUpdateCartItem, updateCartItem);

// @route   DELETE /remove-from-cart
// @desc    Remove item from cart
// @access  Public
router.delete('/remove-from-cart', validateRemoveFromCart, removeFromCart);

// @route   DELETE /clear-cart/:userId
// @desc    Clear entire cart
// @access  Public
router.delete('/clear-cart/:userId', validateUserId, clearCart);

module.exports = router;
