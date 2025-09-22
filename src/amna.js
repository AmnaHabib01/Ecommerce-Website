function toggleMenu() {
    document.querySelector("nav ul").classList.toggle("active");
  }
let currentSlide = 0;
    const slides = document.getElementById('slides');
    const totalSlides = slides.children.length;
    const slideWidth = slides.children[0].clientWidth;

    function updateSlidePosition() {
   slides.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }
    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlidePosition();
    }
    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlidePosition();
    }
    setInterval(nextSlide, 8000); // Auto-slide every 5 seconds
    window.addEventListener('resize', () => {
      updateSlidePosition();
    });
    updateSlidePosition();


const productList = document.getElementById("product-list");
const searchInput = document.querySelector(".search-box input");
const categorySelect = document.querySelector(".search-box select");

let productsData = []; // store all products

async function loadProducts() {
  try {
    const response = await fetch("products.json");
    productsData = await response.json();
    displayProducts(productsData);
  } catch (error) {
    productList.innerHTML = `<p style="color:red;">Failed to load products.</p>`;
    console.error("Error loading products:", error);
  }
}

// Render products
function displayProducts(products) {
  productList.innerHTML = ""; // clear old cards

  if (products.length === 0) {
    productList.innerHTML = `<p style="color:orange;">No products found.</p>`;
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

   card.innerHTML = `
  <img src="${product.imgUrl}" alt="${product.name}" onclick="openProductPage(${product.id})">
  <div class="info">
    <h3>${product.name}</h3>
    <p>$${product.price}</p>
    <small>${product.category || "Uncategorized"}</small>
  </div>
  <button onclick="addToCart(${product.id})">Add to Cart</button>
`;


    productList.appendChild(card);
  });
}

// Search + Filter logic
function filterProducts() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categorySelect.value;

  const filtered = productsData.filter(product => {
    const matchesName = product.name.toLowerCase().includes(searchText);
    const matchesCategory =
      selectedCategory === "Select Category" || product.category === selectedCategory;
    return matchesName && matchesCategory;
  });

  displayProducts(filtered);
}

// Event listeners
searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);

// Stop reload on Enter
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    filterProducts();
  }
});
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart
function addToCart(id) {
  const product = productsData.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartIcon();
  showToast(`${product.name} added to cart!`);
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart icon (🛒 count + total)
function updateCartIcon() {
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalItems;
}


// Small toast notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#800080";
  toast.style.color = "#fff";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "1000";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
// Go to product detail page
function openProductPage(id) {
  window.location.href = `product.html?id=${id}`;
}

// On page load
updateCartIcon();


// Initial load
loadProducts();

