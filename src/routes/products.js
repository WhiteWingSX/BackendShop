const express = require('express');
const path = require('path');
const ProductManager = require('../managers/productManager');
const router = express.Router();

const manager = new ProductManager(path.join(__dirname, '../db/products.json'));

// todos los productos
router.get('/', async (req, res)  => {
    try {
        const products = await manager.getProducts();
        res.status(200).json(
            products
        );
    } catch(error) {
        res.status(500).send('Error: problem to read products');
    }
});

// Producto por id
router.get('/:cid', async(req, res) => {
    try {
        const product = await manager.getProductById(parseInt(req.params.cid));

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.status(200).json(
            product
        )


    } catch (error) {
        res.status(500).send('Error: problem to read products');
    }
});

// Añadir producto
router.post ('/', async(req, res) => {
    try {
        const { title, description, price, thumbnails, code, stock, status, category } = req.body;
            if (!title || !description || !code || price === undefined || status === undefined || stock === undefined || !category || !thumbnails) {
                throw new Error('\n' + 'All fields are required');
            }

        const newProduct = await manager.addProduct({ title, description, price, thumbnails, code, stock, status, category });

            res.status(201).json(
                newProduct
            );

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
})

// Actualizar producto
router.put('/:id', async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await manager.getProductById(id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        if ('id' in req.body) {
            return res.status(400).json({ error: "The id can't not modificated" });
        }

        const updatedProduct = await manager.updateProduct(id, req.body);
        res.status(200).json(
            updatedProduct
        );

    } catch (error) {
        res.status(500).send('Error updating product');
    }
})

// Borrar producto
router.delete('/:id', async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedProduct = await manager.deleteProduct(id);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json(
            deletedProduct
        );
    } catch (error) {
        res.status(500).send('Error deleting product');
    }
})

module.exports = router;
