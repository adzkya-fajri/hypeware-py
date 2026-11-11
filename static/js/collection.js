// static/js/collection.js
// Client-side instant filtering and sorting for Collection Catalog

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");
  const sortSelect = document.getElementById("sort-select");
  const productGrid = document.getElementById("product-grid");
  const productCountDisplay = document.getElementById("product-count");

  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("cat");
  let activeFilter = catParam || "all";
  if (!catParam) {
    const activeBtn = document.querySelector(".filter-btn.active");
    if (activeBtn) activeFilter = activeBtn.getAttribute("data-filter") || "all";
  }

  function applyFilterAndSort() {
    let visibleCount = 0;
    const cards = Array.from(productCards);

    // Filter
    cards.forEach(card => {
      const category = card.getAttribute("data-category");
      if (activeFilter === "all" || category === activeFilter) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (productCountDisplay) {
      productCountDisplay.textContent = `${visibleCount} Produk`;
    }

    // Sort if select element is present
    if (sortSelect && productGrid) {
      const sortValue = sortSelect.value;
      const sortedCards = cards.filter(c => c.style.display !== "none");

      sortedCards.sort((a, b) => {
        const priceA = parseInt(a.getAttribute("data-price") || "0", 10);
        const priceB = parseInt(b.getAttribute("data-price") || "0", 10);
        if (sortValue === "price-low") return priceA - priceB;
        if (sortValue === "price-high") return priceB - priceA;
        return 0; // Default order
      });

      sortedCards.forEach(card => productGrid.appendChild(card));
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => {
        b.classList.remove("active", "border-b-2", "border-black", "dark:border-white");
        b.classList.add("text-gray-400");
      });

      btn.classList.add("active", "border-b-2", "border-black", "dark:border-white");
      btn.classList.remove("text-gray-400");

      activeFilter = btn.getAttribute("data-filter") || "all";
      applyFilterAndSort();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", applyFilterAndSort);
  }

  // Quick add to cart buttons
  document.querySelectorAll(".quick-add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const product = {
        id: btn.getAttribute("data-id"),
        nama: btn.getAttribute("data-nama"),
        harga: btn.getAttribute("data-harga"),
        priceNumeric: parseInt(btn.getAttribute("data-price") || "0", 10),
        img: btn.getAttribute("data-img"),
        category: btn.getAttribute("data-category")
      };
      if (window.HypewareCart) {
        window.HypewareCart.addToCart(product, "M", 1);
      }
    });
  });
});
