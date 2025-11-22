// src/modules/orders/orders.service.js
const store = require('../../data/store');
const { NotFoundError, ValidationError, ForbiddenError } = require('../../utils/errors');

class OrderService {
  
  async createOrder(userId, items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError('Items must be a non-empty array');
    }

    // Validate items structure and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        throw new ValidationError('Each item must have productId and positive quantity');
      }

      // Get product to validate and calculate price
      const product = store.products.find(p => p.id === item.productId);
      if (!product) {
        throw new NotFoundError(`Product with id ${item.productId} not found`);
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        throw new ValidationError(`Insufficient stock for product ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemTotal
      });

      // Update product stock
      product.stock -= item.quantity;
    }

    // Create order
    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      items: orderItems,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.orders.push(order);
    return order;
  }

  
  async getAllOrders(userId = null) {
    if (userId) {
      // Return orders for specific user
      return store.orders.filter(order => order.userId === userId);
    }
    // Return all orders (admin)
    return store.orders;
  }

  
  async getOrderById(orderId, userId = null) {
    const order = store.orders.find(o => o.id === orderId);
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // If userId is provided, verify ownership
    if (userId && order.userId !== userId) {
      throw new ForbiddenError('You do not have access to this order');
    }

    return order;
  }

  
  async updateOrderStatus(orderId, status) {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = store.orders.find(o => o.id === orderId);
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Prevent status changes for cancelled orders
    if (order.status === 'cancelled') {
      throw new ValidationError('Cannot update status of cancelled order');
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    return order;
  }

  
  async cancelOrder(orderId, userId) {
    const order = store.orders.find(o => o.id === orderId);
    
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    // Verify ownership
    if (order.userId !== userId) {
      throw new ForbiddenError('You can only cancel your own orders');
    }

    // Check if order can be cancelled
    if (order.status === 'cancelled') {
      throw new ValidationError('Order is already cancelled');
    }

    if (order.status === 'delivered') {
      throw new ValidationError('Cannot cancel delivered orders');
    }

    // Restore product stock
    for (const item of order.items) {
      const product = store.products.find(p => p.id === item.productId);
      if (product) {
        product.stock += item.quantity;
      }
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();

    return order;
  }
}

module.exports = new OrderService();