const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Crear un carrito nuevo (opcional)
router.post('/', async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error creating cart' });
    }
});

// Mostrar carrito con populate
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching cart' });
    }
});

router.post('/:cid/products/:pid/delete', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).render('error', { message: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.redirect(`/carts/${cid}`);
    } catch (error) {
        res.status(500).render('error', { message: 'Error al eliminar producto' });
    }
});

// Vaciar todo el carrito
router.post('/:cid/clear', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).render('error', { message: 'Carrito no encontrado' });

        cart.products = [];
        await cart.save();

        res.redirect(`/carts/${cid}`);
    } catch (error) {
        res.status(500).render('error', { message: 'Error al vaciar el carrito' });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.json({ status: 'success', message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error removing product' });
    }
});

// Reemplazar todo el contenido del carrito
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body; // [{ product: ObjectId, quantity: Number }]

        if (!Array.isArray(products)) {
            return res.status(400).json({ status: 'error', message: 'Products must be an array' });
        }

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        cart.products = products;
        await cart.save();

        res.json({ status: 'success', message: 'Cart updated', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error updating cart' });
    }
});

// Actualizar solo la cantidad
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        const product = await Product.findById(pid);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'No hay suficiente stock disponible' });
        }

        const item = cart.products.find(p => p.product.toString() === pid);
        if (item) {
            item.quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        product.stock -= quantity;

        await product.save();
        await cart.save();

        res.json({ message: 'Producto agregado y stock actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        cart.products = [];
        await cart.save();

        res.json({ status: 'success', message: 'All products removed from cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error clearing cart' });
    }
});

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

        const product = await Product.findById(pid);
        if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });

        const existingProduct = cart.products.find(p => p.product.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();

        if (req.headers.accept.includes('text/html')) {
            return res.redirect(`/carts/${cid}`);
        }

        res.json({ status: 'success', message: 'Product added to cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error adding product to cart' });
    }
});

module.exports = router;
