const menuData = {
  pria: {
    title: "Koleksi Pria",
    items: ["Celana Panjang", "Jas & Blazer", "Kaos Streetwear", "Sepatu Sneaker", "Jaket Bomber", "Aksesoris"],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071",
    promo: "NEW SUIT COLLECTION"
  },
  wanita: {
    title: "Koleksi Wanita",
    items: ["Rok & Skirts", "Busana Muslim", "Dress Malam", "Tas Mewah", "Flat Shoes", "Blouse"],
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070",
    promo: "SUMMER VIBES 2024"
  },
  anak: {
    title: "Koleksi Anak",
    items: ["Pakaian Bayi", "Sepatu Sekolah", "Setelan Bermain", "Topi Lucu", "Jaket Mini", "Mainan"],
    image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=2070",
    promo: "BACK TO SCHOOL"
  }
};

const megaMenu = document.getElementById('mega-menu');
const menuContent = document.getElementById('menu-content');
const navItems = document.querySelectorAll('.nav-item');
const overlay = document.getElementById('overlay');
const themeToggle = document.getElementById("theme-toggle");

// Debounce variables to prevent stuck rapid hovers
let hoverTimeout;
let currentType = null;

// Fungsi update konten menu (smooth render)
function updateMenuContent(type) {
  if (!menuData[type]) return;
  
  const data = menuData[type];
  menuContent.innerHTML = `
    <div class="col-span-1">
      <h4 class="font-display text-xl mb-6 text-primary uppercase">${data.title}</h4>
      <ul class="space-y-4">
        <li class="font-bold border-b border-stone-100 pb-2">Terpopuler</li>
        <li class="text-stone-500 hover:text-black dark:hover:text-white cursor-pointer transition">Rilisan Terbaru</li>
        <li class="text-stone-500 hover:text-black dark:hover:text-white cursor-pointer transition">Diskon Musim Ini</li>
      </ul>
    </div>
    <div class="col-span-1">
      <h4 class="font-display text-xl mb-6 uppercase">Kategori</h4>
      <ul class="space-y-3 text-stone-600 dark:text-stone-300">
        ${data.items.map(item => `<li><a href="#" class="hover:text-primary transition">${item}</a></li>`).join('')}
      </ul>
    </div>
    <div class="col-span-2 relative group overflow-hidden bg-stone-100 dark:bg-stone-800">
      <img src="${data.image}" class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700">
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
        <h3 class="text-white text-3xl font-display font-bold leading-none mb-2">${data.promo}</h3>
        <p class="text-white/80 text-sm uppercase tracking-widest mb-4">Mulai dari Rp 199.000</p>
        <button class="bg-white text-black px-6 py-2 text-xs font-bold w-fit hover:bg-primary hover:text-white transition">BELANJA SEKARANG</button>
      </div>
    </div>
  `;
}

// Show menu with debounce
const showMenu = (type) => {
  if (hoverTimeout) clearTimeout(hoverTimeout);
  
  hoverTimeout = setTimeout(() => {
    if (type !== currentType) {
      currentType = type;
      megaMenu.classList.add('active');
      overlay.classList.add('opacity-100', 'pointer-events-auto');
      document.body.classList.add('overflow-hidden');
      updateMenuContent(type);
    }
  }, 50); // Short delay for smooth hover
};

// Hide menu
const hideMenu = () => {
  if (hoverTimeout) clearTimeout(hoverTimeout);
  currentType = null;
  megaMenu.classList.remove('active');
  overlay.classList.remove('opacity-100', 'pointer-events-auto');
  document.body.classList.remove('overflow-hidden');
};

// Single event listeners (no duplicates)
navItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    const type = item.getAttribute('data-type');
    showMenu(type);
  });
});

// Header mouseleave closes menu
document.querySelector('header').addEventListener('mouseleave', hideMenu);

// Theme toggle
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });
}

