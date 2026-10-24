const menuToggle = document.querySelector(".menu-toggle");
const megaMenu = document.getElementById("megaMenu");
const megaClose = document.querySelector(".mega-close");
const megaPanel = document.querySelector(".mega-menu-panel");

// Laptop: the close button is drawn like the menu icon (see .mega-close in style.css) and sits right on top of it,
// so it lives outside the sliding panel; desktop keeps it inside the panel
megaClose.appendChild(menuToggle.querySelector("svg").cloneNode(true));
const laptopQuery = window.matchMedia("(min-width: 901px) and (max-width: 1599px)");
function placeMegaClose() {
  if (laptopQuery.matches) megaMenu.appendChild(megaClose);
  else megaPanel.prepend(megaClose);
}
placeMegaClose();
laptopQuery.addEventListener("change", placeMegaClose);

function openMenu(e) {
  // line the close button up with whichever menu icon was clicked (big header or compact one)
  const toggle = e && e.currentTarget instanceof Element ? e.currentTarget : menuToggle;
  megaOpenedFrom = toggle;
  closeSearchOverlay();
  const r = toggle.getBoundingClientRect();
  megaClose.style.setProperty("--toggle-top", `${r.top}px`);
  megaClose.style.setProperty("--toggle-left", `${r.left}px`);
  clearTimeout(megaClosingTimer);
  megaClose.classList.remove("is-closing");
  // the menu icon folds into the cross (.is-opening in style.css)
  megaClose.classList.add("is-opening");
  clearTimeout(megaOpeningTimer);
  megaOpeningTimer = setTimeout(() => megaClose.classList.remove("is-opening"), 350);
  document.querySelectorAll(".mega-secondary-group").forEach(closeSubpanels);
  megaMenu.classList.add("open");
  document.body.style.setProperty("--scrollbar-w", `${window.innerWidth - document.documentElement.clientWidth}px`);
  document.body.classList.add("mega-open");
  menuToggle.setAttribute("aria-expanded", "true");
  moveIndicator(false);
}
function closeMenu() {
  megaMenu.classList.remove("open");
  document.body.classList.remove("mega-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", openMenu);
let megaClosingTimer;
let megaOpeningTimer;
let megaOpenedFrom = menuToggle;
// the browser only re-checks :hover when the mouse moves, so after closing, the menu icon under the mouse would show
// its plain look until then; .is-hovered holds the hover look until the mouse moves (the real :hover takes over from there)
function releaseHeldHover(e) {
  if (e.target.closest(".mega-close")) return;
  document.querySelectorAll(".menu-toggle.is-hovered").forEach((t) => t.classList.remove("is-hovered"));
  document.removeEventListener("mousemove", releaseHeldHover);
}
// clicking the cross plays its own fold back into the menu icon (.is-closing in style.css), kept until the menu has gone
megaClose.addEventListener("click", () => {
  clearTimeout(megaOpeningTimer);
  megaClose.classList.remove("is-opening");
  megaOpenedFrom.classList.add("is-hovered");
  document.addEventListener("mousemove", releaseHeldHover);
  megaClose.classList.add("is-closing");
  closeMenu();
  clearTimeout(megaClosingTimer);
  megaClosingTimer = setTimeout(() => megaClose.classList.remove("is-closing"), 350);
});
megaMenu.addEventListener("click", (e) => {
  if (e.target === megaMenu) closeMenu();
});

// One underline for the whole left column (laptop only, see .mega-indicator in style.css), so it can slide between options
const megaPrimary = document.querySelector(".mega-primary");
const megaIndicator = document.createElement("span");
megaIndicator.className = "mega-indicator";
megaPrimary.appendChild(megaIndicator);

function moveIndicator(animate) {
  const active = megaPrimary.querySelector(".mega-primary-link.active");
  if (!active) return;
  megaIndicator.classList.toggle("is-animated", animate);
  megaIndicator.style.transform = `translateY(${active.offsetTop + active.offsetHeight - 8}px)`;
}
moveIndicator(false);
window.addEventListener("resize", () => moveIndicator(false));

document.querySelectorAll(".mega-primary-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    if (link.classList.contains("active")) return;
    const target = link.dataset.target;

    document.querySelectorAll(".mega-primary-link").forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    moveIndicator(true);

    document.querySelectorAll(".mega-secondary-group").forEach((g) => {
      const isTarget = g.dataset.group === target;
      g.classList.toggle("active", isTarget);
      // the new list slides in from the left
      g.classList.toggle("is-entering", isTarget);
      closeSubpanels(g);
    });
  });
});

