const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    // Obtener listado
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            return [];
        }
    }

    // Obtener producto por ID
    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(prod => prod.id === id);
    }

    // Agregar producto
    async addProduct({ title, description, price, thumbnails, code, stock, category, status }) {
        const products = await this.getProducts();

        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };

        products.push(newProduct);
        await this.saveProducts(products);
        return newProduct;
    }

    // Actualizar producto
    async updateProduct(id, updatedData) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;

        if (updatedData.id && updatedData.id !== id) {
            throw new Error('ID no puede modificarse');
        }

        const { id: _, ...rest } = updatedData;
        products[index] = { ...products[index], ...rest };

        await this.saveProducts(products);
        return products[index];
    }

    // Eliminar producto
    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;

        const deleted = products.splice(index, 1)[0];
        await this.saveProducts(products);
        return deleted;
    }

    // Guardar data
    async saveProducts(products) {
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }

}

module.exports = ProductManager;
