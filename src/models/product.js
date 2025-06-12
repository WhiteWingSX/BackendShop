const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: String,
    code: String,
    stock: Number,
    category: String,
    status: Boolean
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
