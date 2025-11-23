const OrderModel = require('./orders.model');
const ProductModel = require('../products/products.model');

class OrderService {
  async createOrder(data, userId) {
    if (!data.items || data.items.length === 0)
      throw new Error('Order must contain items');

    // Calculate total
    let total = 0;
    for (const item of data.items) {
      const product = (await ProductModel.findAll()).find((p) => p.id === item.productId);
      if (!product) throw new Error('Product not found');
      total += product.price * item.qty;
    }

    const order = await OrderModel.create({userId, items: data.items, total});
    return order;
  }

  async getOrderById(id) {
    const order = await OrderModel.findById(Number(id));
    if (!order) throw new Error('Order not found');
    return order;
  }
}

module.exports = new OrderService();
