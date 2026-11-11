# api/index.py
# Vercel Serverless Function entrypoint for Hypeware Flask

import sys
import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app import app

class VercelPathFixMiddleware:
    """
    Middleware to fix PATH_INFO when Vercel rewrites all routes to /api/index.
    Ensures Flask receives the actual requested URL path instead of /api/index.
    """
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        path_info = environ.get("PATH_INFO", "")
        
        # Check HTTP headers that Vercel injects
        matched_path = environ.get("HTTP_X_MATCHED_PATH")
        if matched_path and not matched_path.startswith("/api"):
            environ["PATH_INFO"] = matched_path
        elif path_info == "/api/index" or path_info == "/api/index/":
            environ["PATH_INFO"] = "/"
        elif path_info.startswith("/api/index/"):
            environ["PATH_INFO"] = path_info[len("/api/index"):]

        return self.wsgi_app(environ, start_response)

app.wsgi_app = VercelPathFixMiddleware(app.wsgi_app)
