document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-to-cart-btn');

    let cartId = localStorage.getItem('cartId');

    const createCartIfNotExists = async () => {
        if (!cartId) {
            try {
                const res = await fetch('/api/carts', { method: 'POST' });
                const data = await res.json();
                cartId = data._id;
                localStorage.setItem('cartId', cartId);
            } catch (err) {
                console.error('Error creating cart:', err);
            }
        }
    };

    createCartIfNotExists().then(() => {
        buttons.forEach(button => {
            button.addEventListener('click', async () => {
                const productId = button.dataset.productid;
                const stockSpan = document.getElementById(`stock-${productId}`);
                let stock = parseInt(stockSpan.textContent);

                if (stock <= 0) {
                    alert('Sin stock disponible');
                    return;
                }

                try {
                    const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ quantity: 1 })
                    });

                    if (res.ok) {
                        stock--;
                        stockSpan.textContent = stock;
                        if (stock === 0) button.disabled = true;

                        alert('Producto agregado al carrito');
                    } else {
                        const error = await res.json();
                        alert(`Error: ${error.message || 'No se pudo agregar'}`);
                    }
                } catch (err) {
                    console.error('Error:', err);
                    alert('Error al agregar al carrito');
                }
            });
        });
    });
});
