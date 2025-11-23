const service = require('./products.service');

exports.create = async (req, res) => {
    try {
        const product = await service.createProduct(req.body);
        res.status(201).json(product);
    }   catch (err) {
        res.status(400).json({error: err.message});
    }
};

exports.getAll = async (req, res) => {
    const products = await service.getProducts();
    res.status(200).json(products);
};
