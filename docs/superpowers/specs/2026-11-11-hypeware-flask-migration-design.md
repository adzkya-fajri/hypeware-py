# Design Document: Migrasi Hypeware ke Python Flask (100% Identical UI/UX)

**Tanggal:** 2026-11-11  
**Status:** Menunggu Persetujuan (Pending Approval)  
**Target:** Migrasi project e-commerce web `hypeware` ke stack Python (Flask + Jinja2) dengan tampilan visual (UI) dan alur interaksi (UX) yang 100% sama persis.

---

## 1. Intent & The Why

Project `hypeware` saat ini merupakan web toko online pakaian multi-page yang dibangun menggunakan file HTML statis, Tailwind CSS (via CDN & configuration script), script data produk JavaScript (`colectiondata/`), dan bundler Vite untuk studio kustomisasi pakaian.

Pengguna menginginkan agar project ini dialihfungsikan menggunakan bahasa **Python** dengan framework **Flask**, sebagai aplikasi web (bukan desktop atau mobile app), dan dengan **syarat mutlak: UX dan UI harus sama persis**.

Tujuan migrasi ini adalah:
1. Menjadikan Python sebagai pengendali utama arsitektur aplikasi (routing, manajemen data katalog, pencarian, templating, dan penyajian halaman).
2. Menghilangkan ketergantungan pada data produk statis di JavaScript client-side dan memindahkannya ke modul Python yang terstruktur.
3. Menjaga fidelitas visual 100% dengan mempertahankan seluruh kelas Tailwind CSS, layout responsive, mega menu interaktif, font typography, dan aset grafis yang sudah ada.

---

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
- **Full Python Flask Web App:** Seluruh routing halaman web dilayani oleh Flask (`app.py`) dan template engine Jinja2.
- **100% Identitas UI & UX:** Seluruh elemen visual (navbar mega menu, dark mode toggle, grid produk, banner hero, slider koleksi, kartu produk, halaman detail produk, keranjang belanja, pencarian, dan profil pelanggan) memiliki tampilan dan perilaku yang identik dengan versi aslinya.
- **Python Product Repository:** Seluruh data produk (`dataPria`, `dataWanita`, `dataAnak`, `dataBayi`) dikonversi murni menjadi struktur data Python (`data/products.py`) dengan fungsi pencarian, filter kategori, dan pencarian berdasarkan ID.
- **Server-Side Rendering (SSR) yang Cepat:** Halaman detail produk dan koleksi di-render langsung dari server dengan data produk yang valid, menghindari layout shift atau placeholder kosong saat loading di browser.
- **Kemudahan Menjalankan:** Aplikasi dapat dijalankan dengan perintah standar Python: `python app.py` pada port 5000.

### Non-Goals
- Tidak mengubah web ini menjadi aplikasi desktop (GUI seperti PyQt/Tkinter) ataupun aplikasi mobile (Kivy/BeeWare). Pengguna secara eksplisit meminta output berupa aplikasi web.
- Tidak mengganti sistem CSS ke framework lain (tetap mempertahankan Tailwind CSS dan konfigurasi warna primer `#EE0000` / `#FF0000`).
- Tidak mengintegrasikan payment gateway riil (pembayaran tetap berupa simulasi/flow checkout yang sudah ada).

### Anti-Goals
- Merusak atau mengubah tata letak antarmuka yang sudah ada.
- Menghapus fungsionalitas interaktif seperti mega-menu hover, keranjang belanja di browser, atau dark/light mode toggle.
- Memaksa penggunaan library UI Python yang mengorbankan desain HTML kustom (seperti Streamlit/Gradio).

---

## 3. Constraints

- **Web Browser Standard:** Browser hanya mengeksekusi HTML, CSS, dan JavaScript di sisi client. Oleh karena itu, Python bertindak sebagai server-side web engine yang memproduksi dan mengontrol HTML via Jinja2 templates, serta menyajikan aset statis.
- **Python Version:** Menggunakan Python 3.x (lingkungan saat ini Python 3.14).
- **Dependencies:** Minimal dan andal, berpusat pada `Flask`.

---

## 4. Evaluasi Pendekatan (Approaches Considered)

Tiga pendekatan arsitektur telah dipertimbangkan:

