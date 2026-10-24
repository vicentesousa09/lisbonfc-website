// Search results page (pesquisa.html?q=...): reads the products, news, photos and videos straight from the site's own
// pages, keeps the ones that mention a word from the search, and shows them in sections with tabs, like a site search.

const SHOP_PAGES = [
  "loja.html", "homem.html", "mulher.html", "crianca.html",
  "colecao-equipamentos.html", "colecao-principal-adulto.html", "colecao-principal-crianca.html",
  "colecao-guarda-redes.html", "colecao-guarda-redes-adulto.html", "colecao-guarda-redes-crianca.html",
  "colecao-acessorios.html", "colecao-linha-de-treino.html", "colecao-2-anos.html", "colecao-supertaca-2024.html",
  "categoria-tshirts.html", "categoria-casacos.html", "categoria-sweatshirt.html", "categoria-polos.html",
  "categoria-calcoes.html", "categoria-meias.html", "categoria-cachecois.html", "categoria-bones.html",
  "categoria-mochilas.html", "categoria-crianca-tshirts.html", "categoria-crianca-casacos.html",
  "categoria-crianca-sweats.html", "categoria-crianca-polos.html", "categoria-crianca-calcoes.html",
];

// pages of the site itself (keywords help short searches like "Bilhetes" find them):
// "Serviços" are the things a fan can do (become a member, pay, buy). "Outros" lists all of these pages,
// services included; the Serviços tab shows just the services
const SERVICE_PAGES = [
  { href: "my-lisbon-fc.html", title: "My Lisbon FC", desc: "Faz-te sócio, paga as quotas e conhece todas as vantagens de ser sócio do Lisbon FC.", keywords: "sócios socio quotas adesão cartão" },
  { href: "socios.html", title: "Vantagens ao ser Sócio", desc: "Descontos, prioridade na compra de bilhetes e muito mais para quem é sócio.", keywords: "sócios socio vantagens descontos bilhetes" },
  { href: "debito-direto.html", title: "Débito Direto", desc: "Adere ao Débito Direto e paga as tuas quotas de sócio automaticamente.", keywords: "sócios socio quotas pagamento" },
  { href: "calendario.html", title: "Bilhetes e Calendário", desc: "Todos os jogos do Lisbon FC, com datas, horários e bilhetes.", keywords: "bilhetes jogos calendário futebol" },
  { href: "loja.html", title: "Loja Oficial", desc: "Equipamentos, moda, presentes e acessórios oficiais do Lisbon FC.", keywords: "loja camisola equipamentos cachecol produtos" },
];
const OTHER_PAGES = [
  { href: "equipa.html", title: "Equipa Principal", desc: "Conhece o plantel do Lisbon FC: jogadores, posições e números.", keywords: "equipa plantel jogadores futebol" },
  { href: "match-center.html", title: "Match Center", desc: "Acompanha os jogos do Lisbon FC ao minuto.", keywords: "jogos resultados futebol bilhetes" },
  { href: "noticias.html", title: "Notícias", desc: "As últimas notícias do Lisbon FC.", keywords: "notícias clube" },
  { href: "videos.html", title: "Vídeos e Fotos", desc: "Resumos, golos, entrevistas e galerias de fotos do Lisbon FC.", keywords: "vídeos fotos golos resumos lisbonfc tv" },
];

const SECTIONS = ["produtos", "noticias", "fotos", "videos", "outros", "servicos", "jogadores"];
// sections only shown on their own tab (Serviços would repeat pages already in Outros)
const TAB_ONLY = ["servicos"];
// how many each section shows on the "Todos" tab (one or two rows)
const PREVIEW = { produtos: 6, noticias: 8, fotos: 4, videos: 8, outros: 4, servicos: 4, jogadores: 6 };
// items per row in each section, for "Ver mais" on a single tab
const ROW = { produtos: 6, noticias: 4, fotos: 4, videos: 4, outros: 2, servicos: 2, jogadores: 6 };

const srQuery = document.getElementById("srQuery");
const srCount = document.getElementById("srCount");
const srEmpty = document.getElementById("srEmpty");

