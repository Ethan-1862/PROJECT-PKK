// Data produk (alat modifikasi lampu motor)
let products = [];
let cart = [];
let selectedCategory = 'all';

// Load produk dari localStorage
function loadProductsFromStorage() {
    // Selalu gunakan produk motor (abaikan localStorage lama)
    const defaultProducts = [
        { id: 1, name: "Stoplamp Running LED X1", category: "stoplamp", price: 350000, description: "Stoplamp running LED universal, plug & play untuk motor", image: "images/stoplamp-running-1.jpg" },
        { id: 2, name: "Stoplamp Sequential PRO", category: "stoplamp", price: 450000, description: "Stoplamp sequential berkualitas, tampilan dinamis", image: "images/stoplamp-seq-1.jpg" },
        { id: 3, name: "Lampu Alis LED", category: "alis", price: 120000, description: "Lampu alis LED fleksibel untuk tampilan agresif", image: "images/lampu-alis-1.jpg" },
        { id: 4, name: "Lampu Running DRL 2in1", category: "running", price: 275000, description: "Lampu running/DRL dengan intensitas tinggi dan tahan air", image: "images/running-drl-1.jpg" },
        { id: 5, name: "Relay Flasher Universal", category: "relay", price: 65000, description: "Relay flasher untuk kompatibilitas LED, plug universal", image: "images/relay-1.jpg" },
        { id: 6, name: "Aksesoris Lampu (Bracket & Kabel)", category: "accessories", price: 45000, description: "Bracket pemasangan + kabel soket, lengkap", image: "images/aksesoris-lampu-1.jpg" },
    ];
    
    products = defaultProducts;
    localStorage.setItem('products', JSON.stringify(products));
}

// Fungsi menampilkan produk
function displayProducts(productsToShow = products) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    productsToShow.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animationDelay = (0.4 + index * 0.05) + 's';
        
        // Tampilkan gambar (URL atau emoji)
        let imageHtml = '';
        if (isImageUrl(product.image)) {
            imageHtml = `<img src="${product.image}" alt="${product.name}">`;
        } else {
            imageHtml = product.image; // Emoji
        }
        
        productCard.innerHTML = `
            <div class="product-image">${imageHtml}</div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Fungsi untuk cek apakah image adalah URL
function isImageUrl(image) {
    return image && (image.startsWith('http') || image.startsWith('data:'));
}

// Fungsi filter kategori
function filterByCategory(category) {
    selectedCategory = category;
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => item.classList.remove('active'));
    // mark the clicked category active (find by data-category)
    const el = document.querySelector(`.category-item[data-category="${category}"]`);
    if(el) el.classList.add('active');

    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// Fungsi tambah ke keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        saveCart();
        showNotification(`${product.name} ditambahkan ke keranjang!`);
        
        // Redirect ke halaman keranjang setelah 1.5 detik
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1500);
    }
}

// Update jumlah item di keranjang
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Simpan keranjang ke localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Muat keranjang dari localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Notifikasi
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #22c55e;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 2000;
        animation: slideIn 0.3s ease-in-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Pencarian produk
document.getElementById('searchBtn').addEventListener('click', () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
});

// Pencarian saat mengetik
document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});

// Filter kategori
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        filterByCategory(category);
    });
});

// Klik cart icon untuk ke halaman keranjang
document.querySelector('.cart-icon').addEventListener('click', () => {
    window.location.href = 'cart.html';
});

// Inisialisasi tampilan produk saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    loadProductsFromStorage(); // Load produk dari localStorage
    loadCart();
    displayProducts();
    initializeFooter(); // Inisialisasi footer dengan data dari config.js
    initializeContact(); // Inisialisasi kontak dengan link yang fungsional
});

// ----- Visual effects initialization -----
function initHeaderEffect(){
    const nav = document.querySelector('.navbar');
    if(!nav) return;
    window.addEventListener('scroll', () => {
        if(window.scrollY > 20) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
}

function initHeroParticles(){
    const canvas = document.getElementById('heroCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let rafId = null;
    let running = true;

    function resize(){
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        ctx.scale(dpr, dpr);
    }

    function createParticles(){
        particles = [];
        const count = Math.max(12, Math.floor(window.innerWidth / 120));
        for(let i=0;i<count;i++){
            particles.push({
                x: Math.random()*canvas.clientWidth,
                y: Math.random()*canvas.clientHeight,
                r: 8 + Math.random()*28,
                vx: (Math.random()-0.5)*0.2,
                vy: (Math.random()-0.5)*0.2,
                alpha: 0.15 + Math.random()*0.35
            });
        }
    }

    function draw(){
        ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
        particles.forEach(p=>{
            p.x += p.vx;
            p.y += p.vy;
            if(p.x < -50) p.x = canvas.clientWidth + 50;
            if(p.x > canvas.clientWidth + 50) p.x = -50;
            if(p.y < -50) p.y = canvas.clientHeight + 50;
            if(p.y > canvas.clientHeight + 50) p.y = -50;

            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            grad.addColorStop(0, `rgba(255,255,255,${p.alpha})`);
            grad.addColorStop(0.6, `rgba(150,150,255,${p.alpha*0.25})`);
            grad.addColorStop(1, 'rgba(150,150,255,0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fill();
        });
    }

    function loop(){
        if(!running) return;
        draw();
        rafId = requestAnimationFrame(loop);
    }

    function start(){
        resize();
        createParticles();
        if(rafId) cancelAnimationFrame(rafId);
        running = true;
        loop();
    }

    function pause(){
        running = false;
        if(rafId) cancelAnimationFrame(rafId);
    }

    function resume(){
        if(running) return;
        running = true;
        loop();
    }

    window.addEventListener('resize', () => { resize(); createParticles(); });
    start();
    // expose controls for performance tweaks
    window.heroParticles = { pause, resume };
}

// ensure visual effects initialize after DOM content
window.addEventListener('DOMContentLoaded', () => {
    initHeroParticles();
    initHeaderEffect();
    initHeroVideoControls();
});

function initHeroVideoControls(){
    const vid = document.getElementById('heroVideo');
    if(!vid) return;
    // attempt to play (some browsers require user gesture; safe-ignore errors)
    vid.play().catch(()=>{});
    // Pause video when tab hidden to save resources
    document.addEventListener('visibilitychange', () => {
        if(document.hidden) vid.pause();
        else vid.play().catch(()=>{});
    });
    // toggle button
    const toggle = document.getElementById('heroToggle');
    if(toggle){
        toggle.addEventListener('click', () => {
            if(vid.paused){
                vid.play().catch(()=>{});
                toggle.innerHTML = '<i class="fas fa-pause"></i>';
                if(window.heroParticles && window.heroParticles.resume) window.heroParticles.resume();
                toggle.setAttribute('aria-label','Pause background video');
            } else {
                vid.pause();
                toggle.innerHTML = '<i class="fas fa-play"></i>';
                if(window.heroParticles && window.heroParticles.pause) window.heroParticles.pause();
                toggle.setAttribute('aria-label','Play background video');
            }
        });
    }
    // If video is autoplay-blocked, show play icon
    vid.addEventListener('play', () => { if(toggle) toggle.innerHTML = '<i class="fas fa-pause"></i>'; });
    vid.addEventListener('pause', () => { if(toggle) toggle.innerHTML = '<i class="fas fa-play"></i>'; });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
