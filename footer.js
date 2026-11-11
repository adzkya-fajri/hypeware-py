// File: footer.js

function loadFooter() {
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
    </footer>
    `;

    // Mencari elemen dengan ID 'footer-placeholder' dan mengisinya
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.innerHTML = footerHTML;
    }
}

// Jalankan fungsi saat halaman dimuat
loadFooter();