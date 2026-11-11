# Arsitektur Sistem & Pemetaan Migrasi HYPEWARE

Dokumen ini menjelaskan transisi arsitektural dari project web statis Hypeware ke arsitektur web modern berbasis **Python Flask + Jinja2**.

---

## 1. Perbandingan Arsitektur

| Aspek | Arsitektur Lama (Static + Vite) | Arsitektur Baru (Python Flask) |
|---|---|---|
| **Bahasa Utama** | HTML statis, JavaScript client-side | **Python 3** (Backend & Templating Controller) |
| **Penyajian Halaman** | File `.html` dibuka manual / static server | **Flask Routing** + **Jinja2 SSR** via `app.py` |
| **Manajemen Data Produk** | Variabel global di `colectiondata/*.js` | Modul data murni Python di `data/products.py` |
| **Pengolahan Tampilan** | Hardcoded HTML / injeksi JS manual | Template Jinja2 modular dengan pewarisan `base.html` |
| **Katalog Koleksi** | File HTML terpisah (`colection_pria.html`, dll.) | Route dinamis tunggal `/collection/<gender>` |
| **Pencarian Produk** | Mockup statis tanpa fungsi pencarian nyata | Controller Python dengan fungsi `search_products(q)` |
| **Interaksi Client** | Script JS tersebar | Modul terstruktur di `static/js/` (nav, cart, collection) |
| **Testing** | Tidak ada testing otomatis | Suite pengujian otomatis berbasis **pytest** |

---

## 2. Pemetaan File (Source File Mapping)

Berikut adalah daftar pemetaan dari file-file lama ke file-file baru di arsitektur Flask:

```
[Struktur Lama]                         --> [Struktur Baru Flask]
--------------------------------------------------------------------------------------
index.html                              --> templates/index.html & templates/base.html
colection_pria.html                     --> templates/collection.html (gender='pria')
colection_wanita.html                   --> templates/collection.html (gender='wanita')
colection_anak.html                     --> templates/collection.html (gender='anak')
colection_bayi.html                     --> templates/collection.html (gender='bayi')
desc.item.html                          --> templates/product_detail.html
keranjang.html                          --> templates/cart.html
search fitur.html                       --> templates/search.html
customer profile.html                   --> templates/profile.html
studio.html + custome/                  --> templates/studio.html
colectiondata/all-products.js           --> data/products.py
navbar/nav.js                           --> static/js/nav.js
collection-core.js / produk.js (cart)   --> static/js/cart.js & static/js/collection.js
asset/                                  --> static/asset/
custome/dist/                           --> static/custome/
```

---

## 3. Aliran Data & Siklus Permintaan (Request Lifecycle)

```
       [ Web Browser (User) ]
                 │
                 │ 1. HTTP GET /collection/pria
                 ▼
         [ Flask (app.py) ]
                 │
                 │ 2. get_products_by_gender("pria")
                 ▼
      [ data/products.py ]
                 │
                 │ 3. Mengembalikan list dict Python
                 ▼
     [ Jinja2 Template Engine ]
    (templates/base.html + collection.html)
                 │
                 │ 4. Merender HTML lengkap dengan Tailwind CSS & Data
                 ▼
       [ Web Browser (User) ]
                 │
                 │ 5. Interaksi instan (Filter Kaos, Tambah Cart, Toggle Tema)
                 ▼
       [ static/js/cart.js & collection.js ]
```

### Keunggulan Desain Ini:
1. **Performa Instan (First Paint Cepat):** Halaman awal langsung membawa data produk lengkap dari server tanpa menunggu browser melakukan request API berulang kali.
2. **Snappy Client Interaction:** Pengguna dapat berpindah tab filter kategori atau menyortir harga secara instan di browser tanpa flicker / reload layar.
3. **Penyimpanan Lokal Keranjang:** Data keranjang belanja disimpan di `localStorage` per browser, sehingga pengguna tidak perlu login terlebih dahulu untuk mulai berbelanja.
