const db = require('../models/db');
const productService = require('./productService');

class OrderService {
  /**
   * Create a new order
   * @param {Number} userId - User ID
   * @param {Array} items - Order items [{productId, quantity}]
   * @returns {Object} Created order
   */
  async createOrder(userId, items) {
    // Validate user exists
    const user = db.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate items
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // Calculate total and validate stock
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productService.getProductById(item.productId);
      
      // Check availability
      if (!productService.checkAvailability(item.productId, item.quantity)) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemTotal,
      });
    }

    // Create order
    const order = db.createOrder({
      userId,
      items: orderItems,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    });

    // Reduce stock for each item
    for (const item of items) {
      productService.reduceStock(item.productId, item.quantity);
    }

    return order;
  }

  /**
   * Get all orders
   * @returns {Array} List of all orders
   */
  getAllOrders() {
    return db.getAllOrders();
  }

  /**
   * Get order by ID
   * @param {Number} orderId - Order ID
   * @returns {Object} Order details
   */
  getOrderById(orderId) {
    const order = db.findOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  /**
   * Get orders by user ID
   * @param {Number} userId - User ID
   * @returns {Array} User's orders
   */
  getOrdersByUserId(userId) {
    return db.findOrdersByUserId(userId);
  }

  /**
   * Update order status
   * @param {Number} orderId - Order ID
   * @param {String} status - New status
   * @returns {Object} Updated order
   */
  updateOrderStatus(orderId, status) {
    // Validate order exists
    const order = db.findOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid order status');
    }

    return db.updateOrderStatus(orderId, status);
  }

  /**
   * Cancel order
   * @param {Number} orderId - Order ID
   * @returns {Object} Cancelled order
   */
  cancelOrder(orderId) {
    const order = db.findOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Only pending orders can be cancelled
    if (order.status !== 'pending') {
      throw new Error('Only pending orders can be cancelled');
    }

    // Restore stock for cancelled items
    for (const item of order.items) {
      const product = db.findProductById(item.productId);
      if (product) {
        db.updateProduct(item.productId, { 
          stock: product.stock + item.quantity 
        });
      }
    }

    return db.updateOrderStatus(orderId, 'cancelled');
  }

  /**
   * Calculate order statistics
   * @param {Number} userId - Optional user ID filter
   * @returns {Object} Order statistics
   */
  getOrderStatistics(userId = null) {
    const orders = userId 
      ? db.findOrdersByUserId(userId)
      : db.getAllOrders();

    const stats = {
      total: orders.length,
      totalRevenue: 0,
      byStatus: {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      },
    };

    orders.forEach(order => {
      stats.totalRevenue += order.totalAmount;
      stats.byStatus[order.status]++;
    });

    stats.totalRevenue = parseFloat(stats.totalRevenue.toFixed(2));

    return stats;
  }
}

module.exports = new OrderService();
