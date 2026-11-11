// static/js/nav.js
// Mega Menu & Navigation Interactions for Hypeware

const menuData = {
  pria: {
    title: "Koleksi Pria",
    url: "/collection/pria",
    items: [
      { name: "Kaos Streetwear", url: "/collection/pria" },
      { name: "Kemeja Casual", url: "/collection/pria" },
      { name: "Celana Panjang", url: "/collection/pria" },
      { name: "Outerwear & Jaket", url: "/collection/pria" },
      { name: "Jas & Blazer", url: "/collection/pria" },
      { name: "Aksesoris", url: "/collection/pria" }
    ],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071",
    promo: "NEW SUIT & STREETWEAR"
  },
  wanita: {
    title: "Koleksi Wanita",
    url: "/collection/wanita",
    items: [
      { name: "Kaos & Atasan", url: "/collection/wanita" },
      { name: "Dress Elegan", url: "/collection/wanita" },
      { name: "Rok & Skirts", url: "/collection/wanita" },
      { name: "Celana Modis", url: "/collection/wanita" },
      { name: "Outerwear", url: "/collection/wanita" },
      { name: "Tas & Aksesoris", url: "/collection/wanita" }
    ],
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
    promo: "SUMMER VIBES 2026"
  },
  anak: {
    title: "Koleksi Anak & Bayi",
    url: "/collection/anak",
    items: [
      { name: "Kaos Grafis Anak", url: "/collection/anak" },
      { name: "Kemeja Mini", url: "/collection/anak" },
      { name: "Celana Bermain", url: "/collection/anak" },
      { name: "Jaket Anak", url: "/collection/anak" },
      { name: "Pakaian Bayi", url: "/collection/bayi" },
      { name: "Romper Bayi", url: "/collection/bayi" }
    ],
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=2070",
    promo: "KIDS SPECIAL RELEASE"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const megaMenu = document.getElementById("mega-menu");
  const menuContent = document.getElementById("mega-menu-content") || document.getElementById("menu-content");
  const navItems = document.querySelectorAll(".nav-item");
  const overlay = document.getElementById("overlay");
  const themeToggle = document.getElementById("theme-toggle");
  const header = document.querySelector("header");

  let hoverTimeout;
  let currentType = null;

  function updateMenuContent(type) {
    if (!menuData[type] || !menuContent) return;
    const data = menuData[type];
    menuContent.innerHTML = `
      <div class="col-span-1">
        <h4 class="font-display text-xl mb-6 text-primary uppercase">${data.title}</h4>
        <ul class="space-y-4">
          <li class="font-bold border-b border-stone-100 dark:border-stone-800 pb-2">Terpopuler</li>
          <li class="text-stone-500 hover:text-black dark:hover:text-white cursor-pointer transition">
            <a href="${data.url}">Rilisan Terbaru</a>
          </li>
          <li class="text-stone-500 hover:text-black dark:hover:text-white cursor-pointer transition">
            <a href="${data.url}">Diskon Musim Ini</a>
          </li>
        </ul>
      </div>
      <div class="col-span-1">
        <h4 class="font-display text-xl mb-6 uppercase">Kategori</h4>
        <ul class="space-y-3 text-stone-600 dark:text-stone-300">
          ${data.items.map(item => `<li><a href="${item.url}" class="hover:text-primary transition">${item.name}</a></li>`).join("")}
        </ul>
      </div>
      <div class="col-span-2 relative group overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img src="${data.image}" alt="${data.title}" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
          <h3 class="text-white text-3xl font-display font-bold leading-none mb-2">${data.promo}</h3>
          <p class="text-white/80 text-sm uppercase tracking-widest mb-4">Mulai dari Rp15.000</p>
          <a href="${data.url}" class="bg-white text-black px-6 py-2 text-xs font-bold w-fit hover:bg-primary hover:text-white transition inline-block">
            LIHAT SEMUA
          </a>
        </div>
      </div>
    `;
  }

  function showMenu(type) {
    if (!megaMenu || !overlay) return;
    if (hoverTimeout) clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      if (type !== currentType) {
        currentType = type;
        megaMenu.classList.add("active");
        overlay.classList.add("opacity-100", "pointer-events-auto");
        updateMenuContent(type);
      }
    }, 50);
  }

  function hideMenu() {
    if (!megaMenu || !overlay) return;
    if (hoverTimeout) clearTimeout(hoverTimeout);
    currentType = null;
    megaMenu.classList.remove("active");
    overlay.classList.remove("opacity-100", "pointer-events-auto");
  }

  navItems.forEach(item => {
    item.addEventListener("mouseenter", () => {
      const type = item.getAttribute("data-type");
      if (type) showMenu(type);
    });
  });

  if (header) {
    header.addEventListener("mouseleave", hideMenu);
  }
  if (overlay) {
    overlay.addEventListener("click", hideMenu);
  }

  // Dark mode toggle & persistent state
  const isDark = localStorage.getItem("hypeware_theme") === "dark";
  if (isDark) {
    document.documentElement.classList.add("dark");
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      const currentDark = document.documentElement.classList.contains("dark");
      localStorage.setItem("hypeware_theme", currentDark ? "dark" : "light");
    });
  }
});