document.querySelectorAll(".mega-secondary-group").forEach((g) => {
  g.addEventListener("animationend", () => g.classList.remove("is-entering"));
});

document.querySelectorAll(".mega-secondary-group a:not(.mega-subtoggle)").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Options with sub-options (e.g. Agora / Futebol / Eventos): clicking one slides its sub-list in over the list.
// "is-animated" is only added for clicks, so resetting (menu reopened, other category) happens instantly.
function closeSubpanels(group) {
  group.querySelectorAll(".mega-subpanel").forEach((p) => p.classList.remove("active", "is-animated"));
}

document.querySelectorAll(".mega-subtoggle").forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const group = toggle.closest(".mega-secondary-group");
    // a toggle inside a sub-list (e.g. Equipamentos > Principal) slides its list over that sub-list, which stays open underneath
    const parentPanel = toggle.closest(".mega-subpanel");
    group.querySelectorAll(".mega-subpanel").forEach((p) => {
      if (p === parentPanel) return;
      p.classList.add("is-animated");
      p.classList.toggle("active", p.dataset.sub === toggle.dataset.sub);
    });
  });
});

document.querySelectorAll(".mega-subback").forEach((btn) => {
  btn.addEventListener("click", () => {
    const panel = btn.closest(".mega-subpanel");
    panel.classList.add("is-animated");
    panel.classList.remove("active");
  });
});

const searchToggle = document.querySelector(".search-toggle");
const searchBar = document.getElementById("searchBar");

// Laptop: the search icon opens a full-page white search screen below the header's top row instead of the small bar
const searchOverlay = document.createElement("div");
searchOverlay.className = "search-overlay";
searchOverlay.innerHTML = `
  <div class="search-overlay-inner">
    <form action="pesquisa.html" role="search" class="search-overlay-form">
      <input type="search" name="q" class="search-overlay-input" placeholder="O que procuras?" aria-label="O que procuras?" autocomplete="off">
      <button type="submit" class="search-overlay-btn" aria-label="Pesquisar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 5 16 12 9 19"/></svg>
      </button>
    </form>
    <nav class="search-suggestions search-suggestions--default" aria-label="Sugestões">
      <a href="pesquisa.html?q=Camisola%20Oficial">Camisola Oficial</a>
      <a href="pesquisa.html?q=Cachecol">Cachecol</a>
      <a href="pesquisa.html?q=Bilhetes">Bilhetes</a>
      <a href="pesquisa.html?q=S%C3%B3cios">Sócios</a>
      <a href="pesquisa.html?q=Equipa%20Principal">Equipa Principal</a>
    </nav>
    <div class="search-typed">
      <div class="search-typed-col">
        <p class="search-typed-title">Sugestões</p>
        <nav class="search-suggestions search-typed-list" aria-label="Sugestões"></nav>
        <a class="search-typed-all" href="pesquisa.html">Ver Todos</a>
      </div>
      <div class="search-typed-col search-products">
        <p class="search-typed-title">Produtos</p>
        <div class="search-products-list"></div>
      </div>
    </div>
  </div>`;
document.body.appendChild(searchOverlay);
const searchOverlayInput = searchOverlay.querySelector("input");
const searchTypedList = searchOverlay.querySelector(".search-typed-list");
// Enter goes to the results page (pesquisa.html); nothing typed, nothing to search
searchOverlay.querySelector("form").addEventListener("submit", (e) => {
  if (!searchOverlayInput.value.trim()) e.preventDefault();
});

