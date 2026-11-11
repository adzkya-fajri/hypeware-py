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
