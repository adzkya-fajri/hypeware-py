# Panduan Penggunaan HYPEWARE (Python Flask Edition)

Dokumen ini berisi petunjuk lengkap bagi pengembang dan pengguna untuk mengoperasikan, mengelola produk, dan memanfaatkan seluruh fitur web Hypeware berbasis Python Flask.

---

## 1. Menjalankan Server Lokal

### Menjalankan Mode Development
Buka terminal pada direktori proyek `hypeware` dan jalankan:

```bash
python app.py
```

Server Flask akan berjalan secara default di:
```
http://127.0.0.1:5000
```

### Mengubah Port
Jika port 5000 sedang digunakan oleh aplikasi lain, Anda dapat menentukan port melalui environment variable:
```bash
PORT=8000 python app.py
```

---

## 2. Struktur Menu & Navigasi Pengguna

1. **Beranda (`/`):**
   - Menampilkan Hero Banner rilis terbaru dengan tombol akses cepat.
   - Slider kategori interaktif (Pria, Wanita, Anak, Bayi).
   - Grid produk unggulan yang ditarik langsung dari data Python.
   - Banner studio kustomisasi kaos.

2. **Katalog Koleksi (`/collection/<gender>`):**
   - Pilih kategori: `/collection/pria`, `/collection/wanita`, `/collection/anak`, `/collection/bayi`.
   - Gunakan tombol filter di bagian atas ("Semua", "Kaos", "Kemeja", "Celana", dll.) untuk menyaring produk secara instan tanpa memuat ulang halaman.
   - Urutkan harga menggunakan dropdown sortir di sebelah kanan (Rendah ke Tinggi / Tinggi ke Rendah).
   - Klik ikon tas belanja pada kartu produk untuk menambahkan langsung produk ke keranjang.

3. **Detail Produk (`/product/<id>`):**
   - Pilih ukuran busana yang diinginkan: `S`, `M`, `L`, `XL`, `XXL`.
   - Atur jumlah barang dengan tombol `+` dan `-`.
   - Klik **Tambah ke Keranjang** untuk menyimpan pilihan ke keranjang belanja.
   - Klik **Beli Sekarang** untuk langsung masuk ke halaman checkout keranjang.

4. **Keranjang Belanja (`/cart`):**
   - Melihat daftar produk yang telah dipilih beserta rincian ukuran dan total harga.
   - Mengubah kuantitas item atau menghapus item dari keranjang.
   - Indikator **Gratis Ongkir**: Sistem secara otomatis menghitung selisih belanjaan hingga mencapai target Rp699.000 untuk mendapatkan ongkir gratis.
   - Klik tombol **Lanjut ke Pembayaran** untuk menyelesaikan transaksi (simulasi).

5. **Pencarian Produk (`/search`):**
   - Akses melalui ikon kaca pembesar di navbar atau langsung ke URL `/search?q=kata_kunci`.
   - Menampilkan grid produk yang sesuai dengan nama produk, kategori, atau deskripsi.

6. **Studio Baju (`/studio`):**
   - Akses melalui tautan "Studio Baju" di navbar.
   - Ubah warna dasar kaos dengan memilih palet warna (Putih, Hitam, Merah, Abu-Abu, Biru, Hijau).
   - Masukkan teks sablon yang Anda inginkan pada input teks.
   - Pilih jenis font dan warna font teks sablon.
   - Pilih ukuran kaos dan klik **Masukkan Kaos Custom ke Keranjang** untuk menambahkan produk kreasi Anda ke keranjang belanja.

7. **Profil Pelanggan (`/profile`):**
   - Menampilkan status membership, riwayat transaksi pesanan terakhir, poin reward, dan buku alamat tersimpan.

8. **Mode Gelap / Terang:**
   - Klik ikon bulan / matahari pada sudut kanan atas navbar untuk berganti mode. Preferensi Anda akan tersimpan di browser secara otomatis.

---

## 3. Cara Menambah atau Mengubah Produk

Seluruh katalog produk disimpan dalam modul Python di file:
📂 `data/products.py`

Untuk menambahkan produk baru, tambahkan dictionary ke dalam list `ALL_PRODUCTS` dengan format berikut:

```python
{
  "id": "nama-id-unik-tanpa-spasi",
  "nama": "Nama Lengkap Produk Baru",
  "category": "bjp",  # Kode kategori: bjp/bj (kaos), km (kemeja), cl (celana), op (outerwear), dr (dress), ro (rok)
  "categoryName": "Kaos",
  "gender": "pria",  # pria, wanita, anak, atau bayi
  "deskripsi": "Deskripsi lengkap mengenai bahan, keunggulan, dan panduan ukuran produk.",
  "harga": "Rp59.000",
  "priceNumeric": 59000,
  "img": "https://url-gambar-produk-anda.jpg"  # atau path static: "/static/asset/..."
}
```

Setelah file disimpan, server Flask akan secara otomatis memuat produk baru tanpa perlu kompilasi tambahan!

---

## 4. REST API Endpoint

Bagi pengembang yang ingin mengintegrasikan data dengan aplikasi mobile atau frontend lain di kemudian hari, telah disediakan endpoint API JSON:

- `GET /api/products`: Mengembalikan list seluruh produk dalam format JSON.
- `GET /api/products?gender=pria`: Mengembalikan produk pria saja.
- `GET /api/search?q=kemeja`: Mengembalikan hasil pencarian produk dalam format JSON.
