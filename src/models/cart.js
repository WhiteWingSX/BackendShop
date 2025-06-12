const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',  // Referencia al modelo Product
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            }
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);
