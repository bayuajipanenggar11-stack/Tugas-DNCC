/**
 * ==============================================================================
 * YESTERBAY Coffee & Eatery - Script JavaScript Dasar
 * Tugas Pemrograman Web: Toko Online Sederhana
 * Fitur:
 * - Render Daftar Menu Produk
 * - Keranjang Belanja (Tambah, Ubah Kuantitas, Hapus, Hitung Total)
 * - Modal Interaktif (Cart, Checkout, Notifikasi Sukses)
 * - Formulir Pemesanan Sederhana
 * - Navigasi Responsif (Mobile Menu)
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. DATA PRODUK (Array of Objects)
// ------------------------------------------------------------------------------
const products = [
  {
    id: 1,
    name: "Sea Salt Latte",
    description: "Perpaduan kopi dengan susu lembut dan sentuhan sea salt yang memberikan rasa gurih dan creamy.",
    price: 18000,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Americano",
    description: "Espresso dengan air yang menghasilkan rasa kopi yang ringan, clean, dan tetap nikmat.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Cafe Latte",
    description: "Kombinasi espresso mantap dan susu hangat dengan lapisan microfoam lembut.",
    price: 18000,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Cappuccino",
    description: "Keseimbangan sempurna antara espresso, susu hangat, dan foam tebal bertabur cocoa.",
    price: 18000,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Chocolate",
    description: "Minuman cokelat kaya rasa manis lembut yang pas dinikmati kapan saja.",
    price: 17000,
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    name: "French Fries",
    description: "Kentang goreng renyah di luar dan lembut di dalam dengan taburan bumbu gurih.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80"
  }
];

// Placeholder gambar cadangan (jika koneksi internet lambat / offline)
const fallbackImage = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22250%22%20viewBox%3D%220%200%20400%20250%22%3E%3Crect%20fill%3D%22%23F5EBDD%22%20width%3D%22400%22%20height%3D%22250%22%2F%3E%3Ctext%20fill%3D%22%236F4E37%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EYESTERBAY%20Coffee%3C%2Ftext%3E%3C%2Fsvg%3E";

// ------------------------------------------------------------------------------
// 2. STATE KERANJANG BELANJA (Array Penampung Item)
// ------------------------------------------------------------------------------
let cart = [];

// ------------------------------------------------------------------------------
// 3. ELEMEN DOM (Document Object Model)
// ------------------------------------------------------------------------------
const menuGrid = document.getElementById("menuGrid");
const cartBadge = document.getElementById("cartBadge");

// Elemen Modal Keranjang
const cartModal = document.getElementById("cartModal");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const continueShoppingBtn = document.getElementById("continueShoppingBtn");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");

// Elemen Modal Checkout
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
const backToCartBtn = document.getElementById("backToCartBtn");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutSummaryTotal = document.getElementById("checkoutSummaryTotal");
const checkoutSummaryCount = document.getElementById("checkoutSummaryCount");

// Elemen Modal Sukses
const successModal = document.getElementById("successModal");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");

// Mobile Menu Navigation
const mobileToggle = document.getElementById("mobileToggle");
const navMenu = document.getElementById("navMenu");

// ------------------------------------------------------------------------------
// 4. FUNGSI FORMAT MATA UANG (Rupiah)
// ------------------------------------------------------------------------------
function formatRupiah(number) {
  return "Rp" + number.toLocaleString("id-ID");
}

// ------------------------------------------------------------------------------
// 5. RENDER DAFTAR PRODUK KE HALAMAN
// ------------------------------------------------------------------------------
function renderMenu() {
  menuGrid.innerHTML = "";

  products.forEach(product => {
    // Membuat elemen kartu produk
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image-container">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="product-image"
          loading="lazy"
          onerror="this.onerror=null; this.src='${fallbackImage}';"
        >
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${formatRupiah(product.price)}</span>
          <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
            + Add to Cart
          </button>
        </div>
      </div>
    `;

    menuGrid.appendChild(card);
  });
}

// ------------------------------------------------------------------------------
// 6. OPERASI KERANJANG BELANJA (CART)
// ------------------------------------------------------------------------------

/**
 * Menambahkan produk ke keranjang belanja
 */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Cek apakah produk sudah ada di keranjang
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  // Update tampilan UI keranjang
  updateCartUI();

  // Animasi getar kecil pada badge untuk feedback visual
  cartBadge.style.transform = "scale(1.25)";
  setTimeout(() => {
    cartBadge.style.transform = "scale(1)";
  }, 200);
}

/**
 * Mengubah jumlah (quantity) produk dalam keranjang
 */
function changeQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += delta;

  // Jika quantity menjadi 0 atau kurang, hapus item dari cart
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    updateCartUI();
  }
}

/**
 * Menghapus produk dari keranjang
 */
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

/**
 * Menghitung total harga dan total item di keranjang
 */
function calculateTotals() {
  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
  });

  return { totalItems, totalPrice };
}

/**
 * Memperbarui Tampilan UI Keranjang & Badge Navbar
 */
function updateCartUI() {
  const { totalItems, totalPrice } = calculateTotals();

  // Update badge navbar
  cartBadge.textContent = totalItems;

  // Render item dalam modal keranjang
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">☕</span>
        <p>Keranjang belanja masih kosong.</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">Yuk, pilih menu favoritmu terlebih dahulu!</p>
      </div>
    `;
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = "0.5";
    checkoutBtn.style.cursor = "not-allowed";
  } else {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.cursor = "pointer";

    cartItemsContainer.innerHTML = "";
    cart.forEach(item => {
      const itemRow = document.createElement("div");
      itemRow.className = "cart-item";

      const subtotal = item.price * item.quantity;

      itemRow.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatRupiah(item.price)} &times; ${item.quantity} = <strong>${formatRupiah(subtotal)}</strong></div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)" title="Kurang">-</button>
          <span class="qty-number">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)" title="Tambah">+</button>
          <button class="delete-btn" onclick="removeFromCart(${item.id})" title="Hapus">&#128465;</button>
        </div>
      `;

      cartItemsContainer.appendChild(itemRow);
    });
  }

  // Update total harga
  cartTotalPrice.textContent = formatRupiah(totalPrice);
}

// ------------------------------------------------------------------------------
// 7. MANAJEMEN MODAL & EVENT LISTENER
// ------------------------------------------------------------------------------

// Buka Modal Cart
openCartBtn.addEventListener("click", () => {
  updateCartUI();
  cartModal.classList.add("active");
});

// Tutup Modal Cart
closeCartBtn.addEventListener("click", () => {
  cartModal.classList.remove("active");
});

continueShoppingBtn.addEventListener("click", () => {
  cartModal.classList.remove("active");
});

// Tutup modal jika area luar (backdrop) diklik
window.addEventListener("click", (e) => {
  if (e.target === cartModal) cartModal.classList.remove("active");
  if (e.target === checkoutModal) checkoutModal.classList.remove("active");
  if (e.target === successModal) successModal.classList.remove("active");
});

// Buka Modal Checkout
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Keranjang masih kosong. Silakan pilih menu terlebih dahulu!");
    return;
  }

  const { totalItems, totalPrice } = calculateTotals();
  checkoutSummaryTotal.textContent = formatRupiah(totalPrice);
  checkoutSummaryCount.textContent = totalItems;

  cartModal.classList.remove("active");
  checkoutModal.classList.add("active");
});

// Tutup Modal Checkout
closeCheckoutBtn.addEventListener("click", () => {
  checkoutModal.classList.remove("active");
});

// Kembali ke Modal Cart dari Checkout
backToCartBtn.addEventListener("click", () => {
  checkoutModal.classList.remove("active");
  cartModal.classList.add("active");
});

// Submit Form Checkout
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Mencegah reload halaman

  // Ambil data dari formulir
  const name = document.getElementById("customerName").value.trim();
  const whatsapp = document.getElementById("customerWhatsapp").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const notes = document.getElementById("orderNotes").value.trim();

  // Validasi sederhana
  if (!name || !whatsapp || !address) {
    alert("Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Anda.");
    return;
  }

  // Tutup modal checkout
  checkoutModal.classList.remove("active");

  // Reset form
  checkoutForm.reset();

  // Kosongkan keranjang setelah pesanan berhasil
  cart = [];
  updateCartUI();

  // Tampilkan modal pesan berhasil
  successModal.classList.add("active");
});

// Tutup Modal Sukses
closeSuccessBtn.addEventListener("click", () => {
  successModal.classList.remove("active");
});

// ------------------------------------------------------------------------------
// 8. MENU NAVIGASI MOBILE (HAMBURGER TOGGLE) & ACTIVE STATE
// ------------------------------------------------------------------------------
mobileToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

// Menutup menu mobile saat link diklik
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navLinks.forEach(item => item.classList.remove("active"));
    link.classList.add("active");
  });
});

// Highlight menu saat scrolling
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section");
  const scrollPosition = window.pageYOffset + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
});

// ------------------------------------------------------------------------------
// 9. INISIALISASI HALAMAN SAAT DIMUAT
// ------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  updateCartUI();
});