// What can be suggested while typing: shop items, club pages and the players
const SEARCH_TERMS = [
  "Camisola Oficial", "Camisola Principal", "Camisola Alternativa", "Camisola de Guarda-Redes", "Camisola de Treino",
  "Camisola Manga Comprida", "Equipamentos", "Cachecol", "Bonés", "Mochilas", "Meias", "T-shirts", "Casacos",
  "Sweatshirts", "Polos", "Calções", "Loja Oficial", "Bilhetes", "Calendário", "Match Center", "Sócios", "Quotas",
  "Débito Direto", "My Lisbon FC", "Equipa Principal", "Plantel", "Notícias", "Vídeos", "Fotos", "Golos", "Supertaça",
  "Alfredo Bidarra", "Daria Vinokurova", "Duarte Silva", "Eduardo Sanchez", "Gonçalo Pereira", "Gonçalo Rodrigues",
  "Martim Neves", "Vicente Sousa",
];
const plainText = (text) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
// terms where a word starts with what's typed come first, then terms that contain it anywhere
function searchSuggestions(typed) {
  const t = plainText(typed.trim());
  const starts = SEARCH_TERMS.filter((term) => plainText(term).split(/[\s-]+/).some((w) => w.startsWith(t)) || plainText(term).startsWith(t));
  const contains = SEARCH_TERMS.filter((term) => !starts.includes(term) && plainText(term).includes(t));
  return [...starts, ...contains];
}
// the typed part of a suggestion in bold (at the start of a word if it's there, otherwise wherever it appears);
// accents are ignored for finding it, and removing them keeps the letters in the same places
function boldTyped(term, typed) {
  const plain = plainText(term);
  const t = plainText(typed.trim());
  let at = plain.search(new RegExp(`(^|[\\s-])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  if (at > 0 && /[\s-]/.test(plain[at])) at += 1;
  if (at < 0) at = plain.indexOf(t);
  const strong = document.createElement("strong");
  if (at < 0 || !t) return [document.createTextNode(term)];
  strong.textContent = term.slice(at, at + t.length);
  return [document.createTextNode(term.slice(0, at)), strong, document.createTextNode(term.slice(at + t.length))];
}

// once something is typed: the arrow (like the results page's) shows, and the usual suggestions give way to
// "Sugestões" that follow the typing
searchOverlayInput.addEventListener("input", () => {
  const typed = searchOverlayInput.value.trim();
  searchOverlay.classList.toggle("has-text", typed !== "");
  if (!typed) return;
  const found = searchSuggestions(typed);
  searchTypedList.replaceChildren(...found.map((term) => {
    const a = document.createElement("a");
    a.href = `pesquisa.html?q=${encodeURIComponent(term)}`;
    a.append(...boldTyped(term, typed));
    return a;
  }));
  // nothing to suggest: only the title and "Ver Todos" stay; it always searches exactly what's typed
  searchOverlay.classList.toggle("no-suggestions", found.length === 0);
  searchOverlay.querySelector(".search-typed-all").href = `pesquisa.html?q=${encodeURIComponent(typed)}`;
  renderSearchProducts();
  fitTypedSuggestions();
});

// "Produtos" on the right: the shop's products whose name has what's typed, read once from the shop pages
const SEARCH_SHOP_PAGES = [
  "loja.html", "homem.html", "mulher.html", "crianca.html",
  "colecao-equipamentos.html", "colecao-principal-adulto.html", "colecao-principal-crianca.html",
  "colecao-guarda-redes.html", "colecao-guarda-redes-adulto.html", "colecao-guarda-redes-crianca.html",
  "colecao-acessorios.html", "colecao-linha-de-treino.html", "colecao-2-anos.html", "colecao-supertaca-2024.html",
  "categoria-tshirts.html", "categoria-casacos.html", "categoria-sweatshirt.html", "categoria-polos.html",
  "categoria-calcoes.html", "categoria-meias.html", "categoria-cachecois.html", "categoria-bones.html",
  "categoria-mochilas.html", "categoria-crianca-tshirts.html", "categoria-crianca-casacos.html",
  "categoria-crianca-sweats.html", "categoria-crianca-polos.html", "categoria-crianca-calcoes.html",
];
const searchProductsList = searchOverlay.querySelector(".search-products-list");
let searchProducts = null;
function loadSearchProducts() {
  if (searchProducts) return;
  searchProducts = [];
  const seen = new Set();
  Promise.all(SEARCH_SHOP_PAGES.map((url) => fetch(url).then((r) => (r.ok ? r.text() : "")).catch(() => ""))).then((pages) => {
    pages.forEach((html) => {
      new DOMParser().parseFromString(html, "text/html").querySelectorAll(".product-card").forEach((card) => {
        const link = card.querySelector("a[href]");
        const h3 = card.querySelector("h3");
        h3?.querySelectorAll("br").forEach((br) => br.replaceWith(" "));
        const name = h3?.textContent.replace(/\s+/g, " ").trim();
        if (!link || !name || seen.has(name)) return;
        seen.add(name);
        searchProducts.push({
          name,
          href: link.getAttribute("href"),
          front: card.querySelector(".product-image-front"),
          pvp: card.querySelector(".price-row--pvp strong, .price-row--struck strong")?.textContent.trim() || "",
          promo: card.querySelector(".price-row--promo strong")?.textContent.trim() || "",
        });
      });
    });
    if (searchOverlay.classList.contains("has-text")) {
      renderSearchProducts();
      fitTypedSuggestions();
    }
  });
}
// every typed word has to be in the name ("camisolas" also finds "camisola"); names starting a word with it come first
function matchSearchProducts(typed) {
  const words = plainText(typed).split(/\s+/).filter(Boolean).map((w) => (w.length > 4 ? w.replace(/(es|s)$/, "") : w));
  const found = (searchProducts || []).filter((p) => words.every((w) => plainText(p.name).includes(w)));
  const startsWord = (p) => plainText(p.name).split(/[\s-]+/).some((w) => w.startsWith(words[0]));
  return [...found.filter(startsWord), ...found.filter((p) => !startsWord(p))];
}
function renderSearchProducts() {
  const typed = searchOverlayInput.value.trim();
  const found = matchSearchProducts(typed);
  // two rows of two at most
  searchProductsList.replaceChildren(...found.slice(0, 4).map((p) => {
    const a = document.createElement("a");
    a.className = "search-product";
    a.href = p.href;
    const img = document.createElement("span");
    img.className = "search-product-img";
    if (p.front) img.append(p.front.cloneNode(true));
    const name = document.createElement("span");
    name.className = "search-product-name";
    name.textContent = p.name;
    // "PVP" with the price on the right; on sale, that price is struck and "Promoção" with the new price goes under it
    const priceRow = (label, value, cls) => {
      const row = document.createElement("span");
      row.className = `search-product-price ${cls}`;
      const l = document.createElement("span");
      l.textContent = label;
      const v = document.createElement("span");
      v.textContent = value;
      row.append(l, v);
      return row;
    };
    const text = document.createElement("span");
    text.className = "search-product-text";
    text.append(name);
    if (p.pvp) text.append(priceRow("PVP", p.pvp, p.promo ? "is-struck" : ""));
    if (p.promo) text.append(priceRow("Promoção", p.promo, "is-promo"));
    a.append(img, text);
    return a;
  }));
  // no products for this search: only the "Produtos" title stays
  searchOverlay.classList.toggle("no-products", found.length === 0);
}

// the prices end where the product name ends: the text column shrinks to the name's longest line
function alignProductPrices() {
  searchProductsList.querySelectorAll(".search-product-text").forEach((text) => {
    text.style.flex = "";
    const range = document.createRange();
    range.selectNodeContents(text.querySelector(".search-product-name"));
    const right = Math.max(...[...range.getClientRects()].map((r) => r.right));
    if (right > 0) text.style.flex = `0 0 ${Math.ceil(right - text.getBoundingClientRect().left) + 1}px`;
  });
}

// "Ver Todos" always stays on screen: drop suggestions from the end until it fits above the bottom of the window;
// the products the same way, so the last one isn't cut off
function fitTypedSuggestions() {
  alignProductPrices();
  const fits = (el) => el.getBoundingClientRect().bottom <= window.innerHeight - 24;
  const all = searchOverlay.querySelector(".search-typed-all");
  searchTypedList.querySelectorAll("a").forEach((a) => { a.style.display = ""; });
  const shown = [...searchTypedList.querySelectorAll("a")];
  while (shown.length && !fits(all)) shown.pop().style.display = "none";
  const products = [...searchProductsList.children];
  products.forEach((p) => { p.style.display = ""; });
  while (products.length && !fits(products[products.length - 1])) products.pop().style.display = "none";
}
window.addEventListener("resize", () => {
  if (searchOverlay.classList.contains("has-text")) fitTypedSuggestions();
});

function openSearchOverlay() {
  // start right under whichever top row is showing: the compact header once scrolled down (its bottom border stays visible),
  // otherwise the main one, 1px lower so the divider line under the logo stays visible
  const compact = document.querySelector(".header-compact.is-visible");
  const bottom = compact
    ? compact.getBoundingClientRect().bottom
    : document.querySelector(".site-header .header-top-inner").getBoundingClientRect().bottom + 1;
  searchOverlay.style.top = `${Math.max(0, bottom)}px`;
  document.body.style.setProperty("--scrollbar-w", `${window.innerWidth - document.documentElement.clientWidth}px`);
  document.body.classList.add("search-open");
  searchOverlay.classList.add("open");
  searchToggle.setAttribute("aria-expanded", "true");
  loadSearchProducts();
  searchOverlayInput.focus();
}
function closeSearchOverlay() {
  document.body.classList.remove("search-open");
  searchOverlay.classList.remove("open");
  searchToggle.setAttribute("aria-expanded", "false");
}
function toggleSearchOverlay() {
  if (searchOverlay.classList.contains("open")) closeSearchOverlay();
  else openSearchOverlay();
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && searchOverlay.classList.contains("open")) closeSearchOverlay();
});

searchToggle.addEventListener("click", () => {
  if (laptopQuery.matches) {
    toggleSearchOverlay();
    return;
  }
  const isOpen = searchBar.classList.toggle("open");
  searchToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) searchBar.querySelector("input").focus();
});

// Compact header: a smaller copy of the top row that slides in once the main header
// has scrolled away (only shown on laptop widths, see .header-compact in style.css)
const siteHeader = document.querySelector(".site-header");
const headerTopInner = document.querySelector(".header-top-inner");
if (siteHeader && headerTopInner) {
  const compactHeader = document.createElement("div");
  compactHeader.className = "header-compact";
  compactHeader.appendChild(headerTopInner.cloneNode(true));
  document.body.appendChild(compactHeader);

  // keep the cloned cart clip-path id unique
  const compactClip = compactHeader.querySelector("#cartBagClip");
  if (compactClip) {
    compactClip.id = "cartBagClipCompact";
    compactHeader.querySelector('[clip-path="url(#cartBagClip)"]').setAttribute("clip-path", "url(#cartBagClipCompact)");
  }

  compactHeader.querySelector(".menu-toggle").addEventListener("click", openMenu);
  compactHeader.querySelector(".search-toggle").addEventListener("click", () => {
    if (laptopQuery.matches) {
      toggleSearchOverlay();
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!searchBar.classList.contains("open")) searchToggle.click();
  });

  function updateCompactHeader() {
    compactHeader.classList.toggle("is-visible", siteHeader.getBoundingClientRect().bottom <= 0);
  }
  window.addEventListener("scroll", updateCompactHeader, { passive: true });
  updateCompactHeader();
}

function initCarousel(containerSelector, prevSelector, nextSelector, intervalMs) {
  const container = document.querySelector(containerSelector);
  const slides = container.querySelectorAll(".hero-slide");
  let index = 0;

  function show(i) {
    slides[index].classList.remove("active");
    index = (i + slides.length) % slides.length;
    slides[index].classList.add("active");
  }

  container.querySelector(nextSelector).addEventListener("click", () => show(index + 1));
  container.querySelector(prevSelector).addEventListener("click", () => show(index - 1));

  setInterval(() => show(index + 1), intervalMs);
}

if (document.querySelector("#heroFeature")) {
  initCarousel("#heroFeature", ".hero-feature-prev", ".hero-feature-next", 6000);
  initCarousel("#heroPromo", ".hero-promo-prev", ".hero-promo-next", 7000);
}

if (document.querySelector("#sociosNewsCarousel")) {
  initCarousel("#sociosNewsCarousel", ".socios-news-prev", ".socios-news-next", 6500);
}

const fixturesRow = document.getElementById("fixturesRow");
if (fixturesRow) {
  const fixtureCards = fixturesRow.querySelectorAll(".fixture-card");
  const fixturesPrevBtn = document.querySelector(".fixtures-prev");
  const fixturesNextBtn = document.querySelector(".fixtures-next");
  let fixtureIndex = 0;

  function updateFixtureArrows() {
    fixturesPrevBtn.classList.toggle("is-disabled", fixtureIndex === 0);
    fixturesNextBtn.classList.toggle("is-disabled", fixtureIndex === fixtureCards.length - 1);
  }

  function showFixture(i) {
    fixtureIndex = Math.max(0, Math.min(i, fixtureCards.length - 1));
    fixtureCards[fixtureIndex].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    updateFixtureArrows();
  }

  fixturesNextBtn.addEventListener("click", () => showFixture(fixtureIndex + 1));
  fixturesPrevBtn.addEventListener("click", () => showFixture(fixtureIndex - 1));

  updateFixtureArrows();
}

// Cart count, kept in localStorage so the header bag shows it on every page
const CART_KEY = "lfcCartCount";
function getCartCount() {
  try { return parseInt(localStorage.getItem(CART_KEY), 10) || 0; } catch { return 0; }
}
function renderCartCount() {
  const n = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = n > 99 ? "99+" : n;
  });
}
function addToCart(qty = 1) {
  try { localStorage.setItem(CART_KEY, getCartCount() + qty); } catch {}
  renderCartCount();
}
renderCartCount();
