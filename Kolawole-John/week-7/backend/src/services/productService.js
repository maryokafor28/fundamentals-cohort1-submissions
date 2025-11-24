const db = require('../models/db');

class ProductService {
  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Object} Created product
   */
  createProduct(productData) {
    const { name, description, price, stock } = productData;

    // Validate price
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }

    // Validate stock
    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    return db.createProduct({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
    });
  }

  /**
   * Get all products
   * @returns {Array} List of products
   */
  getAllProducts() {
    return db.getAllProducts();
  }

  /**
   * Get product by ID
   * @param {Number} productId - Product ID
   * @returns {Object} Product details
   */
  getProductById(productId) {
    const product = db.findProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  /**
   * Update product
   * @param {Number} productId - Product ID
   * @param {Object} updates - Updated product data
   * @returns {Object} Updated product
   */
  updateProduct(productId, updates) {
    // Validate if product exists
    const product = db.findProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Validate price if provided
    if (updates.price !== undefined && updates.price < 0) {
      throw new Error('Price cannot be negative');
    }

    // Validate stock if provided
    if (updates.stock !== undefined && updates.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    const updatedProduct = db.updateProduct(productId, updates);
    return updatedProduct;
  }

  /**
   * Delete product
   * @param {Number} productId - Product ID
   * @returns {Boolean} Deletion success
   */
  deleteProduct(productId) {
    const product = db.findProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    return db.deleteProduct(productId);
  }

  /**
   * Check product availability
   * @param {Number} productId - Product ID
   * @param {Number} quantity - Required quantity
   * @returns {Boolean} Availability status
   */
  checkAvailability(productId, quantity) {
    const product = db.findProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    return product.stock >= quantity;
  }

  /**
   * Reduce product stock
   * @param {Number} productId - Product ID
   * @param {Number} quantity - Quantity to reduce
   * @returns {Object} Updated product
   */
  reduceStock(productId, quantity) {
    const product = db.findProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    const newStock = product.stock - quantity;
    return db.updateProduct(productId, { stock: newStock });
  }
}

module.exports = new ProductService();
