let cart = JSON.parse(localStorage.getItem("cart")) || [];
let couponApplied = false; // track coupon application

function renderCart() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    updateSummary();
    return;
  }

  cart.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.imgUrl}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
        <div class="quantity">
          <button onclick="changeQty(${i}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${i}, 1)">+</button>
        </div>
        <button onclick="removeItem(${i})">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  updateSummary();
}

function changeQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function updateSummary() {
  let subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // only apply discount if coupon applied
  if (couponApplied) {
    subtotal = +(subtotal * 0.9).toFixed(2);
  }

  const tax = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("tax").textContent = tax.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function applyCoupon() {
  const code = document.getElementById("coupon").value;
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (subtotal <= 0) {
    showToast("Add items to cart before applying coupon");
    return;
  }

  if (couponApplied) {
    showToast("Coupon already applied");
    return;
  }

  if (code === "SAVE10") {
    couponApplied = true;
    saveCart();
    renderCart();
    showToast("Coupon applied! 10% off on subtotal");
  } else {
    showToast("Invalid coupon code");
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Order success page
document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const total = document.getElementById("total").innerText;

  document.getElementById("cart-section").classList.add("hidden");
  document.getElementById("order-confirmation").classList.remove("hidden");

  document.getElementById("conf-name").innerText = name;
  document.getElementById("conf-email").innerText = email;
  document.getElementById("conf-address").innerText = address;
  document.getElementById("conf-total").innerText = total;

  cart = [];
  couponApplied = false; // reset coupon for next order
  saveCart();
});

renderCart();