1. **Pendekatan 1: Flask Full Server-Side Rendered (Jinja2 + Python Data Models) — *DIPILIH***
   - *Mekanisme:* Data produk dipindahkan ke Python (`products.py`). Halaman HTML diubah menjadi template Jinja2 di folder `templates/`. Route Flask menangani URL (`/`, `/collection/<gender>`, `/product/<id>`, `/cart`, `/search`, `/profile`, `/studio`). Aset visual dan client-side scripts disimpan di `static/`.
   - *Trade-off:* Memerlukan pemisahan markup HTML statis menjadi template Jinja2 dan penyesuaian path static, namun memberikan arsitektur web Python paling bersih, handal, dan menjaga UI 100% presisi.
   - *Keputusan:* Dipilih oleh pengguna.

2. **Pendekatan 2: Flask REST API + Static Frontend AJAX**
   - *Mekanisme:* Flask hanya menyediakan endpoint JSON (`/api/products`), sementara frontend tetap berupa file HTML statis yang memanggil `fetch()`.
   - *Trade-off:* Logika aplikasi masih terbelah dua antara JS browser dan Python. Tidak memenuhi esensi "dialihfungsikan menggunakan Python secara penuh".
   - *Keputusan:* Ditolak.

3. **Pendekatan 3: Full-Python Web Framework (Reflex / NiceGUI)**
   - *Mekanisme:* Menulis seluruh UI dalam sintaks komponen Python.
   - *Trade-off:* Komponen bawaan Reflex/NiceGUI akan merombak total tampilan asli Hypeware, membuat kesamaan visual 100% hampir mustahil dipertahankan.
   - *Keputusan:* Ditolak.

---

## 5. Arsitektur & Spesifikasi Teknis

### 5.1 Struktur Direktori Proyek

```
webpy/
├── app.py                      # Aplikasi utama Flask (routing & controllers)
├── requirements.txt            # Dependensi: Flask
├── data/
│   ├── __init__.py
│   └── products.py             # Repositori data produk dalam bentuk list/dict Python
├── static/
│   ├── asset/                  # Asset gambar asli (anak/, cewek/, cowok/)
│   ├── js/
│   │   ├── nav.js              # Interaksi mega-menu, dark mode, mobile drawer
│   │   ├── cart.js             # Logic localStorage cart badge & toast
│   │   └── studio/             # Aset kustomisasi baju (bundle studio)
│   └── favicon.ico
└── templates/
    ├── base.html               # Layout induk (Head, Tailwind config, Navbar, Mega-Menu, Footer)
    ├── index.html              # Halaman beranda
    ├── collection.html         # Halaman katalog koleksi dinamis (pria, wanita, anak, bayi)
    ├── product_detail.html     # Halaman detail produk (menggantikan desc.item.html)
    ├── cart.html               # Halaman keranjang belanja (menggantikan keranjang.html)
    ├── search.html             # Halaman hasil pencarian (menggantikan search fitur.html)
    ├── profile.html            # Halaman profil customer (menggantikan customer profile.html)
    └── studio.html             # Halaman studio kustomisasi baju
```

### 5.2 Rute Aplikasi (Flask Routes)

| Metode | URL | View Handler | Deskripsi |
|---|---|---|---|
| `GET` | `/` | `index()` | Menampilkan landing page dengan produk pilihan, banner, dan kategori |
| `GET` | `/collection/<gender>` | `collection(gender)` | Menampilkan katalog produk berdasarkan gender (`pria`, `wanita`, `anak`, `bayi`) dengan filter kategori |
| `GET` | `/product/<product_id>` | `product_detail(product_id)` | Menampilkan detail spesifik produk berdasarkan ID produk |
| `GET` | `/cart` | `cart()` | Menampilkan halaman keranjang belanja |
| `GET` | `/search` | `search()` | Menampilkan hasil pencarian berdasarkan query parameter `q` |
| `GET` | `/profile` | `profile()` | Menampilkan halaman profil customer |
| `GET` | `/studio` | `studio()` | Menampilkan studio kustomisasi pakaian |
| `GET` | `/api/products` | `api_products()` | Endpoint JSON pembantu untuk integrasi client jika diperlukan |

### 5.3 Model Data Produk (`data/products.py`)

