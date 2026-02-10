// cart.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Tampilkan item keranjang
function displayCartItems() {
    const container = document.getElementById('cartItemsContainer');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-inbox"></i>
                <p>Keranjang Anda kosong</p>
                <a href="home.html" class="back-btn">← Kembali Belanja</a>
            </div>
        `;
        document.getElementById('checkoutBtn').disabled = true;
        return;
    }

    container.innerHTML = '';
    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
                <div class="qty-display">${item.quantity}</div>
                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                <div class="subtotal">Rp ${subtotal.toLocaleString('id-ID')}</div>
                <button class="remove-btn" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i> Hapus</button>
            </div>
        `;
        container.appendChild(cartItem);
    });

    updateTotal();
}

// Update kuantitas
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }
    saveCart();
    displayCartItems();
}

// Hapus dari keranjang
function removeFromCart(index) {
    if (confirm('Yakin ingin menghapus produk ini?')) {
        cart.splice(index, 1);
        saveCart();
        displayCartItems();
    }
}

// Update total harga
function updateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.floor(subtotal * 0.1);
    const shipping = 50000;
    const total = subtotal + tax + shipping;

    document.getElementById('subtotalPrice').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('taxPrice').textContent = `Rp ${tax.toLocaleString('id-ID')}`;
    document.getElementById('totalPrice').textContent = `Rp ${total.toLocaleString('id-ID')}`;

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Simpan keranjang ke localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Proses checkout
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }

    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    
    // Simpan metode pembayaran
    localStorage.setItem('selectedPayment', selectedPayment);

    // Buka halaman pembayaran
    window.location.href = 'payment.html';
});

// Klik icon keranjang di navbar
document.querySelector('.cart-icon').addEventListener('click', () => {
    // Halaman ini adalah halaman keranjang, jadi tidak ada aksi
    return false;
});

// Inisialisasi
window.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    initializeFooter(); // Inisialisasi footer dengan data dari config.js
    initializeContact(); // Inisialisasi kontak dengan link yang fungsional
});