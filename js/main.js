const menuToggle = document.querySelector(".menu-toggle");
const megaMenu = document.getElementById("megaMenu");
const megaClose = document.querySelector(".mega-close");

function openMenu() {
  megaMenu.classList.add("open");
  menuToggle.setAttribute("aria-expanded", "true");
}
function closeMenu() {
  megaMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", openMenu);
megaClose.addEventListener("click", closeMenu);
megaMenu.addEventListener("click", (e) => {
  if (e.target === megaMenu) closeMenu();
});

document.querySelectorAll(".mega-primary-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.dataset.target;

    document.querySelectorAll(".mega-primary-link").forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    document.querySelectorAll(".mega-secondary-group").forEach((g) => {
      g.classList.toggle("active", g.dataset.group === target);
    });
  });
});

document.querySelectorAll(".mega-secondary-group a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const searchToggle = document.querySelector(".search-toggle");
const searchBar = document.getElementById("searchBar");

searchToggle.addEventListener("click", () => {
  const isOpen = searchBar.classList.toggle("open");
  searchToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) searchBar.querySelector("input").focus();
});

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
