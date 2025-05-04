const express = require('express');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

const app = express();

// MIDELLWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

module.exports = app;
