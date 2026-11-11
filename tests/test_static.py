# tests/test_static.py
import os

def test_static_files_exist():
    assert os.path.exists("static/js/nav.js")
    assert os.path.exists("static/js/cart.js")
    assert os.path.exists("static/js/collection.js")
    assert os.path.exists("static/asset")
    assert os.path.exists("static/custome")
