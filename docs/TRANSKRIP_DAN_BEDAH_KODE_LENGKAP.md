# Transkrip & Dokumentasi Bedah Kode Lengkap HYPEWARE Python Flask

Dokumen ini berisi transkrip dan penjelasan terperinci setiap file dalam arsitektur web HYPEWARE Python Flask: fungsi setiap baris kode, peran dalam sistem, serta bagian mana yang dapat Anda ubah/kustomisasi sesuai kebutuhan bisnis.

---

## DAFTAR FILE YANG DIBAHAS

1. [`app.py`](#1-file-apppy--server-utama--routing) (Server Utama & Routing)
2. [`data/products.py`](#2-file-dataproductspy--repositori-katalog-produk) (Repositori Katalog Produk)
3. [`api/index.py`](#3-file-apiindexpy--entrypoint-serverless-vercel) (Entrypoint Serverless Vercel)
4. [`vercel.json`](#4-file-verceljson--konfigurasi-routing-cloud) (Konfigurasi Routing Cloud Vercel)
5. [`templates/base.html`](#5-file-templatesbasehtml--layout-induk-navbar--footer) (Layout Induk, Navbar, Mega-Menu & Footer)
6. [`templates/index.html`](#6-file-templatesindexhtml--halaman-beranda) (Halaman Beranda / Landing Page)
7. [`templates/collection.html`](#7-file-templatescollectionhtml--katalog-koleksi-dinamis) (Katalog Koleksi Dinamis)
8. [`templates/product_detail.html`](#8-file-templatesproduct_detailhtml--detail-produk) (Halaman Detail Produk)
9. [`templates/cart.html`](#9-file-templatescarthtml--keranjang-belanja) (Keranjang Belanja)
10. [`templates/studio.html`](#10-file-templatesstudiohtml--studio-kustomisasi-baju) (Studio Kustomisasi Kaos)
11. [`templates/search.html`](#11-file-templatessearchhtml--pencarian-produk) (Halaman Pencarian)
12. [`templates/profile.html`](#12-file-templatesprofilehtml--profil-pelanggan) (Profil Pelanggan)
13. [`templates/404.html`](#13-file-templates404html--halaman-error-404) (Halaman Error 404)
14. [`static/js/nav.js`](#14-file-staticjsnavjs--interaksi-mega-menu--tema) (Interaksi Mega-Menu & Dark Mode)
15. [`static/js/cart.js`](#15-file-staticjscartjs--sistem-keranjang-lokal--toast) (Keranjang Belanja & Toast)
16. [`static/js/collection.js`](#16-file-staticjscollectionjs--filter-instan-katalog) (Filter Instan Katalog)
17. [`requirements.txt`](#17-file-requirementstxt--dependensi-python) (Dependensi Python)

---

## 1. File `app.py` — Server Utama & Routing

### Fungsi File:
Sebagai pusat kendali (*brain/engine*) aplikasi web Hypeware. File ini menginisialisasi framework Flask, menentukan rute URL yang bisa diakses di browser, memanggil data produk dari `data/products.py`, dan merender template Jinja2 yang sesuai.

### Bedah Kode:
```python
import os
from flask import Flask, render_template, request, jsonify, abort
from data.products import (
    get_all_products,
    get_product_by_id,
    get_products_by_gender,
    get_products_by_category,
    search_products,
    CATEGORY_LABELS,
)
```
* **Fungsi:** Mengimpor modul Flask untuk penanganan HTTP dan mengimpor fungsi-fungsi pengambil data dari repositori `data/products.py`.

```python
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, "templates"),
    static_folder=os.path.join(BASE_DIR, "static")
)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "hypeware-secret-key-2026")
```
* **Fungsi:** Menginisialisasi objek `app` Flask. `template_folder` dan `static_folder` diset menggunakan path absolut agar file HTML dan aset gambar tetap terbaca ketika aplikasi dijalankan di server lokal maupun cloud serverless seperti Vercel.
* **Yang Bisa Diubah:** Nilai `"hypeware-secret-key-2026"` dapat diganti dengan string rahasia unik Anda sendiri untuk keamanan sesi.

```python
VALID_GENDERS = {"pria", "wanita", "anak", "bayi"}
```
* **Fungsi:** Daftar gender yang sah. Jika ada URL seperti `/collection/hewan`, sistem otomatis memblokirnya dan mengeluarkan error 404.
* **Yang Bisa Diubah:** Anda dapat menambahkan gender/kategori baru di sini (misal: `"unisex"`).

```python
@app.route("/")
@app.route("/api/index")
def index():
    all_items = get_all_products()
    featured = all_items[:8]
    return render_template("index.html", featured_products=featured)
```
* **Fungsi:** Menampilkan halaman beranda. Mengambil seluruh produk lalu menyaring 8 produk pertama sebagai produk unggulan (`featured_products`).
* **Yang Bisa Diubah:** Angka `[:8]` bisa diubah menjadi `[:12]` jika ingin menampilkan 12 produk di beranda.

```python
@app.route("/collection/<gender>")
def collection(gender):
    g = gender.lower()
    if g not in VALID_GENDERS:
        abort(404)
    products = get_products_by_gender(g)
    cat = request.args.get("cat")
    return render_template(
        "collection.html",
        gender=g,
        products=products,
        category_labels=CATEGORY_LABELS,
        active_cat=cat or "all"
    )
```
* **Fungsi:** Menangani halaman katalog berdasarkan gender (`/collection/pria`, `/collection/wanita`, dll.) dan menerima query parameter `?cat=...` untuk pra-penyaringan kategori.

```python
@app.route("/product/<product_id>")
def product_detail(product_id):
    product = get_product_by_id(product_id)
    if not product:
        abort(404)
    related = [
        p for p in get_products_by_gender(product["gender"])
        if p["id"] != product["id"]
    ][:4]
    return render_template("product_detail.html", product=product, related_products=related)
```
* **Fungsi:** Menampilkan detail spesifik suatu produk berdasarkan ID uniknya. Secara otomatis mencari 4 produk serupa (`related_products`) dari gender yang sama untuk ditampilkan di bagian bawah.
* **Yang Bisa Diubah:** Batasan `[:4]` bisa ditambah menjadi `[:6]` untuk menampilkan lebih banyak rekomendasi.

```python
@app.route("/cart")
def cart():
    return render_template("cart.html")

@app.route("/search")
def search():
    query = request.args.get("q", "").strip()
    results = search_products(query) if query else []
    return render_template("search.html", query=query, results=results, total=len(results))

@app.route("/profile")
def profile():
    return render_template("profile.html")

@app.route("/studio")
def studio():
    return render_template("studio.html")
```
* **Fungsi:** Rute untuk keranjang belanja, pencarian (menerima query `?q=...`), profil pengguna, dan studio kustomisasi baju.

```python
@app.errorhandler(404)
def not_found_error(error):
    return render_template("404.html"), 404
```
* **Fungsi:** Menangkap seluruh URL yang salah dan menampilkan halaman 404 bertema HYPEWARE dengan status HTTP 404 resmi.

---

## 2. File `data/products.py` — Repositori Katalog Produk

### Fungsi File:
Database produk dalam bentuk struktur data Python native. Menyimpan seluruh atribut produk: ID, nama, kode kategori, harga teks, harga angka integer, gender, deskripsi, dan link foto.

### Bedah Kode:
```python
CATEGORY_LABELS = {
  "bjp": "Kaos",
  "bj": "Kaos",
  "km": "Kemeja",
  "cl": "Celana",
  "op": "Outerwear",
  "dr": "Dress",
  "ro": "Rok"
}
```
* **Fungsi:** Kamus pemetaan kode singkat kategori menjadi nama bahasa manusia yang rapi.
* **Yang Bisa Diubah:** Anda bisa menambah kategori baru, misalnya `"jkt": "Jaket"` atau `"spt": "Sepatu"`.

```python
ALL_PRODUCTS = [
  {
    "id": "estar",
    "nama": "Kaos Pria Distro Lengan Pendek ESTAR",
    "category": "bjp",
    "deskripsi": "Sablon premium yang tidak mudah pecah...",
    "harga": "Rp19.000",
    "priceNumeric": 19000,
    "img": "https://...",
    "gender": "pria",
    "categoryName": "Kaos"
  },
  ...
]
```
* **Fungsi:** Daftar 37 produk pakaian yang tersimpan sebagai list of dictionary.
* **Yang Bisa Diubah:** Anda bisa menambah produk baru, mengubah foto pada `"img"`, mengubah harga pada `"harga"` dan `"priceNumeric"`, atau mengedit teks deskripsi.

```python
def get_all_products() -> list[dict]:
    return [dict(p) for p in ALL_PRODUCTS]

def get_product_by_id(product_id: str) -> dict | None:
    for p in ALL_PRODUCTS:
        if p["id"] == product_id:
            return dict(p)
    return None

def get_products_by_gender(gender: str) -> list[dict]:
    target = gender.lower()
    return [dict(p) for p in ALL_PRODUCTS if p.get("gender", "").lower() == target]

def search_products(query: str) -> list[dict]:
    q = query.strip().lower()
    if not q:
        return []
    return [
        dict(p) for p in ALL_PRODUCTS
        if q in p.get("nama", "").lower() or q in p.get("category", "").lower() or q in p.get("categoryName", "").lower() or q in p.get("deskripsi", "").lower()
    ]
```
* **Fungsi:** Fungsi utilitas untuk query data produk. Menggunakan `dict(p)` (defensive copying) agar data asli tidak termutasi oleh fungsi luar secara tidak sengaja.
* **Yang Bisa Diubah:** Logika `search_products` dapat diperluas untuk mencakup pencarian berdasarkan rentang harga atau warna.

---

## 3. File `api/index.py` — Entrypoint Serverless Vercel

### Fungsi File:
Menjadi jembatan antara infrastruktur Serverless Function Vercel dan aplikasi WSGI Flask.

### Bedah Kode:
```python
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app import app
```
* **Fungsi:** Memasukkan root direktori proyek ke `sys.path` Python agar Python dapat mengimpor modul `app` dan paket `data` dari subfolder `api/`.

```python
class VercelPathFixMiddleware:
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        path_info = environ.get("PATH_INFO", "")
        matched_path = environ.get("HTTP_X_MATCHED_PATH")
        if matched_path and not matched_path.startswith("/api"):
            environ["PATH_INFO"] = matched_path
        elif path_info == "/api/index" or path_info == "/api/index/":
            environ["PATH_INFO"] = "/"
        elif path_info.startswith("/api/index/"):
            environ["PATH_INFO"] = path_info[len("/api/index"):]

        return self.wsgi_app(environ, start_response)

app.wsgi_app = VercelPathFixMiddleware(app.wsgi_app)
```
* **Fungsi:** Mengatasi masalah *URL Rewrite* Vercel. Ketika Vercel mengalihkan request ke `/api/index`, middleware ini secara otomatis menormalkan `PATH_INFO` kembali menjadi rute aslinya (misal `/collection/pria` atau `/`) sehingga Flask tidak mengalami salah rute atau 404.

---

## 4. File `vercel.json` — Konfigurasi Cloud Vercel

### Fungsi File:
Memberi tahu router Vercel untuk mengarahkan seluruh traffic URL web ke fungsi Python serverless.

### Bedah Kode:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api/index"
    }
  ]
}
```
* **Fungsi:** Pola `"source": "/(.*)"` menangkap semua URL yang dibuka oleh pengunjung dan memprosesnya melalui file `api/index.py`.

---

## 5. File `templates/base.html` — Layout Induk

### Fungsi File:
Template induk (*master layout*) yang mewariskan elemen dasar ke semua halaman: `<head>`, import Tailwind CSS, Google Fonts (Inter & Oswald), Material Icons, Header dengan logo, menu navigasi, tombol Dark Mode, Mega-Menu dropdown, wadah Toast notifikasi, dan Footer.

### Bagian Kunci & Yang Bisa Diubah:
1. **Warna Tema Utama:**
   Di tag `<script>` konfigurasi Tailwind:
   ```javascript
   colors: {
     primary: "#EE0000", // Ganti kode HEX ini jika ingin mengganti warna aksen merah utama
   }
   ```
2. **Logo Toko:**
   Di `<header>`:
   ```html
   <span class="text-2xl font-display font-bold tracking-tighter text-primary">HYPEWARE</span>
   ```
   Teks `HYPEWARE` dapat diganti dengan nama brand Anda.
3. **Menu Navigasi:**
   Tautan navigasi pria, wanita, anak, bayi, dan studio baju menggunakan sintaks `{{ url_for('collection', gender='pria') }}`. Anda bisa menambah menu baru di daftar `<ul>` ini.
4. **Footer:**
   Berisi teks hak cipta, informasi alamat, tautan sosial media, dan formulir pendaftaran buletin (newsletter).

---

## 6. File `templates/index.html` — Halaman Beranda

### Fungsi File:
Halaman muka toko online. Memuat Hero Banner dengan tombol ajakan bertindak (Call to Action), slider kategori utama, grid produk terpopuler, dan banner promosi Hypeware Design Studio.

### Bagian Kunci & Yang Bisa Diubah:
* **Teks Hero Banner:**
  `REDEFINING STREETWEAR ESSENTIALS` dapat diubah langsung di tag `<h1>`.
* **Perulangan Produk Jinja2:**
  ```jinja2
  {% for product in featured_products %}
  ...
  {% endfor %}
  ```
  Setiap kartu produk menampilkan gambar, nama barang, harga, dan tombol *quick-add* ke keranjang belanja.

---

## 7. File `templates/collection.html` — Katalog Koleksi

### Fungsi File:
Menampilkan katalog pakaian berdasarkan kategori gender (`pria`, `wanita`, `anak`, `bayi`).

### Bagian Kunci & Yang Bisa Diubah:
* **Filter Pills (Tombol Kategori):**
  Tombol filter "Semua", "Kaos", "Kemeja", "Celana", "Outerwear" memiliki atribut `data-filter="bjp"`, dll. Ketika diklik, JavaScript di `static/js/collection.js` menyaring kartu produk seketika tanpa reload halaman.
* **Sortir Harga:**
  Elemen `<select id="sort-select">` menyediakan pengurutan harga terendah ke tertinggi dan sebaliknya.

---

## 8. File `templates/product_detail.html` — Detail Produk

### Fungsi File:
Menampilkan halaman produk tunggal secara mendalam ketika pengguna mengklik kartu produk.

### Bagian Kunci & Yang Bisa Diubah:
* **Pemilih Ukuran:**
  Tombol ukuran `S`, `M`, `L`, `XL`, `XXL`. Pilihan ukuran yang aktif disimpan dan dikirim ke fungsi `addToCart`.
* **Pengatur Jumlah (Quantity):**
  Tombol `+` dan `-` dengan batas minimal 1 dan maksimal 10.
* **Tombol Beli Sekarang:**
  Tombol ini menambahkan item ke keranjang dan langsung mengarahkan halaman ke `/cart` untuk mempercepat proses checkout pengguna.

---

## 9. File `templates/cart.html` — Keranjang Belanja

### Fungsi File:
Halaman review keranjang belanja dan estimasi pembayaran.

### Bagian Kunci & Yang Bisa Diubah:
* **Meteran Gratis Ongkir:**
  ```javascript
  const freeShippingThreshold = 699000;
  ```
  Menghitung secara real-time selisih belanjaan menuju Rp699.000. Jika subtotal mencapai batas ini, ongkir otomatis menjadi `GRATIS`. Angka `699000` dapat diubah sesuai nominal gratis ongkir yang Anda inginkan.
* **Simulasi Checkout:**
  Tombol "Lanjut ke Pembayaran" memproses pesanan dan mengosongkan keranjang di `localStorage`.

---

## 10. File `templates/studio.html` — Studio Kustomisasi Kaos

### Fungsi File:
Fitur interaktif tempat pengunjung dapat mendesain kaos sablon secara live dari browser.

### Bagian Kunci & Yang Bisa Diubah:
* **Mockup Kaos Vektor SVG:**
  Menggunakan gambar SVG presisi tinggi dengan gradasi kain, kerah jahitan ganda, dan lipatan bahu yang realistis.
* **Pilihan Warna Kaos:**
  Palet warna (Putih `#ffffff`, Hitam `#151c27`, Merah `#EE0000`, Abu-Abu `#5e5e5e`, Biru `#0037b0`, Hijau `#166534`). Warna gradasi SVG berubah seketika saat tombol warna diklik.
* **Input Teks Sablon:**
  Pengguna bisa mengetik kata/nama (maksimal 24 karakter) dan memilih font (Oswald, Inter, Impact, Courier, Georgia). Teks ter-render langsung di area sablon kaos.
* **Harga Kaos Kustom:**
  Default diset Rp85.000. Dapat disesuaikan di variabel `priceNumeric: 85000`.

---

## 11. File `templates/search.html` — Pencarian Produk

### Fungsi File:
Halaman pencarian interaktif yang menerima kata kunci dari pengguna dan mencocokkannya ke database produk Python.

### Bagian Kunci:
* Kotak input pencarian dengan form action `GET /search`.
* Menampilkan jumlah hasil temuan: `"Hasil Pencarian: 'kemeja' (4 Produk Ditemukan)"`.
* Menyediakan tag saran pencarian populer (*Quick Search Tags*): Kaos, Kemeja, Flanel, Dress, Celana.

---

## 12. File `templates/profile.html` — Profil Pelanggan

### Fungsi File:
Halaman dashboard akun pelanggan yang menampilkan status keanggotaan VIP, riwayat pembelian produk sebelumnya, poin reward, dan alamat pengiriman.

---

## 13. File `templates/404.html` — Halaman Error 404

### Fungsi File:
Tampilan antarmuka yang ramah ketika pengguna salah mengetik URL atau mencari produk yang tidak ada. Dilengkapi tombol "Kembali ke Beranda" agar pengguna tidak terjebak di halaman kosong.

---

## 14. File `static/js/nav.js` — Mega Menu & Dark Mode

### Fungsi File:
Mengatur interaksi navigasi di browser:
* Menampilkan dropdown mega menu saat cursor berada di atas menu "Pria", "Wanita", atau "Anak".
* Mengaktifkan toggle tema gelap/terang dan menyimpannya di `localStorage` dengan key `"hypeware_theme"`.

---

## 15. File `static/js/cart.js` — Keranjang Belanja & Toast

### Fungsi File:
Modul penyimpanan data keranjang belanja di browser sisi client:
* `loadCart()` & `saveCart()`: Membaca dan menulis list belanjaan ke `localStorage.getItem("hypeware_cart")`.
* `updateCartBadge()`: Menghitung total jumlah barang dan memperbarui angka merah di samping ikon tas belanja navbar.
* `showToast()`: Memunculkan pop-up animasi notifikasi hitam-merah di pojok kanan bawah setiap kali barang berhasil ditambahkan.

---

## 16. File `static/js/collection.js` — Filter Instan Katalog

### Fungsi File:
Mendengarkan event klik pada tombol kategori ("Semua", "Kaos", "Kemeja", "Celana") di halaman katalog. Mengubah atribut CSS `display: none` pada kartu produk yang tidak cocok sehingga pengguna dapat menyaring produk secara instan tanpa ada *delay* reload halaman.

---

## 17. File `requirements.txt` — Dependensi Python

### Fungsi File:
Mendaftarkan pustaka eksternal Python yang dibutuhkan oleh aplikasi:
```text
Flask>=3.0.0
pytest>=8.0.0
```
Pustaka `Flask` digunakan untuk web framework di production, sedangkan `pytest` digunakan untuk pengujian otomatis di lingkungan development.
