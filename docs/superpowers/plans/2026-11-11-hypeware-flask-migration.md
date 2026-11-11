# Hypeware Flask Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memigrasikan seluruh platform web toko pakaian Hypeware ke Python Flask dengan server-side rendering (Jinja2) dan repositori data Python, sembari mempertahankan 100% kesamaan antarmuka visual (UI) dan interaksi (UX).

**Architecture:** Arsitektur Server-Side Rendered (SSR) berbasis Flask (`app.py`) yang mengelola routing, rendering template Jinja2 (`templates/`), dan penyajian katalog dari repositori data Python (`data/products.py`). Asset statis, Tailwind CSS, font, script interaksi mega-menu, dan modul keranjang belanja disajikan melalui folder `static/` untuk memastikan tampilan visual dan responsivitas browser identik secara presisi.

**Tech Stack:** Python 3.14, Flask, Jinja2, Pytest, Tailwind CSS (CDN), Vanilla JavaScript (Mega-menu & Cart LocalStorage).

**Spec:** `docs/superpowers/specs/2026-11-11-hypeware-flask-migration-design.md`

## Global Constraints

- **Python Version:** Python 3.10+ (lingkungan aktif Python 3.14).
- **Core Framework:** Flask (tanpa framework GUI/desktop atau library UI opiniated).
- **UI/UX Fidelity:** 100% sama dengan markup asli Hypeware (Tailwind CSS, warna primer `#EE0000`, Inter & Oswald font, dark mode, animasi mega menu).
- **Local Dev Server:** Harus dapat dijalankan langsung dengan perintah `python app.py` dan dapat diakses di `http://127.0.0.1:5000`.
- **Documentation:** Dokumentasi lengkap dalam Bahasa Indonesia yang mencakup instalasi, arsitektur kode, struktur direktori, dan panduan penggunaan.

## Review Focus

1. **Product ID Not Found:** Akses ke `/product/unknown_id` harus menampilkan halaman 404 Hypeware yang rapi, bukan server error 500 (Unhandled KeyError/NoneType).
2. **Empty Search Query:** Akses ke `/search?q=` atau string spasi harus menampilkan instruksi pencarian tanpa error.
3. **Invalid Gender Category:** Akses ke `/collection/alien` harus mengembalikan status 404 yang ramah.
4. **Cart Badge Sync:** Badge keranjang di navbar harus tetap menampilkan jumlah barang dari `localStorage` secara akurat pada semua halaman.
5. **Asset Paths:** Seluruh gambar produk dan asset lokal (`/static/asset/...`) harus ter-resolve dengan benar tanpa link gambar rusak (broken 404 image).

---

### Task 1: Environment & Dependency Setup

**Files:**
- Create: `requirements.txt`
- Create: `tests/__init__.py`
- Create: `tests/test_environment.py`

**Interfaces:**
- Produces: Environment dengan dependensi `Flask` dan `pytest` terpasang.

- [ ] **Step 1: Write test to verify Flask and environment requirements**

```python
# tests/test_environment.py
def test_flask_installed():
    import flask
    assert flask.__version__ is not None
```

- [ ] **Step 2: Run test to verify it fails or passes**

Run: `pytest tests/test_environment.py -v`

- [ ] **Step 3: Create `requirements.txt` and install dependencies**

```text
Flask>=3.0.0
pytest>=8.0.0
```
Run: `pip install -r requirements.txt`

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_environment.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add requirements.txt tests/__init__.py tests/test_environment.py
git commit -m "chore: setup python environment and requirements"
```

---

### Task 2: Python Product Data Repository (`data/products.py`)

**Files:**
- Create: `data/__init__.py`
- Create: `data/products.py`
- Create: `tests/test_products.py`

**Interfaces:**
- Produces:
  - `get_all_products() -> list[dict]`
  - `get_product_by_id(product_id: str) -> dict | None`
  - `get_products_by_gender(gender: str) -> list[dict]`
  - `get_products_by_category(gender: str, category: str) -> list[dict]`
  - `search_products(query: str) -> list[dict]`
  - `CATEGORIES: dict[str, str]`

- [ ] **Step 1: Write failing unit tests for product repository**

```python
# tests/test_products.py
from data.products import (
    get_all_products,
    get_product_by_id,
    get_products_by_gender,
    get_products_by_category,
    search_products,
)

