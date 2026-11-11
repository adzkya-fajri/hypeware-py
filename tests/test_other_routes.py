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
