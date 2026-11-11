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
    html = res.data.decode("utf-8")
    assert "404" in html
    assert "Tidak Ditemukan" in html
