// payment.js

// Data rekening per metode pembayaran
const paymentMethods = {
    'qris': {
        name: 'QRIS (Barcode Pembayaran Nasional)',
        icon: '📱',
        type: 'qris',
        details: {
            'Metode': 'Scan QR Code dengan aplikasi pembayaran',
            'Bank Penerima': 'Semua Bank Indonesia',
            'Nama Penerima': 'PT ElectroHub Indonesia',
            'Status': 'Aktif & Tersedia 24/7'
        },
        qris: '00020126360014com.electrohub.qr0132170730134080010140112220315A1201004250005802ID5913PT ELECTROHUB6010JAKARTA620472504521143081234567890102000000210ELECTROHUB631901220'
    },
    'cod': {
        name: 'COD (Bayar di Tempat)',
        icon: '🚚',
        type: 'cod',
        details: {
            'Metode': 'Pembayaran saat barang diterima',
            'Penerima': 'Kurir ElectroHub',
            'Waktu Pembayaran': 'Saat Pengiriman',
            'Status': 'Tersedia di area tertentu'
        }
    }
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let selectedPayment = localStorage.getItem('selectedPayment') || 'qris';

// Tampilkan ringkasan pesanan
function displayOrderSummary() {
    const summaryHtml = document.getElementById('orderSummary');
    let itemsHtml = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        itemsHtml += `
            <div class="order-item">
                <span>${item.name} x${item.quantity}</span>
                <span>Rp ${itemTotal.toLocaleString('id-ID')}</span>
            </div>
        `;
    });

    const tax = Math.floor(subtotal * 0.1);
    const shipping = 50000;
    const total = subtotal + tax + shipping;

    summaryHtml.innerHTML += `
        ${itemsHtml}
        <div class="order-item" style="padding-top: 15px;">
            <span>Subtotal</span>
            <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div class="order-item">
            <span>Pajak (10%)</span>
            <span>Rp ${tax.toLocaleString('id-ID')}</span>
        </div>
        <div class="order-item">
            <span>Ongkir</span>
            <span>Rp ${shipping.toLocaleString('id-ID')}</span>
        </div>
        <div class="order-total">
            <span>Total Pembayaran</span>
            <span>Rp ${total.toLocaleString('id-ID')}</span>
        </div>
    `;

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Tampilkan detail metode pembayaran
function displayPaymentMethod() {
    const paymentInfo = document.getElementById('paymentMethodInfo');
    const method = paymentMethods[selectedPayment];
    
    if (!method) return;

    let detailsHtml = `
        <h3>${method.icon} ${method.name}</h3>
    `;

    // Tampilkan QRIS jika tersedia
    if (method.qris) {
        detailsHtml += `
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="font-weight: 600; margin-bottom: 15px;">Scan QR Code dengan aplikasi pembayaran Anda:</p>
                <div id="qrCodeContainer" style="background: #fff; padding: 20px; border-radius: 8px; display: inline-block;">
                    <!-- QR Code akan ditampilkan di sini -->
                </div>
                <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">Atau gunakan nomor/akun di bawah</p>
            </div>
        `;
    }

    detailsHtml += `
        <div class="bank-details">
    `;

    for (let key in method.details) {
        detailsHtml += `
            <div class="bank-detail-row">
                <span class="label">${key}:</span>
                <span class="value">${method.details[key]}</span>
            </div>
        `;
    }

    detailsHtml += `</div>`;

    // Tambahkan tombol copy untuk nomor rekening/akun
    const accountKey = method.details['Nomor Rekening'] 
        ? 'Nomor Rekening' 
        : (method.details['Nomor Tujuan'] ? 'Nomor Tujuan' : null);
    
    if (accountKey) {
        const accountValue = method.details[accountKey];
        detailsHtml += `
            <button class="copy-btn" onclick="copyToClipboard('${accountValue}')">
                <i class="fas fa-copy"></i> Salin ${accountKey}
            </button>
        `;
    }

    paymentInfo.innerHTML = detailsHtml;

    // Generate QR Code jika ada
    if (method.qris) {
        generateQRCode(method.qris);
    }
}

// Copy ke clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Nomor berhasil disalin ke clipboard!');
    }).catch(() => {
        // Fallback untuk browser yang tidak mendukung clipboard API
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('Nomor berhasil disalin ke clipboard!');
    });
}

