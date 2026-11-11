# app.py
# Main Flask Web Application for Hypeware

import os
from flask import Flask, render_template, request, jsonify, abort
from data.products import (
    get_all_products,
    get_product_by_id,
    get_products_by_gender,
    get_products_by_category,
    search_products,
    CATEGORY_LABELS,
)

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "hypeware-secret-key-2026")

VALID_GENDERS = {"pria", "wanita", "anak", "bayi"}

@app.route("/")
def index():
    all_items = get_all_products()
    # Featured products: first 8 products
    featured = all_items[:8]
    return render_template("index.html", featured_products=featured)

@app.route("/collection/<gender>")
def collection(gender):
    g = gender.lower()
    if g not in VALID_GENDERS:
        abort(404)
    products = get_products_by_gender(g)
    cat = request.args.get("cat")
    return render_template(
        "collection.html",
        gender=g,
        products=products,
        category_labels=CATEGORY_LABELS,
        active_cat=cat or "all"
    )

@app.route("/product/<product_id>")
def product_detail(product_id):
    product = get_product_by_id(product_id)
    if not product:
        abort(404)
    # Related products from same category/gender
    related = [
        p for p in get_products_by_gender(product["gender"])
        if p["id"] != product["id"]
    ][:4]
    return render_template("product_detail.html", product=product, related_products=related)

@app.route("/cart")
def cart():
    return render_template("cart.html")

@app.route("/search")
def search():
    query = request.args.get("q", "").strip()
    results = search_products(query) if query else []
    return render_template("search.html", query=query, results=results, total=len(results))

@app.route("/profile")
def profile():
    return render_template("profile.html")

@app.route("/studio")
def studio():
    return render_template("studio.html")

# API Endpoints
@app.route("/api/products")
def api_products():
    gender = request.args.get("gender")
    if gender:
        return jsonify(get_products_by_gender(gender))
    return jsonify(get_all_products())

@app.route("/api/search")
def api_search():
    query = request.args.get("q", "")
    return jsonify(search_products(query))

# Error Handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template("404.html"), 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Hypeware Web Server running on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
