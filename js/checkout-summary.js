// Shared by the two checkout steps (checkout.html, pagamento.html): they have their own small header and footer and
// don't load main.js, so this reads the cart straight from localStorage, using the same keys and price format as
// main.js (CART_KEY, CART_ITEMS_KEY), and fills in the header bag count and the order summary on the right
const CART_KEY = "lfcCartCount";
const CART_ITEMS_KEY = "lfcCartItems";
function getCartCount() {
  try { return parseInt(localStorage.getItem(CART_KEY), 10) || 0; } catch { return 0; }
}
function getCartItems() {
  try { return JSON.parse(localStorage.getItem(CART_ITEMS_KEY)) || []; } catch { return []; }
}
function parsePrice(text) {
  return parseFloat(String(text || "").replace(/[^\d,]/g, "").replace(",", ".")) || 0;
}
function formatPrice(value) {
  return `${value.toFixed(2).replace(".", ",")}€`;
}

// Header bag count
const count = getCartCount();
document.querySelectorAll("[data-co-count]").forEach((el) => { el.textContent = count > 99 ? "99+" : count; });

// Order summary: each product in a grey card (small photo, "Promoção" tag, name, "1x / M", prices, "Alterar" back to the cart)
const items = getCartItems();
const coProducts = document.getElementById("coProducts");
coProducts.replaceChildren(...items.map((item) => {
  const card = document.createElement("div");
  card.className = "co-product";
  const img = document.createElement("img");
  img.src = item.img;
  img.alt = item.title;
  const text = document.createElement("div");
  text.className = "co-product-text";
  const head = document.createElement("div");
  head.className = "co-product-head";
  const titles = document.createElement("div");
  if (item.promo) {
    const tag = document.createElement("p");
    tag.className = "co-product-tag";
    tag.textContent = "Promoção";
    titles.append(tag);
  }
  const name = document.createElement("h2");
  name.className = "co-product-name";
  name.textContent = item.title;
  titles.append(name);
  const edit = document.createElement("a");
  edit.className = "co-product-edit";
  edit.href = "carrinho.html";
  edit.textContent = "Alterar";
  head.append(titles, edit);
  const meta = document.createElement("span");
  meta.className = "co-product-meta";
  meta.textContent = `${item.qty}x / ${item.size}`;
  const prices = document.createElement("div");
  prices.className = "co-product-prices";
  const row = (label, value, cls) => {
    const p = document.createElement("p");
    p.className = cls;
    const l = document.createElement("span");
    l.textContent = label;
    const v = document.createElement("span");
    v.textContent = value;
    p.append(l, v);
    return p;
  };
  if (item.promo) prices.append(row("Promoção", item.promo, "is-promo"));
  // the members' price, in blue, over the PVP (saved by the product page from its "Sócio" line)
  if (item.socio) prices.append(row("Sócio", item.socio, "is-socio"));
  if (item.pvp) prices.append(row("PVP", item.pvp, item.promo ? "is-struck" : ""));
  text.append(head, meta, prices);
  card.append(img, text);
  return card;
}));
coProducts.hidden = items.length === 0;
// shipping is free for now, so the total is just the products (promotion price when there is one)
document.getElementById("coTotal").textContent = formatPrice(
  items.reduce((sum, item) => sum + parsePrice(item.promo || item.pvp) * item.qty, 0)
);