let currentTab = "todos";
let currentSort = "relevante";
// how many items the open tab shows (grows a row with each "Ver mais")
let tabShown = 0;
// how many items each section shows on "Todos" (each grows a row with its "Ver mais")
let todosShown = { ...PREVIEW };
let results = Object.fromEntries(SECTIONS.map((key) => [key, []]));

// "Camisolas" and "camisola", "Sócios" and "socios" should all match
function normalize(text) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
// match a word or its singular/plural ("camisola" finds "camisolas", "cachecol" finds "cachecóis")
function stem(w) {
  return w.replace(/(oes|ois|ais|eis|es|s)$/, "").slice(0, Math.max(4, w.length - 2));
}
// the current search: its text, its words (3+ letters) and their stems
let query = "";
let words = [];
let stems = [];
function setQuery(text) {
  query = text.trim();
  words = [...new Set(normalize(query).split(/[^a-z0-9]+/).filter((w) => w.length >= 3))];
  stems = words.map(stem);
  srQuery.value = query;
  document.title = query ? `${query} | Pesquisa | Lisbon FC` : "Resultados de pesquisa | Lisbon FC";
}

function score(text) {
  const t = normalize(text);
  return stems.reduce((n, s) => n + (t.includes(s) ? 1 : 0), 0);
}

// bold the searched words inside a title
function highlight(title) {
  if (!stems.length) return escapeHtml(title);
  const norm = normalize(title);
  const marks = new Array(title.length).fill(false);
  stems.forEach((s) => {
    const re = new RegExp(`[a-z0-9]*${s}[a-z0-9]*`, "g");
    let m;
    while ((m = re.exec(norm))) for (let i = m.index; i < m.index + m[0].length; i++) marks[i] = true;
  });
  let out = "";
  let open = false;
  [...title].forEach((ch, i) => {
    if (marks[i] && !open) { out += "<strong>"; open = true; }
    if (!marks[i] && open) { out += "</strong>"; open = false; }
    out += escapeHtml(ch);
  });
  return open ? out + "</strong>" : out;
}
function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
}

async function fetchPage(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return new DOMParser().parseFromString(await res.text(), "text/html");
  } catch {
    return null;
  }
}

// reads everything searchable from the site's pages, once; later searches reuse it
let siteData = null;
function loadSite() {
  if (!siteData) siteData = readSite();
  return siteData;
}
async function readSite() {
  const [shopDocs, newsDoc, mediaDoc, teamDoc] = await Promise.all([
    Promise.all(SHOP_PAGES.map(fetchPage)),
    fetchPage("noticias.html"),
    fetchPage("videos.html"),
    fetchPage("equipa.html"),
  ]);

  // products: the same product appears on several shop pages, keep it once
  const seen = new Set();
  const produtos = [];
  shopDocs.forEach((doc) => {
    if (!doc) return;
    doc.querySelectorAll(".product-card").forEach((card) => {
      const link = card.querySelector("a[href]");
      // some names have a line break inside (do<br>Lisbon FC), which should read as a space
      const h3 = card.querySelector("h3");
      h3?.querySelectorAll("br").forEach((br) => br.replaceWith(" "));
      const name = h3?.textContent.replace(/\s+/g, " ").trim();
      if (!link || !name || seen.has(name)) return;
      seen.add(name);
      produtos.push({ title: name, href: link.getAttribute("href"), front: card.querySelector(".product-image-front"), text: name });
    });
  });

  const noticias = newsDoc
    ? [...newsDoc.querySelectorAll(".news-card")].map((card) => ({
        title: card.querySelector("h3")?.textContent.trim() || "",
        href: card.getAttribute("href"),
        tag: card.querySelector(".news-tag")?.textContent.trim() || "",
        image: card.querySelector(".news-media")?.getAttribute("style") || "",
        text: card.textContent,
      }))
    : [];

  const media = mediaDoc ? [...mediaDoc.querySelectorAll(".media-card")] : [];
  const toMedia = (card) => ({
    title: card.querySelector("h3")?.textContent.trim() || "",
    href: card.getAttribute("href"),
    tag: card.querySelector(".media-card-tag")?.textContent.trim() || "",
    thumb: card.querySelector(".media-card-thumb"),
    text: card.textContent,
  });
  const fotos = media.filter((c) => c.dataset.formato === "galeria").map(toMedia);
  const videos = media.filter((c) => c.dataset.formato === "video").map(toMedia);

  // players from the team page (name, number, position and cut-out photo)
  const jogadores = teamDoc
    ? [...teamDoc.querySelectorAll(".player-card")].map((card) => {
        const name = [card.querySelector(".player-card-first"), card.querySelector(".player-card-last")]
          .map((el) => el?.textContent.trim() || "").join(" ").trim();
        const position = card.querySelector(".player-card-position")?.textContent.trim() || "";
        return {
          title: name,
          href: card.getAttribute("href"),
          tag: position,
          number: card.querySelector(".player-card-number")?.textContent.trim() || "",
          photo: card.querySelector(".player-card-photo-front")?.getAttribute("src") || "",
          text: `${name} ${position} jogador plantel equipa`,
        };
      })
    : [];

  const toPage = (p) => ({ ...p, text: `${p.title} ${p.desc} ${p.keywords}` });
  const servicos = SERVICE_PAGES.map(toPage);
  const outros = [...SERVICE_PAGES, ...OTHER_PAGES].map(toPage);

  return { produtos, noticias, fotos, videos, servicos, jogadores, outros };
}

