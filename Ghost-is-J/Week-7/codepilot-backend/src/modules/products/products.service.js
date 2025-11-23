const ProductModel = require('./products.model');

class ProductService {
    async createProduct(data) {
        if (!data.name || !data.price) throw new Error('Name and price required');
        return await ProductModel.create(data);
    }

    async getProducts() {
        return await ProductModel.findAll();
    }
}

module.exports = new ProductService();
