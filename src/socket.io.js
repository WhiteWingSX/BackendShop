const path = require('path');
const ProductManager = require('./managers/productManager');
const manager = new ProductManager(path.join(__dirname, './db/products.json'));

function configureSocket(io) {
    io.on('connection', async (socket) => {
        console.log('connected to server');

        const products = await manager.getProducts();
        socket.emit('product-list', products);

        socket.on('new-product', async (data) => {
            await manager.addProduct(data);
            const updated = await manager.getProducts();
            io.emit('product-list', updated);
        });

        socket.on('delete-product', async (id) => {
            await manager.deleteProduct(id);
            const updated = await manager.getProducts();
            io.emit('product-list', updated);
        });

        socket.on('disconnect', () => {
            console.log('disconnected to server');
        });
    });
}

module.exports = configureSocket;