def test_get_all_products_not_empty():
    products = get_all_products()
    assert len(products) > 0
    assert all("id" in p and "nama" in p and "harga" in p and "priceNumeric" in p for p in products)

def test_get_product_by_id_found():
    product = get_product_by_id("estar")
    assert product is not None
    assert product["id"] == "estar"
    assert "ESTAR" in product["nama"]

def test_get_product_by_id_not_found():
    assert get_product_by_id("non_existent_item_999") is None

def test_get_products_by_gender():
    men_products = get_products_by_gender("pria")
    assert len(men_products) > 0
    assert all(p["gender"] == "pria" for p in men_products)

def test_get_products_by_category():
    items = get_products_by_category("pria", "bjp")
    assert len(items) > 0
    assert all(p["gender"] == "pria" and p["category"] == "bjp" for p in items)

def test_search_products_matches():
    results = search_products("Kemeja")
    assert len(results) > 0
    assert any("Kemeja" in p["nama"] or "km" == p["category"] for p in results)

def test_search_products_empty_query():
    assert search_products("") == []
    assert search_products("   ") == []
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_products.py -v`
Expected: FAIL (ModuleNotFoundError or functions not defined)

- [ ] **Step 3: Implement `data/products.py`**

Convert the entire dataset from `colectiondata/all-products.js` (including all `dataPria`, `dataWanita`, `dataAnak`, `dataBayi`) into native Python dictionaries and implement the query functions.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_products.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add data/__init__.py data/products.py tests/test_products.py
git commit -m "feat: implement python product data repository"
```

---

### Task 3: Static Assets & Client Script Setup

**Files:**
- Create: `static/js/nav.js`
- Create: `static/js/cart.js`
- Create: `static/js/collection.js`
- Create / Copy: `static/asset/` (anak, cewek, cowok image folders)
- Create / Copy: `static/custome/` (built studio artifacts)
- Create: `tests/test_static.py`

**Interfaces:**
- Produces: Aset statis dan script client-side yang siap dimuat oleh Jinja2 templates via `url_for('static', filename=...)`.

- [ ] **Step 1: Write test verifying static asset directories and critical files exist**

```python
# tests/test_static.py
import os

def test_static_files_exist():
    assert os.path.exists("static/js/nav.js")
    assert os.path.exists("static/js/cart.js")
    assert os.path.exists("static/asset")
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_static.py -v`
Expected: FAIL

- [ ] **Step 3: Organize static files**

Copy image assets from `asset/` to `static/asset/`, set up `static/js/nav.js` (mega menu, dark mode toggle), and create `static/js/cart.js` with complete cart helper functions (`loadCart`, `saveCart`, `addToCart`, `updateCartBadge`, `showToast`).

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_static.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add static/ tests/test_static.py
git commit -m "feat: organize static assets and client scripts"
```

---

### Task 4: Base Layout & Homepage Template (`base.html` & `index.html`)

**Files:**
- Create: `templates/base.html`
- Create: `templates/index.html`
- Create: `app.py`
- Create: `tests/test_home.py`

**Interfaces:**
- Consumes: `data.products.get_all_products`
- Produces: Flask route `GET /` rendering `index.html` with Tailwind CSS, Navbar, Hero, and Category Sliders.

- [ ] **Step 1: Write test for homepage route**

```python
# tests/test_home.py
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_homepage_status_and_content(client):
    response = client.get("/")
    assert response.status_code == 200
    html = response.data.decode("utf-8")
    assert "HYPEWARE" in html or "Modern Fashion Store" in html
    assert "Koleksi Pria" in html
    assert "Koleksi Wanita" in html
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_home.py -v`
Expected: FAIL

- [ ] **Step 3: Implement `base.html`, `index.html`, and `app.py` route `/`**

- `templates/base.html`: Head dengan Google Fonts (Inter, Oswald), Material Icons, Tailwind script & config, Sticky Navbar dengan Mega-Menu, Cart Badge, Dark Mode toggle, Toast container, dan Footer lengkap.
- `templates/index.html`: Banner Hero, Category Sliders, Grid Produk Unggulan di-render menggunakan looping Jinja2 `{% for item in featured_products %}`.
- `app.py`: Inisialisasi Flask, route `@app.route('/')`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_home.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app.py templates/base.html templates/index.html tests/test_home.py
git commit -m "feat: implement base template and homepage route"
```

