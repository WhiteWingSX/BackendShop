const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Cart = require('../models/Cart');

router.get('/products', async (req, res) => {
    const {
        limit = 10,
        page = 1,
        sort,
        query
    } = req.query;

    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        lean: true,
    };

    if (sort === 'asc') options.sort = { price: 1 };
    else if (sort === 'desc') options.sort = { price: -1 };

    const filter = {};
    if (query) {
        if (query === 'true' || query === 'false') {
            filter.status = query === 'true';
        } else {
            filter.category = query;
        }
    }

    try {
        const result = await Product.paginate(filter, options);

        res.render('products', {
            products: result.docs,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            limit,
            sort,
            query,
            cartId: '68492eab1c3007343a6655d3',
        });
    } catch (error) {
        res.status(500).send('Error to GET products');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await Product.findById(pid).lean();

        if (!product) {
            return res.status(404).render('error', { message: 'Product not found' });
        }

        res.render('productDetail', { product });
    } catch (error) {
        res.status(500).render('error', { message: 'Error to load Product' });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        // POPULATE
        const cart = await Cart.findById(cid).populate('products.product').lean();

        if (!cart) {
            return res.status(404).render('error', { message: 'Cart not found' });
        }

        res.render('cartDetail', { cart });
    } catch (error) {
        res.status(500).render('error', { message: 'Error to Load Cart' });
    }
});


// Vista para un carrito específico
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();

        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }

        res.render('cartDetail', { cart });
    } catch (error) {
        res.status(500).render('error', { message: 'Error al cargar el carrito' });
    }
});

module.exports = router;
