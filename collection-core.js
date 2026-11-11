/**
 * collection-core.js
 * Modul ESM — berisi semua logic untuk halaman koleksi dan footer.
 * Di-import via <script type="module"> agar Vite bisa bundle.
 */

// ===== CART HELPERS =====
function loadCart() {
  try {
    const saved = localStorage.getItem('hypeware_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) { return []; }
}
function saveCart(items) {
  localStorage.setItem('hypeware_cart', JSON.stringify(items));
}
function getCartCount() {
  return loadCart().reduce((t, i) => t + (i.quantity || 1), 0);
}
export function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}
function addToCart(product) {
  const items = loadCart();
  const existing = items.find(i => i.productId === product.id && i.size === 'M');
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    items.push({
      id: Date.now() + Math.random(),
      productId: product.id,
      nama: product.nama,
      harga: product.harga,
      priceNumeric: product.priceNumeric,
      img: product.img,
      quantity: 1,
      size: 'M',
      gender: product.gender || '',
      category: product.category,
    });
  }
  saveCart(items);
  updateCartBadge();
  showToast(`✓ ${product.nama} ditambahkan ke keranjang!`);
}

function showToast(message) {
  let toast = document.getElementById('hw-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'hw-toast';
    toast.style.cssText =
      'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);' +
      'background:#111;color:#fff;padding:12px 24px;border-radius:4px;font-size:13px;' +
      'z-index:9999;transition:transform .3s ease,opacity .3s ease;opacity:0;max-width:90vw;text-align:center;';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
    toast.style.opacity = '0';
  }, 2500);
}

function getCategoryLabel(cat) {
  const labels = { bjp: 'Kaos', bj: 'Baju', km: 'Kemeja', cl: 'Celana', op: 'Outerwear', dr: 'Dress', ro: 'Rok', lo: 'Limited' };
  return labels[cat] || cat;
}

// ===== RENDER =====
function renderProducts(products, limit) {
  const container = document.getElementById('product-container');
  const loadMoreContainer = document.getElementById('load-more-container');
  const noMoreMsg = document.getElementById('no-more-products');
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = '<p class="col-span-full text-center py-20 text-gray-400 uppercase tracking-widest text-sm">Produk tidak tersedia di kategori ini.</p>';
    if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
    if (noMoreMsg) noMoreMsg.classList.add('hidden');
    return;
  }

  const visible = products.slice(0, limit);
  container.innerHTML = visible.map(item => `
    <div class="group cursor-pointer" onclick="window._hw.viewProduct('${item.id}')">
      <div class="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-900 mb-4">
        <img
          src="${item.img}"
          alt="${item.nama}"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/400x533/f5f5f5/999999?text=Produk'"
        />
        <button
          onclick="event.stopPropagation(); window._hw.addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})"
          class="absolute bottom-4 right-4 bg-white/90 dark:bg-black/90 p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-primary hover:text-white transition-colors"
          title="Tambah ke keranjang"
        >
          <span class="material-icons-outlined text-xl">shopping_cart</span>
        </button>
      </div>
      <div>
        <p class="text-[11px] text-slate-500 mb-1 uppercase tracking-tighter">${item.gender || ''} | ${getCategoryLabel(item.category)}</p>
        <h3 class="text-sm font-medium mb-2 group-hover:text-primary transition-colors line-clamp-2">${item.nama}</h3>
        <p class="font-bold">${item.harga}</p>
      </div>
    </div>
  `).join('');

  if (products.length > limit) {
    if (loadMoreContainer) loadMoreContainer.classList.remove('hidden');
    if (noMoreMsg) noMoreMsg.classList.add('hidden');
  } else {
    if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
    if (noMoreMsg && products.length > 0) noMoreMsg.classList.remove('hidden');
    else if (noMoreMsg) noMoreMsg.classList.add('hidden');
  }
}