---

### Task 5: Dynamic Collection Catalog (`collection.html`)

**Files:**
- Create: `templates/collection.html`
- Modify: `app.py`
- Create: `tests/test_collection.py`

**Interfaces:**
- Consumes: `data.products.get_products_by_gender`, `data.products.get_products_by_category`
- Produces: Route `GET /collection/<gender>` with category filter pills, instant filtering, and responsive product cards.

- [ ] **Step 1: Write test for collection routes and 404 on invalid gender**

```python
# tests/test_collection.py
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_collection_pria(client):
    res = client.get("/collection/pria")
    assert res.status_code == 200
    html = res.data.decode("utf-8")
    assert "Koleksi Pria" in html
    assert "ESTAR" in html

def test_collection_wanita(client):
    res = client.get("/collection/wanita")
    assert res.status_code == 200

def test_collection_invalid_gender_404(client):
    res = client.get("/collection/unknown_category")
    assert res.status_code == 404
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_collection.py -v`
Expected: FAIL

- [ ] **Step 3: Implement `templates/collection.html` and route `/collection/<gender>` in `app.py`**

- Render breadcrumb, promotional banner, filter category buttons, product count, and product grid.
- Include data attributes on product cards so the client-side JavaScript can filter and sort dynamically without full page reload.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_collection.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add templates/collection.html app.py tests/test_collection.py
git commit -m "feat: implement dynamic collection catalog route and template"
```

---

### Task 6: Product Detail Page (`product_detail.html`)

**Files:**
- Create: `templates/product_detail.html`
- Modify: `app.py`
- Create: `tests/test_detail.py`

**Interfaces:**
- Consumes: `data.products.get_product_by_id`
- Produces: Route `GET /product/<product_id>` with detail images, size picker, price display, and add-to-cart button.

- [ ] **Step 1: Write test for product detail route and 404 fallback**

```python
# tests/test_detail.py
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_product_detail_existing(client):
    res = client.get("/product/estar")
    assert res.status_code == 200
    html = res.data.decode("utf-8")
    assert "ESTAR" in html
    assert "Rp19.000" in html

def test_product_detail_not_found(client):
    res = client.get("/product/non_existent_item_404")
    assert res.status_code == 404
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_detail.py -v`
Expected: FAIL

- [ ] **Step 3: Implement `templates/product_detail.html` and route `/product/<product_id>` in `app.py`**

- Render product images, breadcrumbs, title, price, descriptions, size selection pills, quantity selectors, and "Tambah ke Keranjang" action.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_detail.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add templates/product_detail.html app.py tests/test_detail.py
git commit -m "feat: implement product detail route and template"
```

---

### Task 7: Shopping Cart Page (`cart.html`)

**Files:**
- Create: `templates/cart.html`
- Modify: `app.py`
- Create: `tests/test_cart.py`

**Interfaces:**
- Produces: Route `GET /cart` displaying persistent shopping cart items, quantity controls, subtotal, and simulated checkout modal.

- [ ] **Step 1: Write test for cart route**

```python
# tests/test_cart.py
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_cart_page(client):
    res = client.get("/cart")
    assert res.status_code == 200
    html = res.data.decode("utf-8")
    assert "Keranjang Belanja" in html
    assert "Ringkasan Pesanan" in html
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_cart.py -v`
Expected: FAIL

