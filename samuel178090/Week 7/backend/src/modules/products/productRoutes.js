const express = require('express');
const ProductService = require('./productService');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const products = ProductService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const product = ProductService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const product = ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const product = ProductService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const product = ProductService.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;