const ProductService = require('../products/productService');

// Mock orders database
let orders = [
  { id: 1, userId: 1, items: [{ productId: 1, quantity: 2 }], total: 1999.98, status: 'completed' },
  { id: 2, userId: 2, items: [{ productId: 2, quantity: 1 }], total: 599.99, status: 'pending' }
];

class OrderService {
  static getAllOrders() {
    return orders;
  }

  static getOrderById(id) {
    const order = orders.find(o => o.id === parseInt(id));
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  static getOrdersByUserId(userId) {
    return orders.filter(o => o.userId === parseInt(userId));
  }

  static createOrder(orderData) {
    const { userId, items } = orderData;
    
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      throw new Error('User ID and items are required');
    }

    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        throw new Error('Invalid item data');
      }

      try {
        const product = ProductService.getProductById(item.productId);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }
        
        total += product.price * item.quantity;
        validatedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price
        });
      } catch (error) {
        throw new Error(`Product validation failed: ${error.message}`);
      }
    }

    const newOrder = {
      id: Math.max(...orders.map(o => o.id)) + 1,
      userId: parseInt(userId),
      items: validatedItems,
      total: parseFloat(total.toFixed(2)),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    return newOrder;
  }

  static updateOrderStatus(id, status) {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    const orderIndex = orders.findIndex(o => o.id === parseInt(id));
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    return orders[orderIndex];
  }

  static calculateOrderTotal(items) {
    let total = 0;
    for (const item of items) {
      const product = ProductService.getProductById(item.productId);
      total += product.price * item.quantity;
    }
    return parseFloat(total.toFixed(2));
  }
}

module.exports = OrderService;