- [ ] **Step 3: Implement `templates/cart.html` and route `/cart` in `app.py`**

- Port `keranjang.html` markup into `templates/cart.html` extending `base.html`.
- Render dynamic cart table populated by `static/js/cart.js`, item deletion, quantity increment/decrement, and checkout button.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_cart.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add templates/cart.html app.py tests/test_cart.py
git commit -m "feat: implement shopping cart route and template"
```

---

### Task 8: Search, Profile, Studio, and API Routes

**Files:**
- Create: `templates/search.html`
- Create: `templates/profile.html`
- Create: `templates/studio.html`
- Modify: `app.py`
- Create: `tests/test_other_routes.py`

**Interfaces:**
- Consumes: `data.products.search_products`, `data.products.get_all_products`
- Produces:
  - `GET /search?q=...`
  - `GET /profile`
  - `GET /studio`
  - `GET /api/products`
  - `GET /api/search`

- [ ] **Step 1: Write tests for search, profile, studio, and API endpoints**

```python
# tests/test_other_routes.py
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_search_page_with_query(client):
    res = client.get("/search?q=kaos")
    assert res.status_code == 200
    assert "Hasil Pencarian" in res.data.decode("utf-8")

def test_search_page_empty_query(client):
    res = client.get("/search")
    assert res.status_code == 200

def test_profile_page(client):
    res = client.get("/profile")
    assert res.status_code == 200

def test_studio_page(client):
    res = client.get("/studio")
    assert res.status_code == 200

def test_api_products(client):
    res = client.get("/api/products")
    assert res.status_code == 200
    json_data = res.get_json()
    assert isinstance(json_data, list)
    assert len(json_data) > 0

def test_api_search(client):
    res = client.get("/api/search?q=kemeja")
    assert res.status_code == 200
    json_data = res.get_json()
    assert isinstance(json_data, list)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_other_routes.py -v`
Expected: FAIL

- [ ] **Step 3: Implement templates and routes in `app.py`**

- `templates/search.html`: Input box pencarian dengan grid hasil produk dari fungsi Python `search_products(q)`.
- `templates/profile.html`: Tampilan profil customer yang diselaraskan dengan `base.html`.
- `templates/studio.html`: Halaman customizer studio.
- Routes `/api/products` dan `/api/search` mengembalikan JSON.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_other_routes.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add templates/search.html templates/profile.html templates/studio.html app.py tests/test_other_routes.py
git commit -m "feat: implement search, profile, studio, and api endpoints"
```

---

### Task 9: Comprehensive Documentation & System Verification

**Files:**
- Create / Update: `README.md`
- Create: `docs/PANDUAN_PENGGUNAAN.md`
- Create: `docs/ARSITEKTUR_SISTEM.md`

**Interfaces:**
- Produces: Dokumentasi lengkap berbahasa Indonesia yang menjelaskan cara instalasi, menjalankan aplikasi, struktur kode Python, dan panduan kustomisasi.

- [ ] **Step 1: Write documentation files**

- `README.md`: Ringkasan proyek Hypeware Flask, screenshot/fitur, cara install (`pip install -r requirements.txt`), cara jalankan (`python app.py`), dan navigasi URL.
- `docs/PANDUAN_PENGGUNAAN.md`: Panduan langkah demi langkah untuk pengguna/pengembang lokal.
- `docs/ARSITEKTUR_SISTEM.md`: Penjelasan detail mengenai pemetaan file lama (HTML/JS) ke arsitektur baru Python Flask + Jinja2.

- [ ] **Step 2: Run full automated test suite to verify everything passes**

Run: `pytest -v`
Expected: 100% PASS across all unit and integration tests.

- [ ] **Step 3: Verification command test with Flask client**

Run: `python -c "from app import app; client = app.test_client(); assert client.get('/').status_code == 200; print('Flask Web App Running Successfully!')"`

- [ ] **Step 4: Commit**

```bash
git add README.md docs/
git commit -m "docs: add comprehensive project documentation and architectural guide"
```
