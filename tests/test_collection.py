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
    html = res.data.decode("utf-8")
    assert "Koleksi Wanita" in html

def test_collection_invalid_gender_404(client):
    res = client.get("/collection/unknown_category")
    assert res.status_code == 404
    html = res.data.decode("utf-8")
    assert "404" in html
    assert "Tidak Ditemukan" in html
