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
