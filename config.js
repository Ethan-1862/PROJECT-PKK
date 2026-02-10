// config.js - File Konfigurasi Website
// Ubah informasi di bawah ini dengan data Anda sendiri

const config = {
    // Informasi Toko
    storeName: 'ElectroHub',
    storeDescription: 'Toko elektronik terpercaya dengan produk berkualitas dan harga terbaik',
    
    // Informasi Footer - Bagian Tentang
    about: {
        title: 'Tentang ElectroHub',
        links: [
            { text: 'Tentang Kami', url: '#' },
            { text: 'Karir', url: '#' },
            { text: 'Blog', url: '#' }
        ]
    },
    
    // Layanan
    services: {
        title: 'Layanan',
        links: [
            { text: 'Pengiriman', url: '#' },
            { text: 'Pengembalian', url: '#' },
            { text: 'Garansi', url: '#' }
        ]
    },
    
    // Legal
    legal: {
        title: 'Legal',
        links: [
            { text: 'Syarat & Ketentuan', url: '#' },
            { text: 'Kebijakan Privasi', url: '#' }
        ]
    },
    
    // MEDIA SOSIAL - UBAH DENGAN PROFIL ANDA
    // Replace 'username' dengan username Instagram/Facebook/Twitter Anda
    socialMedia: {
        facebook: {
            icon: 'fab fa-facebook',
            url: 'https://facebook.com/username', // Ubah 'username'
            name: 'Facebook'
        },
        twitter: {
            icon: 'fab fa-twitter',
            url: 'https://twitter.com/username', // Ubah 'username'
            name: 'Twitter'
        },
        instagram: {
            icon: 'fab fa-instagram',
            url: 'https://instagram.com/gibso.__', // Ubah 'username'
            name: 'Instagram'
        },
        tiktok: {
            icon: 'fab fa-tiktok',
            url: 'https://tiktok.com/@username', // Ubah 'username'
            name: 'TikTok'
        },
        youtube: {
            icon: 'fab fa-youtube',
            url: 'https://youtube.com/@username', // Ubah 'username'
            name: 'YouTube'
        }
    },
    
    // Informasi Kontak - UBAH DENGAN DATA ANDA
    contact: {
        // Nomor WhatsApp (format: 62XXXXXXXXXX tanpa tanda +)
        // Contoh: 62812345678 untuk +62812345678
        phone: '6285718668652', // ← UBAH DENGAN NOMOR WA ANDA
        phoneDisplay: '+62 857-1866-8652', // Tampilan di website
        
        // Email toko
        email: 'info@gibranarsyid999@gmail.com', // ← UBAH DENGAN EMAIL ANDA
        
        // Lokasi toko untuk Google Maps
        // Format: "latitude,longitude" atau "alamat lengkap"
        // Contoh: "-6.2088,106.8456" atau "ElectroHub, Jl. Elektronik No. 123, Jakarta"
        address: 'ElectroHub, Jl. Elektronik No. 123, Jakarta', // ← UBAH DENGAN ALAMAT ANDA
        addressDisplay: 'Jl. Elektronik No. 123, Jakarta'
    },
    
    // Copyright
    copyrightYear: 2026,
    copyrightText: 'ElectroHub. Semua hak dilindungi.',
    
    // METODE PEMBAYARAN
    // QRIS dan COD saja
    paymentMethods: {
        qris: 'QRIS (Barcode Pembayaran Nasional)',
        cod: 'COD (Bayar di Tempat)'
    }
};

// Fungsi untuk mengisi footer secara otomatis
function initializeFooter() {
    // Isi bagian About
    const aboutSection = document.querySelector('.footer-section:nth-child(1)');
    if (aboutSection) {
        aboutSection.innerHTML = `
            <h4>${config.about.title}</h4>
            <ul>
                ${config.about.links.map(link => `<li><a href="${link.url}">${link.text}</a></li>`).join('')}
            </ul>
        `;
    }
    
    // Isi bagian Services
    const servicesSection = document.querySelector('.footer-section:nth-child(2)');
    if (servicesSection) {
        servicesSection.innerHTML = `
            <h4>${config.services.title}</h4>
            <ul>
                ${config.services.links.map(link => `<li><a href="${link.url}">${link.text}</a></li>`).join('')}
            </ul>
        `;
    }
    
    // Isi bagian Legal
    const legalSection = document.querySelector('.footer-section:nth-child(3)');
    if (legalSection) {
        legalSection.innerHTML = `
            <h4>${config.legal.title}</h4>
            <ul>
                ${config.legal.links.map(link => `<li><a href="${link.url}">${link.text}</a></li>`).join('')}
            </ul>
        `;
    }
    
    // Isi bagian Social Media
    const socialSection = document.querySelector('.footer-section:nth-child(4)');
    if (socialSection) {
        const socialLinks = Object.values(config.socialMedia)
            .map(social => `<a href="${social.url}" title="${social.name}" target="_blank"><i class="${social.icon}"></i></a>`)
            .join('');
        
        socialSection.innerHTML = `
            <h4>Ikuti Kami</h4>
            <div class="social-links">
                ${socialLinks}
            </div>
        `;
    }
    
    // Isi copyright
    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) {
        footerBottom.textContent = `&copy; ${config.copyrightYear} ${config.copyrightText}`;
    }
}

// Fungsi untuk mengisi section kontak dengan link yang fungsional
function initializeContact() {
    const contactInfo = document.getElementById('contactInfo');
    if (!contactInfo || !config || !config.contact) return;
    
    const contact = config.contact;
    
    // Generate WhatsApp link (format: https://wa.me/NOMORWA)
    const whatsappLink = `https://wa.me/${contact.phone}?text=Halo%20ElectroHub,%20saya%20ingin%20bertanya%20tentang%20produk%20Anda`;
    
    // Generate email link
    const emailLink = `mailto:${contact.email}?subject=Pertanyaan%20Produk&body=Halo%20ElectroHub,%20saya%20ingin%20bertanya...`;
    
    // Generate Google Maps link
    const mapsLink = `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`;
    
    contactInfo.innerHTML = `
        <a href="${whatsappLink}" target="_blank" class="contact-item">
            <i class="fab fa-whatsapp"></i>
            <p>${contact.phoneDisplay}</p>
            <small>Chat via WhatsApp</small>
        </a>
        <a href="${emailLink}" class="contact-item">
            <i class="fas fa-envelope"></i>
            <p>${contact.email}</p>
            <small>Kirim Email</small>
        </a>
        <a href="${mapsLink}" target="_blank" class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <p>${contact.addressDisplay}</p>
            <small>Lihat Lokasi</small>
        </a>
    `;
}