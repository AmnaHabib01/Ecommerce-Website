function toggleMenu() {
  document.querySelector("nav ul").classList.toggle("active");
}
// Full width section with youtube link
function openVideo() {
  window.open("https://www.youtube.com/watch?v=hJZ68qhqbIE", "_blank");
  // replace with your Mash Watches YouTube link
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
setInterval(nextSlide, 8000); 
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
    const response = await fetch("productss.json");
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
  <div class="image-container">
    <img src="${product.imgUrl}" alt="${product.name}" onclick="openProductPage(${product.id})">
    ${product.rating ? `<div class="rating-badge">⭐ ${product.rating.toFixed(2)}</div>` : ""}
  </div>
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

  // Scroll removed — search will scroll only on Enter
}


function filterByCategory(category) {
  // prevent link reload in a generic way
  window.event?.preventDefault();

  searchInput.value = "";
  categorySelect.value = category === "all" ? "Select Category" : category;
  filterProducts();

  document.getElementById("product-list").scrollIntoView({
    behavior: "smooth"
  });
}


// Event listeners
searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", () => {
  filterProducts();
  // Scroll to products when category is selected
  document.getElementById("product-list").scrollIntoView({ behavior: "smooth" });
});

// Stop reload on Enter
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    filterProducts();
    // Scroll to products only when Enter is pressed
    document.getElementById("product-list").scrollIntoView({ behavior: "smooth" });
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
  toast.style.background = "#92140c";
  toast.style.color = "#fff";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "1000";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
// Go to product detail page
function openProductPage(id) {
  window.location.href = `productw.html?id=${id}`;
}

// On page load
updateCartIcon();


// Initial load
loadProducts();


// sliderCards.js
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("sliderGrid");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track || !prevBtn || !nextBtn) return; // stop if elements not found

  let slidesGrid = Array.from(track.children);
  let currentIndex = 4; // start after cloned slides
  let slideWidth;

  // Clone first 4 and last 4 slides for infinite looping
  const cloneFirst = slidesGrid.slice(0, 4).map(slide => slide.cloneNode(true));
  const cloneLast = slidesGrid.slice(-4).map(slide => slide.cloneNode(true));

  cloneFirst.forEach(clone => track.appendChild(clone));
  cloneLast.forEach(clone => track.insertBefore(clone, track.firstChild));

  slidesGrid = Array.from(track.children);

  // Set/update slide width and initial position
  function updateSliderGridWidth() {
    slideWidth = slidesGrid[0].offsetWidth + 20; // width + gap
    moveSliderGridToIndex(currentIndex, false);
  }

  // Move slider to specific index
  function moveSliderGridToIndex(index, transition = true) {
    track.style.transition = transition ? "transform 0.4s ease-in-out" : "none";
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  // Go to next slide
  function nextGridSlide() {
    if (currentIndex >= slidesGrid.length - 4) return;
    currentIndex++;
    moveSliderGridToIndex(currentIndex);
    track.addEventListener("transitionend", handleNextGridLoop);
  }

  // Go to previous slide
  function prevGridSlide() {
    if (currentIndex <= 0) return;
    currentIndex--;
    moveSliderGridToIndex(currentIndex);
    track.addEventListener("transitionend", handlePrevGridLoop);
  }

  // Loop back to start if at the end
  function handleNextGridLoop() {
    if (currentIndex === slidesGrid.length - 4) {
      track.style.transition = "none";
      currentIndex = 4;
      moveSliderGridToIndex(currentIndex, false);
    }
    track.removeEventListener("transitionend", handleNextGridLoop);
  }

  // Loop back to end if at the start
  function handlePrevGridLoop() {
    if (currentIndex === 0) {
      track.style.transition = "none";
      currentIndex = slidesGrid.length - 8;
      moveSliderGridToIndex(currentIndex, false);
    }
    track.removeEventListener("transitionend", handlePrevGridLoop);
  }

  // Event listeners
  nextBtn.addEventListener("click", nextGridSlide);
  prevBtn.addEventListener("click", prevGridSlide);
  window.addEventListener("resize", updateSliderGridWidth);
  updateSliderGridWidth();
});