// keeps what matches the current search in each section
function applyQuery(all) {
  SECTIONS.forEach((key) => {
    const scored = all[key].map((item, order) => ({ ...item, order, score: score(item.text) + score(item.title) }));
    results[key] = scored.filter((item) => item.score > 0);
    // Outros always lists at least 4 club pages: the matching ones first, then others to fill the list
    if (key === "outros" && results[key].length < 4) {
      results[key].push(...scored.filter((item) => item.score === 0).slice(0, 4 - results[key].length));
    }
  });
}

function sorted(list) {
  const copy = [...list];
  if (currentSort === "relevante") copy.sort((a, b) => b.score - a.score || a.order - b.order);
  else copy.sort((a, b) => a.order - b.order);
  return copy;
}

function renderItem(key, item) {
  const a = document.createElement("a");
  a.href = item.href;
  if (key === "produtos") {
    a.className = "sr-product";
    const img = document.createElement("div");
    img.className = "sr-product-img";
    if (item.front) img.appendChild(document.importNode(item.front, true));
    a.appendChild(img);
    a.insertAdjacentHTML("beforeend", `<p class="sr-product-name">${highlight(item.title)}</p>`);
  } else if (key === "jogadores") {
    a.className = "sr-product sr-player";
    a.innerHTML = `<div class="sr-product-img"><img src="${escapeHtml(item.photo)}" alt=""></div>
      <span class="sr-card-tag">${escapeHtml(item.tag)}</span>
      <p class="sr-product-name"><span class="sr-player-number">${escapeHtml(item.number)}</span> ${highlight(item.title)}</p>`;
  } else if (key === "servicos" || key === "outros") {
    // like a news headline: a small square picture, then the title and a line of text
    a.className = "sr-other";
    a.innerHTML = `<span class="sr-other-img"><img src="Logos/Logo.png" alt=""></span>
      <span class="sr-other-text"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.desc)}</span></span>`;
  } else {
    a.className = "sr-card";
    const thumb = document.createElement("div");
    thumb.className = "sr-card-img";
    if (key === "noticias") thumb.innerHTML = `<div class="sr-card-media" style="${escapeHtml(item.image)}"></div>`;
    else if (item.thumb) thumb.appendChild(document.importNode(item.thumb, true));
    a.appendChild(thumb);
    a.insertAdjacentHTML("beforeend", `<span class="sr-card-tag">${escapeHtml(item.tag)}</span><h3>${escapeHtml(item.title)}</h3>`);
  }
  return a;
}

