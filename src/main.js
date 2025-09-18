// Select product container
const productList = document.getElementById("product-list");

// Fetch products from local JSON file
async function loadProducts() {
  try {
    const response = await fetch("products.json");
    const products = await response.json();

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${product.imgUrl}" alt="${product.name}">
        <div class="info">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>
        </div>
        <button>Add to Cart</button>
      `;

      productList.appendChild(card);
    });
  } catch (error) {
    productList.innerHTML = `<p style="color:red;">Failed to load products.</p>`;
    console.error("Error loading products:", error);
  }
}

// Call function
loadProducts();
