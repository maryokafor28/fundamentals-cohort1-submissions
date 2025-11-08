const ProductService = require('../modules/products/productService');

describe('ProductService Unit Tests', () => {
  describe('getAllProducts', () => {
    test('should return all products', () => {
      const products = ProductService.getAllProducts();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe('getProductById', () => {
    test('should return product by valid id', () => {
      const product = ProductService.getProductById(1);
      expect(product).toHaveProperty('id', 1);
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
    });

    test('should throw error for invalid id', () => {
      expect(() => ProductService.getProductById(999))
        .toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    test('should create product with valid data', () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        category: 'Test',
        stock: 10
      };
      
      const product = ProductService.createProduct(productData);
      expect(product).toHaveProperty('id');
      expect(product.name).toBe('Test Product');
      expect(product.price).toBe(99.99);
    });

    test('should throw error with missing fields', () => {
      expect(() => ProductService.createProduct({ name: 'Test' }))
        .toThrow('All fields are required');
    });

    test('should throw error with invalid price', () => {
      const productData = {
        name: 'Test Product',
        price: -10,
        category: 'Test',
        stock: 10
      };
      
      expect(() => ProductService.createProduct(productData))
        .toThrow('Price must be greater than 0');
    });

    test('should throw error with negative stock', () => {
      const productData = {
        name: 'Test Product',
        price: 99.99,
        category: 'Test',
        stock: -5
      };
      
      expect(() => ProductService.createProduct(productData))
        .toThrow('Stock cannot be negative');
    });
  });

  describe('updateProduct', () => {
    test('should update existing product', () => {
      const updatedProduct = ProductService.updateProduct(1, { name: 'Updated Laptop' });
      expect(updatedProduct.name).toBe('Updated Laptop');
    });

    test('should throw error for non-existent product', () => {
      expect(() => ProductService.updateProduct(999, { name: 'Test' }))
        .toThrow('Product not found');
    });
  });

  describe('deleteProduct', () => {
    test('should delete existing product', () => {
      const deletedProduct = ProductService.deleteProduct(3);
      expect(deletedProduct).toHaveProperty('id', 3);
    });

    test('should throw error for non-existent product', () => {
      expect(() => ProductService.deleteProduct(999))
        .toThrow('Product not found');
    });
  });
});