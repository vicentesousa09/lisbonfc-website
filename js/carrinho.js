// The products in the cart, as saved by the product page (see addToCart in main.js): a big photo, and to its right
// the name with the prices under it, "Promoção" in red over a struck-through "PVP" (like the shop cards in loja.html),
// then the size boxes and the quantity, the same as on the product page
const cartList = document.getElementById("cartList");
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
function saveCartItems(items) {
  try { localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items)); } catch {}
}
function changeCartQty(index, delta) {
  const items = getCartItems();
  const qty = Math.max(1, items[index].qty + delta);
  const change = qty - items[index].qty;
  if (!change) return;
  items[index].qty = qty;
  saveCartItems(items);
  // the header bag and "Carrinho (n)" count every unit
  try { localStorage.setItem(CART_KEY, Math.max(0, getCartCount() + change)); } catch {}
  renderCartCount();
  renderCartItems();
}
function removeCartItem(index) {
  const items = getCartItems();
  const [removed] = items.splice(index, 1);
  saveCartItems(items);
  try { localStorage.setItem(CART_KEY, Math.max(0, getCartCount() - removed.qty)); } catch {}
  renderCartCount();
  renderCartItems();
}
function changeCartSize(index, size) {
  const items = getCartItems();
  items[index].size = size;
  saveCartItems(items);
  renderCartItems();
}
function renderCartItems() {
  const items = getCartItems();
  // shipping is free for now, so the total is just the products
  document.getElementById("cartTotal").textContent = formatPrice(getCartTotal());
  cartList.hidden = items.length === 0;
  cartList.replaceChildren(...items.map((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    const img = document.createElement("img");
    img.className = "cart-item-img";
    img.src = item.img;
    img.alt = item.title;
    const info = document.createElement("div");
    info.className = "cart-item-info";
    const name = document.createElement("h2");
    name.className = "cart-item-name";
    name.textContent = item.title;
    const prices = document.createElement("div");
    prices.className = "product-price";
    const priceRow = (label, value, cls) => {
      const r = document.createElement("div");
      r.className = `price-row ${cls}`;
      const l = document.createElement("span");
      l.textContent = label;
      const v = document.createElement("strong");
      v.textContent = value;
      r.append(l, v);
      return r;
    };
    if (item.promo) prices.append(priceRow("Promoção", item.promo, "price-row--promo"));
    if (item.pvp) prices.append(priceRow("PVP", item.pvp, item.promo ? "price-row--struck" : ""));
    const sizes = document.createElement("div");
    sizes.className = "pdp-size-options";
    (item.sizes || DEFAULT_SIZES).forEach((s) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `pdp-size-btn${s === item.size ? " is-active" : ""}`;
      b.textContent = s;
      b.addEventListener("click", () => changeCartSize(index, s));
      sizes.append(b);
    });
    const qty = document.createElement("div");
    qty.className = "pdp-qty";
    qty.innerHTML = `
      <button type="button" class="pdp-qty-btn" aria-label="Diminuir quantidade">&minus;</button>
      <span class="pdp-qty-value"></span>
      <button type="button" class="pdp-qty-btn" aria-label="Aumentar quantidade">+</button>`;
    qty.querySelector(".pdp-qty-value").textContent = item.qty;
    const [minus, plus] = qty.querySelectorAll(".pdp-qty-btn");
    minus.addEventListener("click", () => changeCartQty(index, -1));
    plus.addEventListener("click", () => changeCartQty(index, 1));
    // products on sale get a "Promoção" tag above the name
    if (item.promo) {
      const tag = document.createElement("p");
      tag.className = "cart-item-tag";
      tag.textContent = "Promoção";
      info.append(tag);
    }
    info.append(name, prices, sizes, qty);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "cart-clear cart-item-remove";
    remove.textContent = "Remover";
    remove.addEventListener("click", () => removeCartItem(index));
    row.append(img, info, remove);
    return row;
  }));
}
renderCartItems();

// "Limpar Carrinho" empties the cart: the count and the products live in localStorage (see CART_KEY in main.js)
document.getElementById("cartClear").addEventListener("click", () => {
  try {
    localStorage.setItem(CART_KEY, 0);
    localStorage.removeItem(CART_ITEMS_KEY);
  } catch {}
  renderCartCount();
  renderCartItems();
});
