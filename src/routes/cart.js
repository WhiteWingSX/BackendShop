const express = require('express');
const path = require("path");
const CartManager = require('../managers/cartManager');
const router = express.Router();

const cartFilePath = path.join(__dirname, '../db/carts.json');
const cartManager = new CartManager(cartFilePath);

// carrito por id
router.get('/:cid', async(req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        res.status(200).json(
            cart.products
        );


    } catch (error) {
        res.status(500).send(
            'Error: problem to read carts'
        );
    }
});

// Agregar carrito
router.post ('/', async(req, res) => {
    try {
        const newCart = await cartManager.createCart();

        res.status(201).json(
            newCart
        );

    } catch (error) {
        res.status(500).json(
            { error: error.message }
        );
    }
})

// Agregar producto al carrito
router.post ('/:cid/product/:pid', async(req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        if (!updatedCart) return res.status(404).json({ error: 'Cart not found' });

        res.status(200).json(
            updatedCart
        );

    } catch (error) {
        res.status(500).json(
            { error: error.message })
        ;
    }
})

module.exports = router;
