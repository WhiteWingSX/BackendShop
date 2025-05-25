const express = require('express');
const router = express.Router();
const path = require('path');
const ProductManager = require('../managers/productManager');

const manager = new ProductManager(path.join(__dirname, '../db/products.json'));

router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
    const products = await manager.getProducts();
    res.render('realTimeProducts', { products });
});

module.exports = router;
