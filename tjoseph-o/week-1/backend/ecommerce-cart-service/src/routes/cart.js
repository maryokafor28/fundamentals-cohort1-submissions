const express = require('express');
const CartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

const router = express.Router();


router.post('/add-to-cart', auth, CartController.addToCart);


router.get('/get-cart/:userId', auth, CartController.getCart);


router.get('/get-cart/:userId/detailed', auth, CartController.getCartWithProducts);


router.put('/cart/:userId/items/:productId', auth, CartController.updateCartItem);


router.delete('/cart/:userId/items/:productId', auth, CartController.removeFromCart);


router.delete('/cart/:userId/clear', auth, CartController.clearCart);


router.get('/cart/:userId/summary', auth, CartController.getCartSummary);


router.get('/cart/:userId/validate', auth, CartController.validateCart);


router.get('/cart/:userId/stats', auth, CartController.getCartStats);


router.post('/cart/transfer', auth, CartController.transferCart);

module.exports = router;