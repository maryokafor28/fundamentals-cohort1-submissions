const productService = require('./products.service');
const { sendSuccess } = require('../../utils/response');
const { ValidationError } = require('../../utils/errors');

class ProductController {
  /**
   * Create a new product
   */
  async createProduct(req, res, next) {
    try {
      const { name, description, price, stock, category } = req.body;

      // Validate required fields
      if (!name || price === undefined || stock === undefined) {
        throw new ValidationError('Name, price, and stock are required');
      }

      const product = await productService.createProduct({
        name,
        description,
        price,
        stock,
        category
      });

      sendSuccess(res, 201, { product }, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all products
   */
  async getAllProducts(req, res, next) {
    try {
      const { category, minPrice, maxPrice, inStock } = req.query;
      const products = await productService.getAllProducts({
        category,
        minPrice,
        maxPrice,
        inStock
      });

      sendSuccess(res, 200, { products, count: products.length }, 'Products retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      sendSuccess(res, 200, { product }, 'Product retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await productService.updateProduct(id, updateData);
      sendSuccess(res, 200, { product }, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      sendSuccess(res, 200, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();