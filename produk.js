// ===== IMPORT DATA DARI SEMUA KOLEKSI =====
import { dataPria, dataWanita, dataAnak, dataBayi } from './colectiondata/all-products.js';

// ===== GABUNGKAN SEMUA DATA PRODUK =====
const allProducts = [
  ...dataPria.map(item => ({ ...item, gender: 'pria' })),
  ...dataWanita.map(item => ({ ...item, gender: 'wanita' })),
  ...dataAnak.map(item => ({ ...item, gender: 'anak' })),
  ...dataBayi.map(item => ({ ...item, gender: 'bayi' })),
];

// ===== FUNGSI UTILITAS =====
// Fungsi untuk mendapatkan produk berdasarkan ID
function getProductById(productId) {
  return allProducts.find(product => product.id === productId);
}

// Fungsi untuk mendapatkan produk berdasarkan kategori
function getProductsByCategory(category) {
  return allProducts.filter(product => product.category === category);
}

// Fungsi untuk mendapatkan produk berdasarkan gender
function getProductsByGender(gender) {
  return allProducts.filter(product => product.gender === gender);
}

// Fungsi untuk search produk
function searchProducts(query) {
  const searchTerm = query.toLowerCase();
  return allProducts.filter(product => 
    product.nama.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
}

// ===== SISTEM KERANJANG BELANJA =====
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
  }

  // Load cart dari localStorage
  loadCart() {
    const saved = localStorage.getItem('hypeware_cart');
    return saved ? JSON.parse(saved) : [];
  }

  // Save cart ke localStorage
  saveCart() {
    localStorage.setItem('hypeware_cart', JSON.stringify(this.items));
  }

  // Tambah item ke keranjang
  addItem(productId, quantity = 1, size = 'M', color = 'default') {
    const product = getProductById(productId);
    if (!product) {
      console.error('Produk tidak ditemukan:', productId);
      return false;
    }

    const existingItem = this.items.find(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: Date.now() + Math.random(), // Unique ID untuk cart item
        productId,
        nama: product.nama,
        harga: product.harga,
        priceNumeric: product.priceNumeric,
        img: product.img,
        quantity,
        size,
        color,
        gender: product.gender,
        category: product.category
      });
    }

    this.saveCart();
    this.updateCartUI();
    return true;
  }

  // Hapus item dari keranjang
  removeItem(cartItemId) {
    console.log('=== CART REMOVE ITEM ===');
    console.log('Looking for item to remove with ID:', cartItemId);
    console.log('Current items before remove:', this.items);
    
    const initialLength = this.items.length;
    this.items = this.items.filter(item => {
      const keep = item.id != cartItemId;
      if (!keep) {
        console.log('Removing item:', item);
      }
      return keep;
    });
    
    console.log('Items after filter:', this.items);
    console.log('Removed', initialLength - this.items.length, 'items');
    
    this.saveCart();
    this.updateCartUI();
    console.log('=== END CART REMOVE ITEM ===');
  }

  // Update quantity item
  updateQuantity(cartItemId, newQuantity) {
    console.log('=== CART UPDATE QUANTITY ===');
    console.log('Looking for item with ID:', cartItemId);
    console.log('New quantity:', newQuantity);
    console.log('Current items:', this.items);
    
    const item = this.items.find(item => {
      console.log('Comparing:', item.id, 'with', cartItemId, 'Match:', item.id == cartItemId);
      return item.id == cartItemId;
    });
    
    if (item) {
      console.log('Found item to update:', item);
      if (newQuantity <= 0) {
        console.log('Quantity <= 0, removing item');
        this.removeItem(cartItemId);
      } else {
        console.log('Updating quantity from', item.quantity, 'to', newQuantity);
        item.quantity = newQuantity;
        this.saveCart();
        this.updateCartUI();
      }
    } else {
      console.log('Item not found with ID:', cartItemId);
    }
    console.log('=== END CART UPDATE QUANTITY ===');
  }

  // Hitung total harga
  getTotal() {
    return this.items.reduce((total, item) => total + (item.priceNumeric * item.quantity), 0);
  }

  // Hitung total item
  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Clear cart
  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartUI();
  }

  // Update UI keranjang (badge, dll)
  updateCartUI() {
    const cartBadge = document.querySelector('.cart-badge');
    const totalItems = this.getTotalItems();
    
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }

    // Update cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.classList.toggle('has-items', totalItems > 0);
    }
  }
}

