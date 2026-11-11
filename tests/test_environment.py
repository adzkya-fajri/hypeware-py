import importlib.metadata

def test_flask_installed():
    import flask
    version = importlib.metadata.version("flask")
    assert version is not None

