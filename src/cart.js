let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
        <p>$${item.price}</p>
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
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("tax").textContent = tax.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

function applyCoupon() {
  const code = document.getElementById("coupon").value;
  if (code === "SAVE10") {
    cart = cart.map(item => ({ ...item, price: item.price * 0.9 }));
    saveCart();
    renderCart();
    alert("Coupon applied! 10% off");
  } else {
    alert("Invalid coupon code");
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

//order success page 
document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form data
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const total = document.getElementById("total").innerText;

  // Hide cart section
  document.getElementById("cart-section").classList.add("hidden");

  // Show confirmation section
  document.getElementById("order-confirmation").classList.remove("hidden");

  // Fill confirmation details
  document.getElementById("conf-name").innerText = name;
  document.getElementById("conf-email").innerText = email;
  document.getElementById("conf-address").innerText = address;
  document.getElementById("conf-total").innerText = total;

  // Empty cart after order
  cart = [];
  saveCart();
});


renderCart();
