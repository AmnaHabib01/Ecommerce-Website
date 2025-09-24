
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let product = null;
let quantity = 1;

async function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    const res = await fetch("productts.json");
    const products = await res.json();
    product = products.find(p => p.id === id);

    if (!product) {
        document.body.innerHTML = "<h2>Product not found!</h2>";
        return;
    }

    document.getElementById("main-img").src = product.imgUrl;
    document.getElementById("product-name").textContent = product.name;

    const priceBox = document.getElementById("product-price-box");
    if (product.discount && product.discount > 0) {
        const discounted = (product.price - (product.price * product.discount / 100)).toFixed(2);
        priceBox.innerHTML = `
          <span class="old">$${product.price.toFixed(2)}</span>
          <span class="new">$${discounted}</span>
          <small> (-${product.discount}%)</small>
        `;
    } else {
        priceBox.innerHTML = `<span class="new">$${product.price.toFixed(2)}</span>`;
    }

    if (product.rating) {
        document.getElementById("product-rating").innerHTML = `
          <p class="rating">⭐ ${product.rating} <span>(${product.reviews || 0} reviews)</span></p>
        `;
    }

    document.getElementById("product-category").textContent = product.category;
    document.getElementById("product-desc").textContent = product.description || "No description available.";

    if (product.stock) {
        document.getElementById("product-stock").className = "stock " + (product.stock < 5 ? "low" : "");
        document.getElementById("product-stock").textContent = "Stock: " + product.stock;
    }
}

function changeQty(delta) {
    quantity += delta;
    if (quantity < 1) quantity = 1;
    document.getElementById("product-qty").textContent = quantity;
}

function addToCart() {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    showToast(product.name + " added to cart!");
    quantity = 1;
    document.getElementById("product-qty").textContent = 1;
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

loadProduct();
