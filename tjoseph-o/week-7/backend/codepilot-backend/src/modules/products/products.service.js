const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ValidationError } = require('../../utils/errors');

// In-memory product store
const products = new Map();

class ProductService {
  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Object} Created product
   */
  async createProduct(productData) {
    const { name, description, price, stock, category } = productData;

    if (price < 0) {
      throw new ValidationError('Price cannot be negative');
    }

    if (stock < 0) {
      throw new ValidationError('Stock cannot be negative');
    }

    const product = {
      id: uuidv4(),
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.set(product.id, product);
    return product;
  }

  /**
   * Get all products
   * @param {Object} filters - Filter options
   * @returns {Array} Array of products
   */
  async getAllProducts(filters = {}) {
    let productList = Array.from(products.values());

    // Filter by category
    if (filters.category) {
      productList = productList.filter(p => p.category === filters.category);
    }

    // Filter by min price
    if (filters.minPrice !== undefined) {
      productList = productList.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    // Filter by max price
    if (filters.maxPrice !== undefined) {
      productList = productList.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    // Filter by stock availability
    if (filters.inStock === 'true') {
      productList = productList.filter(p => p.stock > 0);
    }

    return productList;
  }

  /**
   * Get product by ID
   * @param {String} productId - Product ID
   * @returns {Object} Product
   */
  async getProductById(productId) {
    const product = products.get(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }
    return product;
  }

  /**
   * Update product
   * @param {String} productId - Product ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated product
   */
  async updateProduct(productId, updateData) {
    const product = await this.getProductById(productId);

    if (updateData.price !== undefined && updateData.price < 0) {
      throw new ValidationError('Price cannot be negative');
    }

    if (updateData.stock !== undefined && updateData.stock < 0) {
      throw new ValidationError('Stock cannot be negative');
    }

    const updatedProduct = {
      ...product,
      ...updateData,
      price: updateData.price !== undefined ? parseFloat(updateData.price) : product.price,
      stock: updateData.stock !== undefined ? parseInt(updateData.stock, 10) : product.stock,
      updatedAt: new Date().toISOString()
    };

    products.set(productId, updatedProduct);
    return updatedProduct;
  }

  /**
   * Delete product
   * @param {String} productId - Product ID
   * @returns {Boolean} Success status
   */
  async deleteProduct(productId) {
    const product = await this.getProductById(productId);
    products.delete(productId);
    return true;
  }

  /**
   * Update product stock
   * @param {String} productId - Product ID
   * @param {Number} quantity - Quantity to add/subtract
   * @returns {Object} Updated product
   */
  async updateStock(productId, quantity) {
    const product = await this.getProductById(productId);
    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new ValidationError('Insufficient stock');
    }

    return this.updateProduct(productId, { stock: newStock });
  }

  /**
   * Clear all products (for testing)
   */
  clearProducts() {
    products.clear();
  }

  /**
   * Get product count
   */
  getProductCount() {
    return products.size;
  }
}

module.exports = new ProductService();