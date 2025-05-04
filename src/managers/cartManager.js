const fs = require('fs').promises;

class CartManager {
    constructor(filePath) {
        this.path = filePath;
    }

    // buscar carrito por id
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return []; // Si no existe el archivo aún
        }
    }

    //guardar cambios
    async saveCarts(carts) {
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }

    // Crear carrito
    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };
        carts.push(newCart);
        await this.saveCarts(carts);
        return newCart;
    }


    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === parseInt(id));
    }

    // Añadir producto al carrito
    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === parseInt(cartId));
        if (!cart) return null;

        const existingProduct = cart.products.find(p => p.product === parseInt(productId));
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: parseInt(productId), quantity: 1 });
        }

        await this.saveCarts(carts);
        return cart;
    }
}

module.exports = CartManager;
