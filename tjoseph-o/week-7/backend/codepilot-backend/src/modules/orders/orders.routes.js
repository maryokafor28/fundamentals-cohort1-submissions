const express = require('express');
const orderController = require('./orders.controller');
const { authenticate, authorize } = require('../auth/auth.middleware');

const router = express.Router();


router.use(authenticate);


router.post('/', orderController.createOrder.bind(orderController));
router.get('/', orderController.getAllOrders.bind(orderController));
router.get('/:id', orderController.getOrderById.bind(orderController));
router.patch('/:id/cancel', orderController.cancelOrder.bind(orderController));


router.patch('/:id/status', authorize('admin'), orderController.updateOrderStatus.bind(orderController));

module.exports = router;