// Generate QR Code
function generateQRCode(qrisData) {
    const container = document.getElementById('qrCodeContainer');
    container.innerHTML = ''; // Clear previous QR code
    
    const method = selectedPayment;
    
    // Cek apakah ada file QR code lokal
    if (config && config.qrCodes && config.qrCodes[method]) {
        const qrCodePath = config.qrCodes[method];
        const img = document.createElement('img');
        
        // Handle error jika file tidak ditemukan
        img.onerror = function() {
            console.warn(`File QRIS tidak ditemukan: ${qrCodePath}`);
            container.innerHTML = `
                <div style="text-align: center; padding: 30px; background: #fff3cd; border-radius: 8px; border: 2px solid #ffc107;">
                    <p style="color: #856404; font-weight: bold; margin: 0;">⚠️ QR Code belum disiapkan</p>
                    <p style="color: #856404; margin: 10px 0 0 0; font-size: 0.9rem;">
                        File ${qrCodePath} tidak ditemukan.<br>
                        Silakan letakkan file QRIS Anda di folder qr-codes/
                    </p>
                </div>
            `;
        };
        
        // Load file lokal
        img.src = qrCodePath;
        img.alt = 'QRIS QR Code';
        img.style.borderRadius = '8px';
        img.style.border = '2px solid #0066cc';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        
        container.appendChild(img);
    } else {
        // Fallback: Generate dari API jika tidak ada config
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrisData)}`;
        
        const img = document.createElement('img');
        img.src = qrCodeUrl;
        img.alt = 'QRIS QR Code';
        img.style.borderRadius = '8px';
        img.style.border = '2px solid #0066cc';
        
        container.appendChild(img);
    }
}

// Ubah metode pembayaran
function changePaymentMethod(method) {
    selectedPayment = method;
    localStorage.setItem('selectedPayment', method);
    
    // Update radio button
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.checked = (radio.value === method);
    });
    
    displayPaymentMethod();
    const codSection = document.getElementById('codIdentitySection');
    if (codSection) codSection.style.display = (method === 'cod') ? 'block' : 'none';
}

// Konfirmasi pembayaran
function confirmPayment() {
    const email = document.getElementById('emailInput').value;
    
    if (!email || !email.includes('@')) {
        alert('Mohon masukkan email yang valid terlebih dahulu!');
        return;
    }

    // Jika metode COD, validasi identitas penerima
    if (selectedPayment === 'cod') {
        const codName = document.getElementById('codName').value.trim();
        const codAddress = document.getElementById('codAddress').value.trim();
        const codPhone = document.getElementById('codPhone').value.trim();
        if (!codName || !codAddress || !codPhone) {
            alert('Mohon isi nama, nomor telepon, dan alamat lengkap penerima untuk COD.');
            return;
        }
    }

    // Tampilkan success message
    document.getElementById('successMessage').style.display = 'block';
    document.querySelector('.payment-actions').style.display = 'none';
    document.querySelector('.instructions').style.display = 'none';

    // Simpan data transaksi
    const transaction = {
        id: 'TRX-' + Date.now(),
        email: email,
        items: cart,
        paymentMethod: selectedPayment,
        buyerName: selectedPayment === 'cod' ? document.getElementById('codName').value.trim() : null,
        buyerPhone: selectedPayment === 'cod' ? document.getElementById('codPhone').value.trim() : null,
        buyerAddress: selectedPayment === 'cod' ? document.getElementById('codAddress').value.trim() : null,
        timestamp: new Date().toLocaleString('id-ID'),
        status: 'pending_confirmation'
    };
    localStorage.setItem('lastTransaction', JSON.stringify(transaction));

    // Reset keranjang setelah 3 detik
    setTimeout(() => {
        localStorage.removeItem('cart');
        alert(`Terima kasih! Konfirmasi pembayaran telah dikirim ke ${email}\n\nID Transaksi: ${transaction.id}`);
        window.location.href = 'home.html';
    }, 2000);
}

// Kirim email konfirmasi
function sendConfirmation() {
    const email = document.getElementById('emailInput').value;
    
    if (!email || !email.includes('@')) {
        alert('Mohon masukkan email yang valid!');
        return;
    }

    // Simulasi pengiriman email
    alert(`Email konfirmasi akan dikirim ke:\n${email}\n\nPastikan email Anda benar!`);
    document.getElementById('emailInput').value = '';
}

// Inisialisasi halaman
window.addEventListener('DOMContentLoaded', () => {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        window.location.href = 'home.html';
        return;
    }

    displayOrderSummary();
    
    // Set radio button sesuai selected payment
    const paymentRadio = document.getElementById(`pm-${selectedPayment}`);
    if (paymentRadio) {
        paymentRadio.checked = true;
    }
    
    displayPaymentMethod();
    const codSection = document.getElementById('codIdentitySection');
    if (codSection) codSection.style.display = (selectedPayment === 'cod') ? 'block' : 'none';
    initializeFooter(); // Inisialisasi footer dengan data dari config.js
    initializeContact(); // Inisialisasi kontak dengan link yang fungsional
});