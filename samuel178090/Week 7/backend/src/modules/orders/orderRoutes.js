const express = require('express');
const OrderService = require('./orderService');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const orders = OrderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const order = OrderService.getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get('/user/:userId', (req, res) => {
  try {
    const orders = OrderService.getOrdersByUserId(req.params.userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const order = OrderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const order = OrderService.updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;