// ===== SISTEM PEMESANAN =====
class OrderSystem {
  constructor(cart) {
    this.cart = cart;
  }

  // Generate detail pesanan untuk WhatsApp
  generateOrderDetails() {
    if (this.cart.items.length === 0) {
      return null;
    }

    const items = this.cart.items.map((item, index) => {
      return `${index + 1}. ${item.nama}
   - Ukuran: ${item.size}
   - Warna: ${item.color}
   - Jumlah: ${item.quantity}
   - Harga: ${item.harga} x ${item.quantity} = Rp${(item.priceNumeric * item.quantity).toLocaleString('id-ID')}`;
    }).join('\n\n');

    const total = this.cart.getTotal();
    const totalItems = this.cart.getTotalItems();

    return {
      items,
      total,
      totalItems,
      message: `🛍️ *PESANAN HYPEWARE*\n\n` +
               `📦 *Detail Pesanan:*\n${items}\n\n` +
               `📊 *Ringkasan:*\n` +
               `Total Item: ${totalItems} pcs\n` +
               `Total Harga: Rp${total.toLocaleString('id-ID')}\n\n` +
               `📞 Mohon konfirmasi ketersediaan dan detail pengiriman.\n\n` +
               `Terima kasih! 🙏`
    };
  }

  // Kirim pesanan via WhatsApp
  sendOrderToWhatsApp() {
    const orderDetails = this.generateOrderDetails();
    if (!orderDetails) {
      alert('Keranjang belanja kosong!');
      return;
    }

    const waNumber = '6281393615568'; // Ganti dengan nomor WA toko
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(orderDetails.message)}`;
    
    // Buka WhatsApp
    window.open(waUrl, '_blank');
  }

  // Checkout dengan form data customer
  checkout(customerData) {
    const orderDetails = this.generateOrderDetails();
    if (!orderDetails) {
      alert('Keranjang belanja kosong!');
      return;
    }

    const customerInfo = `👤 *Data Customer:*\n` +
                        `Nama: ${customerData.nama}\n` +
                        `No. HP: ${customerData.phone}\n` +
                        `Alamat: ${customerData.alamat}\n` +
                        `Kota: ${customerData.kota}\n` +
                        `Kode Pos: ${customerData.kodePos}\n\n`;

    const fullMessage = customerInfo + orderDetails.message;
    
    const waNumber = '6281393615568'; // Ganti dengan nomor WA toko
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(fullMessage)}`;
    
    // Buka WhatsApp
    window.open(waUrl, '_blank');
    
    // Clear cart setelah checkout
    this.cart.clearCart();
    
