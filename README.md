# HYPEWARE — Python Flask Fashion E-Commerce Web Platform

Platform web e-commerce fashion modern **HYPEWARE** yang dialihfungsikan sepenuhnya ke stack **Python (Flask + Jinja2 Templates)** dengan mempertahankan **100% kesamaan tampilan antarmuka (UI) dan alur interaktivitas pengguna (UX)**.

---

## 🚀 Fitur Utama

- **100% Python Flask Web Engine:** Seluruh perutean (routing), kontrol logika bisnis, dan perakitan halaman dijalankan oleh Python melalui server-side template engine Jinja2.
- **Katalog Produk Terpusat di Python (`data/products.py`):** Repositori data produk native Python dengan fungsi pencarian, filter kategori, dan pencarian berdasarkan ID.
- **Tampilan Visual & UX Asli (Tailwind CSS):** Menggunakan kelas CSS, palet warna primer (`#EE0000`), tipografi (Inter & Oswald), dan Material Icons yang identik tanpa deviasi desain.
- **Mega Menu Interaktif & Responsif:** Dropdown navigasi dinamis dengan pratinjau kategori produk pria, wanita, dan anak.
- **Katalog Dinamis (Hybrid SSR + Instant Filter):** Server merender data produk secara SSR, sedangkan tombol tab kategori ("Kaos", "Kemeja", "Celana", "Outerwear", dll.) dan sortir harga merespons seketika di browser tanpa reload halaman.
- **Halaman Detail Produk & Rekomendasi:** Halaman detail dengan pemilih ukuran (S, M, L, XL, XXL), jumlah pembelian, galeri produk, deskripsi, dan rekomendasi item serupa.
- **Keranjang Belanja Persisten:** Sinkronisasi `localStorage` dengan badge counter dinamis di navbar, kontrol kuantitas barang, indikator progres Gratis Ongkir (target Rp699.000), dan simulasi checkout.
- **Pencarian Produk Aktif (`/search`):** Input pencarian fungsional yang terhubung dengan fungsi `search_products(q)` di Python.
- **Hypeware Design Studio (`/studio`):** Studio kustomisasi baju interaktif dengan SVG resolusi tinggi, pemilih warna kaos, input teks sablon, pemilihan jenis huruf, dan tombol simpan langsung ke keranjang belanja.
- **Mode Gelap / Terang (Dark Mode):** Tombol toggle tema di header dengan penyimpanan preferensi otomatis.

---

## 🛠️ Persyaratan Sistem & Instalasi

### 1. Kebutuhan Sistem
- Python 3.10+ (disarankan Python 3.12 atau 3.14)
- Pip atau package manager Python (misal `uv`)

### 2. Instalasi Dependensi
Jalankan perintah berikut di direktori proyek:

```bash
pip install -r requirements.txt
```

*Atau jika menggunakan `uv`:*
```bash
uv pip install -r requirements.txt
```

---

## ▶️ Cara Menjalankan Aplikasi Web

Jalankan perintah berikut:

```bash
python app.py
```

Setelah server aktif, buka browser favorit Anda dan akses:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🗺️ Peta Navigasi Rute Web

| Rute URL | Handler | Deskripsi Halaman |
|---|---|---|
| `GET /` | `index()` | Beranda (Hero Banner, Kategori Pilihan, Produk Populer) |
| `GET /collection/pria` | `collection('pria')` | Katalog Pakaian Pria dengan Filter Kategori & Sortir |
| `GET /collection/wanita` | `collection('wanita')` | Katalog Pakaian Wanita (Dress, Rok, Kaos, dll.) |
| `GET /collection/anak` | `collection('anak')` | Katalog Pakaian Anak-Anak |
| `GET /collection/bayi` | `collection('bayi')` | Katalog Pakaian Bayi Katun Lembut |
| `GET /product/<product_id>` | `product_detail(id)` | Halaman Detail Spesifik Produk |
| `GET /cart` | `cart()` | Keranjang Belanja & Ringkasan Checkout |
| `GET /search?q=...` | `search()` | Hasil Pencarian Produk |
| `GET /profile` | `profile()` | Profil Pelanggan & Riwayat Pesanan |
| `GET /studio` | `studio()` | Studio Kustomisasi Kaos Interaktif |
| `GET /api/products` | `api_products()` | REST API JSON Daftar Seluruh Produk |
| `GET /api/search?q=...` | `api_search()` | REST API JSON Hasil Pencarian |

---

## 🧪 Menjalankan Pengujian Otomatis (Testing)

Proyek ini dilengkapi dengan rangkaian pengujian otomatis lengkap menggunakan `pytest` (Test-Driven Development):

```bash
pytest -v
```

Rangkaian test mencakup:
- `tests/test_environment.py`: Verifikasi dependensi Flask terpasang.
- `tests/test_products.py`: Verifikasi unit query data produk, ID lookup, filter gender & category, dan search.
- `tests/test_static.py`: Verifikasi ketersediaan seluruh aset dan client script.
- `tests/test_home.py`: Verifikasi render route beranda `/`.
- `tests/test_collection.py`: Verifikasi route koleksi dan fallback 404 pada gender invalid.
- `tests/test_detail.py`: Verifikasi render detail produk dan fallback 404 pada ID invalid.
- `tests/test_cart.py`: Verifikasi halaman keranjang belanja.
- `tests/test_other_routes.py`: Verifikasi search, profile, studio, dan endpoint JSON API.

---

## 📖 Dokumentasi Lanjutan

Untuk membaca panduan teknis yang lebih mendalam:
- 📘 [Panduan Penggunaan Lengkap](docs/PANDUAN_PENGGUNAAN.md) — Panduan pengguna, kustomisasi produk, dan troubleshooting.
- 🏗️ [Arsitektur Sistem & Pemetaan File](docs/ARSITEKTUR_SISTEM.md) — Penjelasan detail peralihan struktur dari static HTML/JS ke arsitektur modular Flask.
- 📐 [Spesifikasi Rancangan Desain](docs/superpowers/specs/2026-11-11-hypeware-flask-migration-design.md) — Dokumen spesifikasi awal yang telah disetujui.
