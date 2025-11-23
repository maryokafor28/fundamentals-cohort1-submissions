const products = [];

class ProductModel {
    static async create(data) {
        const id = products.length + 1;
        const newProduct = {id, ...data};
        products.push(newProduct);
        return newProduct;
    }

    static async findAll() {
        return products;
    }

    static async findAll() {
        return products;
    }

    static async clear() {
        products.length = 0;
    }
}

module.exports = ProductModel;