Setiap produk merepresentasikan atribut:
- `id`: identifier unik (string, misal: `"estar"`, `"polos"`)
- `nama`: nama produk
- `category`: kode kategori (misal: `"bjp"` untuk baju pria, `"km"` untuk kemeja, dst.)
- `category_name`: nama kategori manusiawi (misal: `"Kaos & T-Shirt"`, `"Kemeja"`)
- `gender`: `"pria"`, `"wanita"`, `"anak"`, `"bayi"`
- `deskripsi`: deskripsi lengkap produk
- `harga`: format rupiah teks (`"Rp19.000"`)
- `price_numeric`: nilai integer harga (`19000`)
- `img`: URL gambar produk

Fungsi helper di Python:
- `get_all_products()`
- `get_product_by_id(product_id)`
- `get_products_by_gender(gender)`
- `get_products_by_category(gender, category)`
- `search_products(query)`

### 5.4 Penanganan Frontend & Template Jinja2

- **Templating & Struktur Base:**
  - Menggunakan `base.html` sebagai kerangka utama untuk seluruh halaman (termasuk profile dan search) yang memuat konfigurasi Tailwind CSS, Font Inter & Oswald, Material Icons, Navbar interaktif dengan mega-menu, dan Footer terpadu.
  - Halaman `profile.html` dan `search.html` yang sebelumnya menggunakan template terpisah ("Stitch Design") dengan tautan mati diselaraskan ke dalam `base.html` agar header, footer, navigasi, dan dark mode berfungsi konsisten di seluruh web.
- **Model Interaksi Koleksi (Hybrid SSR + Snappy Client Filter):**
  - Halaman `/collection/<gender>` me-render seluruh produk kategori terkait secara SSR via Jinja2 pada pemuatan awal.
  - Untuk menjaga UX instan asli (tanpa reload layar/scroll jumping saat berganti tab filter kategori seperti Kaos, Kemeja, Celana), filtering kategori dan sorting harga ditangani secara mulus di sisi browser oleh client script yang membaca data produk yang telah di-render.
- **Halaman Pencarian Fungsional:**
  - Route `/search?q=...` menjalankan fungsi Python `search_products(query)`.
  - Halaman `search.html` menyajikan input pencarian interaktif dan menampilkan grid kartu produk yang cocok (menggunakan komponen kartu produk standar Hypeware) beserta status jumlah hasil temuan.
- **Preservasi UI/UX:**
  - Kode HTML dari file asli dipertahankan secara utuh pada tingkat elemen dan styling kelas Tailwind.
  - Tautan navigasi disesuaikan menggunakan `{{ url_for('...') }}`.
  - Fitur interaktif seperti Cart Badge, Toast Notification, Dark Mode, dan Mega Menu tetap berjalan mulus menggunakan JavaScript modular yang terhubung dengan route Flask.

---

## 6. Pembagian Keputusan: Telah Diputuskan vs Keputusan Builder

### Yang Telah Diputuskan Bersama Pengguna:
1. Framework utama yang digunakan adalah **Python Flask**.
2. Output adalah **aplikasi web** (bukan aplikasi desktop/mobile).
3. Pendekatan arsitektur adalah **Server-Side Rendered dengan Jinja2 Templates**, di mana logika data dan routing berada di Python.
4. Tampilan visual (UI) dan alur navigasi (UX) **100% sama persis** dengan project Hypeware saat ini.

### Keputusan Builder (Technical Calls):
1. **Model Interaktivitas Filter (Hybrid SSR + Instant Filter):** Jinja2 merender produk awal dari Python server, dan filter tab kategori (Kaos, Kemeja, Celana, dll.) mengeksekusi filter instan di browser agar UX tetap responsif tanpa reload halaman.
2. **Penyempurnaan Halaman Pencarian:** Menghubungkan input pencarian di navbar dan halaman `/search` dengan fungsi Python `search_products(q)` sehingga menghasilkan grid kartu produk nyata, bukan sekadar mockup statis.
3. **Penyatuan Header & Navigasi Halaman Profil:** Menyelaraskan halaman profil ke dalam `base.html` agar tombol navigasi (kembali ke beranda, cart, dark mode) berfungsi normal dan tidak ada tautan rusak.
4. **Penyimpanan Keranjang Belanja:** Menggunakan `localStorage` yang terhubung dengan badge navbar dan halaman keranjang, sehingga pengguna dapat menambah/mengurangi barang belanjaan secara persisten tanpa perlu database akun yang rumit.