// ===== MAIN INIT =====
export function initCollection(options) {
  const gender = options.gender;
  const sourceData = options.data;

  let allProducts = sourceData.map(item => ({ ...item, gender }));
  let activeFilter = 'all';
  let itemsLimit = 8;
  let filteredData = [];

  function runFilterAndSort() {
    filteredData = activeFilter === 'all'
      ? [...allProducts]
      : allProducts.filter(p => p.category === activeFilter);

    const sortEl = document.getElementById('sortOption');
    const sortType = sortEl ? sortEl.value : 'newest';
    if (sortType === 'low') filteredData.sort((a, b) => a.priceNumeric - b.priceNumeric);
    else if (sortType === 'high') filteredData.sort((a, b) => b.priceNumeric - a.priceNumeric);

    renderProducts(filteredData, itemsLimit);
  }

  window._hw = window._hw || {};
  window._hw.addToCart = addToCart;
  window._hw.viewProduct = function (id) {
    localStorage.setItem('selectedProductId', id);
    window.location.href = 'desc.item.html';
  };

  window.filterAction = function (cat) {
    activeFilter = cat;
    itemsLimit = 8;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active', 'border-b-2', 'border-black', 'dark:border-white', 'font-bold');
      btn.classList.add('text-gray-400');
    });
    const btn = document.querySelector(`[data-filter="${cat}"]`);
    if (btn) {
      btn.classList.add('active', 'border-b-2', 'border-black', 'dark:border-white', 'font-bold');
      btn.classList.remove('text-gray-400');
    }
    runFilterAndSort();
  };

  window.runFilterAndSort = runFilterAndSort;

  window.loadMoreAction = function () {
    itemsLimit += 8;
    renderProducts(filteredData, itemsLimit);
  };

  // Handle URL param ?cat=xxx
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    activeFilter = catParam;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active', 'border-b-2', 'border-black', 'dark:border-white', 'font-bold');
      btn.classList.add('text-gray-400');
    });
    const btn = document.querySelector(`[data-filter="${catParam}"]`);
    if (btn) {
      btn.classList.add('active', 'border-b-2', 'border-black', 'dark:border-white', 'font-bold');
      btn.classList.remove('text-gray-400');
    }
  }

  runFilterAndSort();
  updateCartBadge();
}

// ===== FOOTER =====
export function loadFooter() {
  const footerHTML = `
  <footer class="bg-gray-100 dark:bg-gray-950 mt-24 py-16 border-t border-gray-200 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        <div class="col-span-2 lg:col-span-1">
          <div class="w-12 h-12 bg-[#EE0000] flex flex-col items-center justify-center text-white font-bold leading-tight mb-6 p-1">
            <span class="text-[14px]">HW</span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">Pakaian sehari-hari yang sederhana dan berkualitas tinggi dengan detail praktis.</p>
        </div>
        <div>
          <h4 class="font-bold text-sm mb-6 uppercase">Tentang Kami</h4>
          <ul class="space-y-4 text-xs text-gray-600 dark:text-gray-400">
            <li><a class="hover:underline" href="#">Informasi Perusahaan</a></li>
            <li><a class="hover:underline" href="#">Toko HypeWare</a></li>
            <li><a class="hover:underline" href="#">Keberlanjutan</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-sm mb-6 uppercase">Bantuan</h4>
          <ul class="space-y-4 text-xs text-gray-600 dark:text-gray-400">
            <li><a class="hover:underline" href="#">FAQ</a></li>
            <li><a class="hover:underline" href="#">Kebijakan Pengembalian</a></li>
            <li><a class="hover:underline" href="#">Hubungi Kami</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-sm mb-6 uppercase">Langganan</h4>
          <p class="text-xs text-gray-600 dark:text-gray-400 mb-4">Dapatkan info produk terbaru.</p>
          <div class="flex">
            <input class="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs w-full focus:ring-0" placeholder="Email Anda" type="email" />
            <button class="bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-bold uppercase">Daftar</button>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200 dark:border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-[10px] text-gray-500 uppercase tracking-widest">Copyright © 2026 HypeWare. All rights reserved.</p>
      </div>
    </div>
  </footer>`;

  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) placeholder.innerHTML = footerHTML;
}
