/**
 * In-memory database simulation
 * In production, this would be replaced with PostgreSQL, MongoDB, etc.
 */

class Database {
  constructor() {
    this.users = [];
    this.products = [];
    this.orders = [];
    this.nextUserId = 1;
    this.nextProductId = 1;
    this.nextOrderId = 1;
  }

  // User operations
  createUser(userData) {
    const user = {
      id: this.nextUserId++,
      ...userData,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findUserById(id) {
    return this.users.find(user => user.id === id);
  }

  getAllUsers() {
    return this.users;
  }

  updateUser(id, updates) {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  deleteUser(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  // Product operations
  createProduct(productData) {
    const product = {
      id: this.nextProductId++,
      ...productData,
      createdAt: new Date().toISOString(),
    };
    this.products.push(product);
    return product;
  }

  findProductById(id) {
    return this.products.find(product => product.id === id);
  }

  getAllProducts() {
    return this.products;
  }

  updateProduct(id, updates) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  // Order operations
  createOrder(orderData) {
    const order = {
      id: this.nextOrderId++,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.orders.push(order);
    return order;
  }

  findOrderById(id) {
    return this.orders.find(order => order.id === id);
  }

  findOrdersByUserId(userId) {
    return this.orders.filter(order => order.userId === userId);
  }

  getAllOrders() {
    return this.orders;
  }

  updateOrderStatus(id, status) {
    const index = this.orders.findIndex(order => order.id === id);
    if (index === -1) return null;
    this.orders[index].status = status;
    return this.orders[index];
  }

  // Test utilities
  clear() {
    this.users = [];
    this.products = [];
    this.orders = [];
    this.nextUserId = 1;
    this.nextProductId = 1;
    this.nextOrderId = 1;
  }

  seed() {
    // Seed with initial data for testing
    this.createUser({
      name: 'Test User',
      email: 'test@example.com',
      password: '$2a$10$hashedpassword',
    });

    this.createProduct({
      name: 'Sample Product',
      description: 'A sample product for testing',
      price: 99.99,
      stock: 100,
    });
  }
}

// Singleton instance
const db = new Database();

module.exports = db;
