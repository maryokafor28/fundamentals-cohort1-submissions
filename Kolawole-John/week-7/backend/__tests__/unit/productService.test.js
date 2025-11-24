const productService = require('../../src/services/productService');
const db = require('../../src/models/db');

describe('ProductService - Unit Tests', () => {
  beforeEach(() => {
    db.clear();
  });

  describe('createProduct()', () => {
    it('should create a product successfully', () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      };

      const product = productService.createProduct(productData);

      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe(productData.name);
      expect(product.price).toBe(99.99);
      expect(product.stock).toBe(50);
    });

    it('should throw error for negative price', () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product',
        price: -10,
        stock: 50,
      };

      expect(() => productService.createProduct(productData)).toThrow(
        'Price cannot be negative'
      );
    });

    it('should throw error for negative stock', () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: -5,
      };

      expect(() => productService.createProduct(productData)).toThrow(
        'Stock cannot be negative'
      );
    });

    it('should parse price as float', () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product',
        price: '99.99',
        stock: 50,
      };

      const product = productService.createProduct(productData);

      expect(typeof product.price).toBe('number');
      expect(product.price).toBe(99.99);
    });

    it('should parse stock as integer', () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: '50',
      };

      const product = productService.createProduct(productData);

      expect(typeof product.stock).toBe('number');
      expect(product.stock).toBe(50);
    });
  });

  describe('getAllProducts()', () => {
    it('should return empty array when no products exist', () => {
      const products = productService.getAllProducts();

      expect(products).toEqual([]);
    });

    it('should return all products', () => {
      productService.createProduct({
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
        stock: 5,
      });
      productService.createProduct({
        name: 'Product 2',
        description: 'Description 2',
        price: 20,
        stock: 10,
      });

      const products = productService.getAllProducts();

      expect(products).toHaveLength(2);
      expect(products[0].name).toBe('Product 1');
      expect(products[1].name).toBe('Product 2');
    });
  });

  describe('getProductById()', () => {
    it('should return product by ID', () => {
      const created = productService.createProduct({
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      });

      const product = productService.getProductById(created.id);

      expect(product).toBeDefined();
      expect(product.id).toBe(created.id);
      expect(product.name).toBe('Test Product');
    });

    it('should throw error if product not found', () => {
      expect(() => productService.getProductById(999)).toThrow('Product not found');
    });
  });

  describe('updateProduct()', () => {
    it('should update product successfully', () => {
      const product = productService.createProduct({
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      });

      const updated = productService.updateProduct(product.id, {
        price: 149.99,
        stock: 75,
      });

      expect(updated.price).toBe(149.99);
      expect(updated.stock).toBe(75);
      expect(updated.name).toBe('Test Product'); // Unchanged fields preserved
    });

    it('should throw error for negative price update', () => {
      const product = productService.createProduct({
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      });

      expect(() =>
        productService.updateProduct(product.id, { price: -10 })
      ).toThrow('Price cannot be negative');
    });

    it('should throw error for negative stock update', () => {
      const product = productService.createProduct({
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      });

      expect(() =>
        productService.updateProduct(product.id, { stock: -5 })
      ).toThrow('Stock cannot be negative');
    });

    it('should throw error if product not found', () => {
      expect(() =>
        productService.updateProduct(999, { price: 100 })
      ).toThrow('Product not found');
    });
  });

  describe('deleteProduct()', () => {
    it('should delete product successfully', () => {
      const product = productService.createProduct({
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      });

      const result = productService.deleteProduct(product.id);

      expect(result).toBe(true);
      expect(() => productService.getProductById(product.id)).toThrow();
    });

    it('should throw error if product not found', () => {
      expect(() => productService.deleteProduct(999)).toThrow('Product not found');
    });
  });

  describe('checkAvailability()', () => {
    it('should return true if stock is available', () => {
      const product = productService.createProduct({
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      });

      const isAvailable = productService.checkAvailability(product.id, 30);

      expect(isAvailable).toBe(true);
    });

    it('should return false if stock is insufficient', () => {
      const product = productService.createProduct({
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      });

      const isAvailable = productService.checkAvailability(product.id, 60);

      expect(isAvailable).toBe(false);
    });

    it('should throw error if product not found', () => {
      expect(() => productService.checkAvailability(999, 10)).toThrow(
        'Product not found'
      );
    });
  });

  describe('reduceStock()', () => {
    it('should reduce stock successfully', () => {
      const product = productService.createProduct({
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      });

      const updated = productService.reduceStock(product.id, 20);

      expect(updated.stock).toBe(30);
    });

    it('should throw error if insufficient stock', () => {
      const product = productService.createProduct({
        name: 'Test Product',
        description: 'A test product',
        price: 99.99,
        stock: 50,
      });

      expect(() => productService.reduceStock(product.id, 60)).toThrow(
        'Insufficient stock'
      );
    });

    it('should throw error if product not found', () => {
      expect(() => productService.reduceStock(999, 10)).toThrow('Product not found');
    });
  });
});