function render() {
  // the count follows the selected tab: everything on "Todos", otherwise just that tab's results
  const total = currentTab === "todos"
    ? SECTIONS.filter((key) => !TAB_ONLY.includes(key)).reduce((n, key) => n + results[key].length, 0)
    : results[currentTab].length;
  srCount.textContent = `${total} ${total === 1 ? "resultado encontrado" : "resultados encontrados"}`;
  srEmpty.hidden = total > 0;
  // lets the page use a smaller gap above the footer when one tab is picked (see .sr-page in style.css)
  document.querySelector(".sr-page").dataset.tab = currentTab;

  document.querySelectorAll(".sr-tab[data-tab]").forEach((tab) => {
    const key = tab.dataset.tab;
    tab.classList.toggle("is-active", key === currentTab);
    const count = tab.querySelector("span");
    if (count) count.textContent = `(${results[key].length})`;
  });
  // "Mais" shows as selected when one of its tabs is
  const moreDrop = document.querySelector(".sr-tabs .sr-drop-btn");
  moreDrop.classList.toggle("is-active", ["servicos", "noticias", "jogadores", "outros"].includes(currentTab));

  SECTIONS.forEach((key) => {
    const section = document.querySelector(`.sr-section[data-section="${key}"]`);
    const list = sorted(results[key]);
    const showSection = list.length > 0 && ((currentTab === "todos" && !TAB_ONLY.includes(key)) || currentTab === key);
    section.hidden = !showSection;
    if (!showSection) return;
    // on "Todos" the products are one row you can drag sideways (all of them), with lines showing the position
    const carousel = key === "produtos" && currentTab === "todos";
    const limit = carousel ? list.length : currentTab === "todos" ? todosShown[key] : tabShown;
    const grid = section.querySelector(".sr-grid");
    grid.classList.toggle("sr-grid--carousel", carousel);
    grid.replaceChildren(...list.slice(0, limit).map((item) => renderItem(key, item)));
    grid.scrollLeft = 0;
    section.querySelector(".sr-more").hidden = carousel || list.length <= limit;
    if (key === "produtos") updateLines();
  });
  watchReveal();
}

// Titles and results slide up into place as they scroll into view (same effect as the Match Center's
// "Notícias, fotos e vídeos" section, .mc-related-reveal); results in one row follow each other slightly
const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting)),
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    )
  : null;
function watchReveal() {
  if (!revealObserver) return;
  document.querySelectorAll(".sr-section:not([hidden])").forEach((section) => {
    const perRow = ROW[section.dataset.section] || 4;
    // the draggable product row slides up as one piece (products dragged in from the side shouldn't animate)
    const grid = section.querySelector(".sr-grid");
    const cards = grid.classList.contains("sr-grid--carousel") ? [grid] : [...grid.children];
    const items = [section.querySelector("h2"), ...cards];
    items.forEach((item, i) => {
      if (item.classList.contains("sr-reveal")) return;
      item.classList.add("sr-reveal");
      if (i > 0) item.style.transitionDelay = `${((i - 1) % perRow) * 80}ms`;
      revealObserver.observe(item);
    });
  });
}

// --- product row: drag to scroll, snapping to whole products, and the position lines ---
const productGrid = document.querySelector(".sr-grid--produtos");
const productLines = document.createElement("div");
productLines.className = "sr-lines";
productLines.setAttribute("aria-hidden", "true");
document.querySelector('.sr-section[data-section="produtos"]').appendChild(productLines);

// width of one product plus the gap, i.e. one step of the row
function productStep() {
  const first = productGrid.firstElementChild;
  return first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(productGrid).columnGap || 0) : 0;
}
// one line per position the row can stop at; the current one is black and taller
function updateLines() {
  const step = productStep();
  const isCarousel = productGrid.classList.contains("sr-grid--carousel");
  const positions = isCarousel && step ? Math.round((productGrid.scrollWidth - productGrid.clientWidth) / step) + 1 : 1;
  productLines.hidden = positions <= 1;
  if (productLines.children.length !== positions) {
    productLines.replaceChildren(...Array.from({ length: positions }, () => document.createElement("span")));
  }
  const current = step ? Math.round(productGrid.scrollLeft / step) : 0;
  [...productLines.children].forEach((line, i) => line.classList.toggle("is-active", i === current));
}
productGrid.addEventListener("scroll", updateLines, { passive: true });
// clicking a line slides the row to that position
productLines.addEventListener("click", (e) => {
  const index = [...productLines.children].indexOf(e.target);
  if (index >= 0) productGrid.scrollTo({ left: index * productStep(), behavior: "smooth" });
});
window.addEventListener("resize", updateLines);

