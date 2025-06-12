import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
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
};