    // Redirect ke halaman sukses atau homepage
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// ===== INISIALISASI GLOBAL =====
const cart = new ShoppingCart();
const orderSystem = new OrderSystem(cart);

// ===== FUNGSI UNTUK HALAMAN PRODUK =====
// Fungsi untuk render produk di halaman koleksi
function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="group cursor-pointer animate-on-scroll" onclick="viewProduct('${product.id}')">
      <div class="relative aspect-[3/4] mb-4 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          alt="${product.nama}"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src="${product.img}"
          loading="lazy"
        />
        <button 
          class="absolute bottom-4 right-4 bg-white/90 dark:bg-black/90 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onclick="event.stopPropagation(); addToCartQuick('${product.id}')"
        >
          <span class="material-icons-outlined text-xl">shopping_cart</span>
        </button>
      </div>
      <div>
        <p class="text-[11px] text-slate-500 mb-1 uppercase tracking-tighter">${product.gender} | ${product.category}</p>
        <h3 class="text-sm font-medium mb-2 group-hover:text-primary transition-colors">${product.nama}</h3>
        <p class="font-bold">${product.harga}</p>
      </div>
    </div>
  `).join('');
}

// Fungsi untuk melihat detail produk
function viewProduct(productId) {
  // Simpan ID produk yang dipilih
  localStorage.setItem('selectedProductId', productId);
  // Redirect ke halaman detail
  window.location.href = 'desc.item.html';
}

// Fungsi untuk quick add to cart
function addToCartQuick(productId) {
  const success = cart.addItem(productId, 1, 'M', 'default');
  if (success) {
    // Show notification
    showNotification('Produk ditambahkan ke keranjang!', 'success');
  }
}

// Fungsi untuk load detail produk di halaman desc.item.html
function loadProductDetail() {
  // Coba ambil dari localStorage dulu (sistem baru)
  let productId = localStorage.getItem('selectedProductId');
  
  // Jika tidak ada, coba ambil dari URL parameter (sistem lama)
  if (!productId) {
    const urlParams = new URLSearchParams(window.location.search);
    productId = urlParams.get('id');
  }
  
  console.log('Loading product detail for ID:', productId);
  
  if (!productId) {
    console.log('No product ID found, redirecting to homepage');
    window.location.href = 'index.html';
    return;
  }

  const product = getProductById(productId);
  console.log('Found product:', product);
  
  if (!product) {
    console.log('Product not found, redirecting to homepage');
    window.location.href = 'index.html';
    return;
  }

  // Update halaman dengan data produk
  updateProductDetailPage(product);
}

// Fungsi untuk update halaman detail produk
function updateProductDetailPage(product) {
  console.log('Updating product detail page with:', product);
  
  // Update title
  document.title = `${product.nama} - Hypeware`;
  
  // Update breadcrumb
  document.querySelectorAll('.product-category').forEach(el => {
    el.textContent = product.gender.toUpperCase();
  });
  
  // Update product name
  document.querySelectorAll('.product-name').forEach(el => {
    el.textContent = product.nama;
  });

  // Update product images
  document.querySelectorAll('.product-image').forEach(img => {
    img.src = product.img;
    img.alt = product.nama;
  });

  // Update product price
  const productPrice = document.querySelector('.product-price');
  if (productPrice) productPrice.textContent = product.harga;

  // Update product description
  const productDescription = document.querySelector('.product-description');
  if (productDescription && product.deskripsi) {
    productDescription.innerHTML = `<p>${product.deskripsi}</p>`;
  }

  // Update product details
  const categoryDetail = document.querySelector('.product-category-detail');
  if (categoryDetail) {
    const categoryNames = {
      'bjp': 'Kaos',
      'km': 'Kemeja', 
      'op': 'Outerwear',
      'dr': 'Dress',
      'ro': 'Rok',
      'cl': 'Celana',
      'bj': 'Baju'
    };
    categoryDetail.textContent = categoryNames[product.category] || product.category;
  }

  const productGender = document.querySelector('.product-gender');
  if (productGender) {
    productGender.textContent = product.gender.charAt(0).toUpperCase() + product.gender.slice(1);
  }

  // Setup add to cart button
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.onclick = () => addToCartFromDetail(product.id);
  }
}

// Fungsi untuk add to cart dari halaman detail
function addToCartFromDetail(productId) {
  const sizeSelect = document.querySelector('.size-select');
  const colorSelect = document.querySelector('.color-select');
  const quantityInput = document.querySelector('.quantity-input');

  const size = sizeSelect ? sizeSelect.value : 'M';
  const color = colorSelect ? colorSelect.value : 'default';
  const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

  const success = cart.addItem(productId, quantity, size, color);
  if (success) {
    showNotification(`${quantity} item ditambahkan ke keranjang!`, 'success');
  }
}

// ===== FUNGSI UTILITAS UI =====
// Show notification
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 transform translate-x-full ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500'
  }`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// ===== EXPORT UNTUK PENGGUNAAN GLOBAL =====
window.hypewareProducts = {
  allProducts,
  getProductById,
  getProductsByCategory,
  getProductsByGender,
  searchProducts,
  cart,
  orderSystem,
  renderProducts,
  viewProduct,
  addToCartQuick,
  loadProductDetail,
  showNotification
};

// ===== INISIALISASI SAAT HALAMAN LOAD =====
document.addEventListener('DOMContentLoaded', function() {
  // Update cart UI saat halaman load
  cart.updateCartUI();

  // Jika di halaman detail produk, load detail
  if (window.location.pathname.includes('desc.item.html')) {
    loadProductDetail();
  }

  // Setup search functionality
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value;
      if (query.length > 2) {
        const results = searchProducts(query);
        displaySearchResults(results);
      }
    });
  }
});

// Fungsi untuk display search results
function displaySearchResults(results) {
  const resultsContainer = document.querySelector('.search-results');
  if (!resultsContainer) return;

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Tidak ada produk ditemukan</p>';
    return;
  }

  renderProducts(results, 'search-results');
}