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

// Order summary: each product in a grey card (small photo, "Promoção" tag, name, "1x / M", prices); "Alterar" opens the
// card taller to show the size boxes and the quantity, the same as in the cart, saved straight away ("Fechar" then closes it again)
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const items = getCartItems();
function saveCartItems() {
  try { localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items)); } catch {}
}
function renderTotal() {
  // shipping is free for now, so the total is just the products (promotion price when there is one)
  document.getElementById("coTotal").textContent = formatPrice(
    items.reduce((sum, item) => sum + parsePrice(item.promo || item.pvp) * item.qty, 0)
  );
}
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
  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "co-product-edit";
  edit.setAttribute("aria-expanded", "false");
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
  // (the options, hidden until "Alterar": the size boxes, then the quantity)
  const options = document.createElement("div");
  options.className = "co-product-options";
  const optionsInner = document.createElement("div");
  const sizes = document.createElement("div");
  sizes.className = "pdp-size-options";
  (item.sizes || DEFAULT_SIZES).forEach((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `pdp-size-btn${s === item.size ? " is-active" : ""}`;
    b.textContent = s;
    b.addEventListener("click", () => {
      item.size = s;
      saveCartItems();
      sizes.querySelectorAll(".pdp-size-btn").forEach((x) => x.classList.toggle("is-active", x === b));
      meta.textContent = `${item.qty}x / ${item.size}`;
      // (picking a size closes the card again)
      setEditing(false);
    });
    sizes.append(b);
  });
  const qty = document.createElement("div");
  qty.className = "pdp-qty";
  qty.innerHTML = `
    <button type="button" class="pdp-qty-btn" aria-label="Diminuir quantidade">&minus;</button>
    <span class="pdp-qty-value"></span>
    <button type="button" class="pdp-qty-btn" aria-label="Aumentar quantidade">+</button>`;
  // (the quantity only changes once "Actualizar", shown beside the + while it differs from the cart, is clicked)
  const update = document.createElement("button");
  update.type = "button";
  update.className = "co-product-update";
  update.textContent = "Actualizar";
  update.hidden = true;
  qty.append(update);
  const qtyValue = qty.querySelector(".pdp-qty-value");
  let pending = item.qty;
  const showPending = () => {
    qtyValue.textContent = pending;
    update.hidden = pending === item.qty;
  };
  showPending();
  const [minus, plus] = qty.querySelectorAll(".pdp-qty-btn");
  minus.addEventListener("click", () => { pending = Math.max(1, pending - 1); showPending(); });
  plus.addEventListener("click", () => { pending += 1; showPending(); });
  update.addEventListener("click", () => {
    const change = pending - item.qty;
    item.qty = pending;
    saveCartItems();
    // the header bag counts every unit
    const total = Math.max(0, getCartCount() + change);
    try { localStorage.setItem(CART_KEY, total); } catch {}
    document.querySelectorAll("[data-co-count]").forEach((el) => { el.textContent = total > 99 ? "99+" : total; });
    meta.textContent = `${item.qty}x / ${item.size}`;
    renderTotal();
    setEditing(false);
  });
  optionsInner.append(sizes, qty);
  options.append(optionsInner);
  function setEditing(open) {
    card.classList.toggle("is-editing", open);
    edit.setAttribute("aria-expanded", String(open));
    edit.textContent = open ? "Fechar" : "Alterar";
    // (closed without "Actualizar", the quantity goes back to the one in the cart)
    pending = item.qty;
    showPending();
  }
  edit.addEventListener("click", () => setEditing(!card.classList.contains("is-editing")));
  text.append(head, meta, prices, options);
  card.append(img, text);
  return card;
}));
coProducts.hidden = items.length === 0;
renderTotal();

// "Ver detalhes" under the total: a popup splitting the total into its price without VAT and the VAT (23%, the rate in
// Portugal Continental); the page under it is dimmed but not the header; closed by its X, a click outside it or Esc
const ivaLink = document.getElementById("coIvaLink");
if (ivaLink) {
  const modal = document.createElement("div");
  modal.className = "captcha-modal iva-modal";
  modal.hidden = true;
  modal.innerHTML = `<div class="iva-modal-box" role="dialog" aria-modal="true" aria-labelledby="ivaModalTitle">
  <button type="button" class="iva-modal-close" aria-label="Fechar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
  <h2 id="ivaModalTitle">IVA à taxa em vigor</h2>
  <div class="cart-summary iva-modal-rows">
    <p><span>Total sem IVA</span><span data-iva="net"></span></p>
    <p><span>IVA</span><span data-iva="vat"></span></p>
    <p class="cart-summary-total"><span>Total</span><span data-iva="total"></span></p>
  </div>
</div>`;
  document.body.append(modal);
  // (closing, the popup and the dimmed page fade out together before it is hidden)
  const close = () => {
    if (modal.classList.contains("is-faded")) return;
    modal.classList.add("is-faded");
    setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove("is-faded");
      document.body.classList.remove("iva-modal-open");
      ivaLink.focus();
    }, 400);
  };
  ivaLink.addEventListener("click", (e) => {
    e.preventDefault();
    const total = parsePrice(document.getElementById("coTotal").textContent);
    const net = Math.round((total / 1.23) * 100) / 100;
    modal.querySelector("[data-iva=net]").textContent = formatPrice(net);
    modal.querySelector("[data-iva=vat]").textContent = formatPrice(total - net);
    modal.querySelector("[data-iva=total]").textContent = formatPrice(total);
    // (opening, they fade in the same way: shown faded, then the fade taken off on the next frame)
    modal.classList.add("is-faded");
    modal.hidden = false;
    document.body.classList.add("iva-modal-open");
    modal.offsetWidth;
    modal.classList.remove("is-faded");
    modal.querySelector(".iva-modal-close").focus();
  });
  modal.querySelector(".iva-modal-close").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) close(); });
}
