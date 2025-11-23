const orderService = require('./orders.service');
const { sendSuccess } = require('../../utils/response');
const { ValidationError } = require('../../utils/errors');

class OrderController {

  async createOrder(req, res, next) {
    try {
      const { items } = req.body;

      if (!items) {
        throw new ValidationError('Items are required');
      }

      const order = await orderService.createOrder(req.user.id, items);
      sendSuccess(res, 201, { order }, 'Order created successfully');
    } catch (error) {
      next(error);
    }
  }


  async getAllOrders(req, res, next) {
    try {
      
      const userId = req.user.role === 'admin' ? null : req.user.id;
      const orders = await orderService.getAllOrders(userId);
      sendSuccess(res, 200, { orders, count: orders.length }, 'Orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

 
  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      
      const userId = req.user.role === 'admin' ? null : req.user.id;
      const order = await orderService.getOrderById(id, userId);
      sendSuccess(res, 200, { order }, 'Order retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

 
  async updateOrderStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new ValidationError('Status is required');
      }

      const order = await orderService.updateOrderStatus(id, status);
      sendSuccess(res, 200, { order }, 'Order status updated successfully');
    } catch (error) {
      next(error);
    }
  }

 
  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const order = await orderService.cancelOrder(id, req.user.id);
      sendSuccess(res, 200, { order }, 'Order cancelled successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();