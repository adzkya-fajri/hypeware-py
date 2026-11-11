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
