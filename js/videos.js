const filterDropdowns = [...document.querySelectorAll(".media-filter-dropdown")];
const mediaHeroGrid = document.getElementById("mediaHeroGrid");
const mediaSecondRow = document.getElementById("mediaSecondRow");
const mediaGrid = document.getElementById("mediaGrid");
const mediaMoreWrap = document.getElementById("mediaMoreWrap");
const mediaMoreBtn = document.getElementById("mediaMoreBtn");
const mediaCards = [...document.querySelectorAll(".media-card")];
const mediaClearFilters = document.getElementById("mediaClearFilters");
const todosFilterMenu = document.getElementById("todosFilterMenu");
const epocaFilterMenu = document.getElementById("epocaFilterMenu");
const tipoFilterMenu = document.getElementById("tipoFilterMenu");

const HERO_COUNT = 3;
const SECOND_COUNT = 2;
const BATCH_SIZE = 3;
const PREFIX_COUNT = HERO_COUNT + SECOND_COUNT + BATCH_SIZE;

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

function hasActiveFilters() {
  return (
    getSelectedValues(todosFilterMenu).length > 0 ||
    getSelectedValues(epocaFilterMenu).length > 0 ||
    getSelectedValues(tipoFilterMenu).length > 0
  );
}

function isCardActive(card) {
  const tipos = getSelectedValues(todosFilterMenu);
  const epocas = getSelectedValues(epocaFilterMenu);
  const formatos = getSelectedValues(tipoFilterMenu);
  const tipoMatch = tipos.length === 0 || tipos.includes(card.dataset.tipo);
  const epocaMatch = epocas.length === 0 || epocas.includes(card.dataset.epoca);
  const formatoMatch = formatos.length === 0 || formatos.includes(card.dataset.formato);
  return tipoMatch && epocaMatch && formatoMatch;
}

function clearHeroSecondClasses(card) {
  card.classList.remove("is-hero-1", "is-hero-2", "is-hero-3", "is-second");
}

function orderByMatch(list) {
  if (!matchParam) return list;
  const matched = list.filter((card) => card.dataset.match === matchParam);
  const others = list.filter((card) => card.dataset.match !== matchParam);
  return [...matched, ...others];
}

function renderPlain() {
  const ordered = orderByMatch(mediaCards);
  const total = ordered.length;
  const visible = ordered.slice(0, shownCount);

  if (mediaHeroGrid) mediaHeroGrid.hidden = true;
  if (mediaSecondRow) mediaSecondRow.hidden = true;

  mediaCards.forEach((card) => clearHeroSecondClasses(card));
  ordered.forEach((card) => {
    card.hidden = !visible.includes(card);
    if (mediaGrid && card.parentElement !== mediaGrid) mediaGrid.appendChild(card);
  });

  if (mediaGrid) mediaGrid.hidden = shownCount === 0;
  if (mediaMoreWrap) mediaMoreWrap.hidden = shownCount >= total;
}

function renderFancy() {
  const activeList = orderByMatch(mediaCards.filter(isCardActive));
  const total = activeList.length;

  if (shownCount === 0) {
    shownCount = Math.min(PREFIX_COUNT, total);
  }

  const visible = activeList.slice(0, shownCount);
  const heroCards = visible.slice(0, HERO_COUNT);
  const secondCards = visible.slice(HERO_COUNT, HERO_COUNT + SECOND_COUNT);
  const restCards = visible.slice(HERO_COUNT + SECOND_COUNT);

  mediaCards.forEach((card) => {
    if (!visible.includes(card)) {
      card.hidden = true;
      clearHeroSecondClasses(card);
    }
  });

  const heroClasses = ["is-hero-1", "is-hero-2", "is-hero-3"];
  heroCards.forEach((card, i) => {
    card.hidden = false;
    card.classList.remove("is-second");
    heroClasses.forEach((cls, ci) => card.classList.toggle(cls, ci === i));
    if (mediaHeroGrid && card.parentElement !== mediaHeroGrid) mediaHeroGrid.appendChild(card);
  });

  secondCards.forEach((card) => {
    card.hidden = false;
    card.classList.remove("is-hero-1", "is-hero-2", "is-hero-3");
    card.classList.add("is-second");
    if (mediaSecondRow && card.parentElement !== mediaSecondRow) mediaSecondRow.appendChild(card);
  });

  restCards.forEach((card) => {
    card.hidden = false;
    clearHeroSecondClasses(card);
    if (mediaGrid && card.parentElement !== mediaGrid) mediaGrid.appendChild(card);
  });

  if (mediaHeroGrid) mediaHeroGrid.hidden = heroCards.length === 0;
  if (mediaSecondRow) mediaSecondRow.hidden = secondCards.length === 0;
  if (mediaGrid) mediaGrid.hidden = restCards.length === 0;

  if (mediaMoreWrap) mediaMoreWrap.hidden = visible.length >= total;
}

function render() {
  if (hasActiveFilters()) {
    renderFancy();
  } else {
    renderPlain();
  }
}

function refreshFromFilters() {
  shownCount = 0;
  render();
}

function showNextBatch() {
  shownCount += BATCH_SIZE;
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
