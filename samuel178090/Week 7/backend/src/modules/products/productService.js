// Mock product database
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 10 },
  { id: 2, name: 'Phone', price: 599.99, category: 'Electronics', stock: 25 },
  { id: 3, name: 'Book', price: 19.99, category: 'Education', stock: 100 }
];

class ProductService {
  static getAllProducts() {
    return products;
  }

  static getProductById(id) {
    const product = products.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  static createProduct(productData) {
    const { name, price, category, stock } = productData;
    
    if (!name || !price || !category || stock === undefined) {
      throw new Error('All fields are required');
    }

    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      name,
      price: parseFloat(price),
      category,
      stock: parseInt(stock)
    };

    products.push(newProduct);
    return newProduct;
  }

  static updateProduct(id, updateData) {
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct = { ...products[productIndex], ...updateData };
    
    if (updatedProduct.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (updatedProduct.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  static deleteProduct(id) {
    const productIndex = products.findIndex(p => p.id === parseInt(id));
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    return deletedProduct;
  }
}

module.exports = ProductService;