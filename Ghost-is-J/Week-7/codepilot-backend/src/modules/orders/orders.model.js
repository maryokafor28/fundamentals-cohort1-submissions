const orders = [];

class OrderModel {
  static async create(order) {
    const id = orders.length + 1;
    const newOrder = { id, ...order };
    orders.push(newOrder);
    return newOrder;
  }

  static async findById(id) {
    return orders.find((o) => o.id === id);
  }

  static async clear() {
    orders.length = 0;
  }
}

module.exports = OrderModel;
