const filterDropdowns = [...document.querySelectorAll(".media-filter-dropdown")];
const newsGrid = document.getElementById("newsGrid");
const mediaMoreWrap = document.getElementById("mediaMoreWrap");
const mediaMoreBtn = document.getElementById("mediaMoreBtn");
const newsCards = [...document.querySelectorAll(".news-card")];
const mediaClearFilters = document.getElementById("mediaClearFilters");
const todosFilterMenu = document.getElementById("todosFilterMenu");
const noticiasSubtitle = document.getElementById("noticiasSubtitle");

const COLUMNS = 3;
const REVEAL_CHUNK = COLUMNS * 6;
const LOAD_MORE_CHUNK = COLUMNS * 3;

const matchParam = new URLSearchParams(window.location.search).get("match");

let shownCount = 0;

function closeAllDropdowns() {
  filterDropdowns.forEach((dropdown) => {
    dropdown.classList.remove("is-open");
    const menu = dropdown.querySelector(".media-filter-menu");
    const btn = dropdown.querySelector(".media-filter-pill");
    if (menu) menu.classList.remove("is-open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
}

function getSelectedValues(menu) {
  if (!menu) return [];
  return [...menu.querySelectorAll("button.is-selected")]
    .map((btn) => btn.dataset.value)
    .filter(Boolean);
}

function isCardActive(card) {
  const tags = getSelectedValues(todosFilterMenu);
  return tags.length === 0 || tags.includes(card.dataset.tag);
}

function getActiveList() {
  const tags = getSelectedValues(todosFilterMenu);
  const filtered = tags.length === 0 ? newsCards : newsCards.filter(isCardActive);

  if (!matchParam) return filtered;

  const matched = filtered.filter((card) => card.dataset.match === matchParam);
  const others = filtered.filter((card) => card.dataset.match !== matchParam);
  return [...matched, ...others];
}

function render() {
  const activeList = getActiveList();
  const total = activeList.length;

  if (shownCount === 0) {
    shownCount = Math.min(REVEAL_CHUNK, total);
  }

  const visible = activeList.slice(0, shownCount);

  newsCards.forEach((card) => {
    card.hidden = !visible.includes(card);
  });

  if (newsGrid) newsGrid.hidden = shownCount === 0;
  if (mediaMoreWrap) mediaMoreWrap.hidden = visible.length >= total;
}

function refreshFromFilters() {
  shownCount = 0;
  render();
}

function showNextBatch() {
  shownCount = shownCount === 0 ? REVEAL_CHUNK : shownCount + LOAD_MORE_CHUNK;
  render();
}

filterDropdowns.forEach((dropdown) => {
  const btn = dropdown.querySelector(".media-filter-pill");
  const menu = dropdown.querySelector(".media-filter-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !menu.classList.contains("is-open");

    closeAllDropdowns();

    menu.classList.toggle("is-open", willOpen);
    dropdown.classList.toggle("is-open", willOpen);
    btn.setAttribute("aria-expanded", String(willOpen));

    if (willOpen) {
      const frameWidth = dropdown.getBoundingClientRect().width;
      menu.style.setProperty("--frame-width", frameWidth + "px");
    }
  });

  menu.addEventListener("click", (e) => {
    e.stopPropagation();
    if (e.target.tagName === "BUTTON") {
      e.target.classList.toggle("is-selected");
      refreshFromFilters();
    }
  });
});

if (mediaClearFilters) {
  mediaClearFilters.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".media-filter-menu button.is-selected").forEach((btn) => {
      btn.classList.remove("is-selected");
    });
    refreshFromFilters();
  });
}

document.addEventListener("click", closeAllDropdowns);

if (mediaMoreBtn) {
  mediaMoreBtn.addEventListener("click", showNextBatch);
}

render();
