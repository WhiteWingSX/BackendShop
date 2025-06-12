const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
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

        const result = await Product.paginate(filter, options);

        const { docs, totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = result;

        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

        res.json({
            status: 'success',
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page: result.page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `${baseUrl}?page=${prevPage}` : null,
            nextLink: hasNextPage ? `${baseUrl}?page=${nextPage}` : null
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET
router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product' });
    }
});

// POST
router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnails, code, stock, status, category } = req.body;
        if (!title || !description || !code || price === undefined || status === undefined || stock === undefined || !category || !thumbnails) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newProduct = await Product.create({ title, description, price, thumbnails, code, stock, status, category });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
    }
});

// PUT
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        if ('_id' in req.body) return res.status(400).json({ error: "The ID can't be modified" });

        const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
});

// DELETE
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });

        res.json(deletedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
});

module.exports = router;