// drag (mouse or finger): follow the pointer, then settle on the nearest product; a real drag doesn't open the product
let dragStartX = 0;
let dragStartScroll = 0;
let dragging = false;
let dragMoved = false;
productGrid.addEventListener("pointerdown", (e) => {
  if (!productGrid.classList.contains("sr-grid--carousel")) return;
  dragging = true;
  dragMoved = false;
  dragStartX = e.clientX;
  dragStartScroll = productGrid.scrollLeft;
  productGrid.classList.add("is-dragging");
});
window.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const dx = e.clientX - dragStartX;
  if (Math.abs(dx) > 5) dragMoved = true;
  productGrid.scrollLeft = dragStartScroll - dx;
});
window.addEventListener("pointerup", () => {
  if (!dragging) return;
  dragging = false;
  productGrid.classList.remove("is-dragging");
  const step = productStep();
  if (step) productGrid.scrollTo({ left: Math.round(productGrid.scrollLeft / step) * step, behavior: "smooth" });
});
productGrid.addEventListener("click", (e) => {
  if (dragMoved) {
    e.preventDefault();
    dragMoved = false;
  }
}, true);
productGrid.addEventListener("dragstart", (e) => e.preventDefault());

// tabs, "Ver mais" (opens that section's tab) and the two dropdowns
function closeDrops() {
  document.querySelectorAll(".sr-drop.is-open").forEach((d) => {
    d.classList.remove("is-open");
    d.querySelector(".sr-drop-btn").setAttribute("aria-expanded", "false");
  });
}
// picking a tab shows as much as on "Todos" (Vídeos: just one row); "Ver mais" adds another row to its own
// section, on "Todos" too (each section there keeps its own count, reset when "Todos" is picked again)
const TAB_START = { ...PREVIEW, videos: ROW.videos };
function openTab(key) {
  currentTab = key;
  if (key === "todos") todosShown = { ...PREVIEW };
  else tabShown = TAB_START[key];
  render();
}
document.querySelectorAll(".sr-tab[data-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    closeDrops();
    openTab(tab.dataset.tab);
  });
});
document.querySelectorAll(".sr-more").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.more;
    if (currentTab === "todos") todosShown[key] += ROW[key];
    else tabShown += ROW[key];
    render();
  });
});
document.querySelectorAll(".sr-sort").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentSort = btn.dataset.sort;
    document.querySelectorAll(".sr-sort").forEach((b) => b.classList.toggle("is-active", b === btn));
    closeDrops();
    render();
  });
});
document.querySelectorAll(".sr-drop-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const drop = btn.closest(".sr-drop");
    const open = !drop.classList.contains("is-open");
    closeDrops();
    drop.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  });
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".sr-drop")) closeDrops();
});

// A search: the page darkens with the loading bars while the results are found, and only then does the page
// change to show them (the address bar is updated too, no reload). The bars stay at least a moment, so a quick
// search still shows them
const srLoading = document.getElementById("srLoading");
const MIN_LOADING_MS = 700;
let searchRun = 0;
let hideLoadingTimer;
async function runSearch(text) {
  const run = ++searchRun;
  setQuery(text);
  clearTimeout(hideLoadingTimer);
  srLoading.hidden = false;
  srLoading.classList.remove("is-done");
  const started = Date.now();
  if (words.length) applyQuery(await loadSite());
  else results = Object.fromEntries(SECTIONS.map((key) => [key, []]));
  await new Promise((r) => setTimeout(r, Math.max(0, MIN_LOADING_MS - (Date.now() - started))));
  if (run !== searchRun) return; // a newer search started meanwhile
  currentTab = "todos";
  todosShown = { ...PREVIEW };
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
  srLoading.classList.add("is-done");
  hideLoadingTimer = setTimeout(() => { srLoading.hidden = true; }, 350);
}

// searching again from this page's own field (Enter or the arrow) stays on the page
srQuery.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = srQuery.value.trim();
  if (!text) return;
  history.pushState(null, "", `pesquisa.html?q=${encodeURIComponent(text)}`);
  srQuery.blur();
  runSearch(text);
});
// back/forward between searches
window.addEventListener("popstate", () => runSearch(new URLSearchParams(window.location.search).get("q") || ""));

runSearch(new URLSearchParams(window.location.search).get("q") || "");
