// static/js/cart.js
// Shopping Cart & Toast Notification System for Hypeware

const CART_STORAGE_KEY = "hypeware_cart";

export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Gagal membaca cart dari localStorage:", e);
    return [];
  }
}

export function saveCart(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Gagal menyimpan cart ke localStorage:", e);
  }
}

export function getCartCount() {
  const items = loadCart();
  return items.reduce((total, item) => total + (item.quantity || 1), 0);
}

export function updateCartBadge() {
  const count = getCartCount();
  const badges = document.querySelectorAll(".cart-badge");
  badges.forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove("hidden");
      badge.style.display = "flex";
    } else {
      badge.classList.add("hidden");
      badge.style.display = "none";
    }
  });
}

export function showToast(message) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = "bg-black text-white dark:bg-white dark:text-black px-5 py-3 rounded-none shadow-2xl text-xs uppercase tracking-wider font-bold flex items-center gap-3 transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto border-l-4 border-primary";
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-4", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-4", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

export function addToCart(product, size = "M", quantity = 1) {
  const items = loadCart();
  const existing = items.find(i => i.productId === product.id && i.size === size);

  if (existing) {
    existing.quantity = (existing.quantity || 1) + quantity;
  } else {
    items.push({
      id: Date.now() + Math.random().toString(36).substring(2, 7),
      productId: product.id,
      nama: product.nama,
      harga: product.harga,
      priceNumeric: product.priceNumeric,
      img: product.img,
      size: size,
      quantity: quantity,
      category: product.category,
      gender: product.gender
    });
  }

  saveCart(items);
  updateCartBadge();
  showToast(`✓ ${product.nama} (${size}) ditambahkan ke keranjang!`);
}

export function removeFromCart(itemId) {
  const items = loadCart().filter(i => i.id !== itemId);
  saveCart(items);
  updateCartBadge();
}

export function updateQuantity(itemId, delta) {
  const items = loadCart();
  const item = items.find(i => i.id === itemId);
  if (!item) return;

  item.quantity = (item.quantity || 1) + delta;
  if (item.quantity <= 0) {
    return removeFromCart(itemId);
  }

  saveCart(items);
  updateCartBadge();
}

// Make globally accessible for inline onclick handlers if needed
window.HypewareCart = {
  loadCart,
  saveCart,
  getCartCount,
  updateCartBadge,
  showToast,
  addToCart,
  removeFromCart,
  updateQuantity
};

// Initialize badges on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});
