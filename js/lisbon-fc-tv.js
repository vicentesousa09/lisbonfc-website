// Lisbon FC TV (lisbon-fc-tv.html), as Benfica's BTV page: the banner's slides (the two arrows, a swipe, and on their
// own every 7 seconds until someone uses the arrows), and "Informações", whose items open and close

const tvHero = document.getElementById("tvHero");
const tvSlides = [...tvHero.querySelectorAll(".tv-slide")];
let tvAt = 0;
let tvTimer = null;
function tvShow(i) {
  tvAt = (i + tvSlides.length) % tvSlides.length;
  tvSlides.forEach((s, j) => {
    s.classList.toggle("is-active", j === tvAt);
    s.setAttribute("aria-hidden", String(j !== tvAt));
    s.querySelectorAll("a").forEach((a) => { a.tabIndex = j === tvAt ? 0 : -1; });
  });
}
const tvAuto = () => { clearInterval(tvTimer); tvTimer = setInterval(() => tvShow(tvAt + 1), 7000); };
tvHero.querySelector("[data-tv-prev]").addEventListener("click", () => { tvShow(tvAt - 1); clearInterval(tvTimer); });
tvHero.querySelector("[data-tv-next]").addEventListener("click", () => { tvShow(tvAt + 1); clearInterval(tvTimer); });
let tvTouchX = null;
tvHero.addEventListener("touchstart", (e) => { tvTouchX = e.touches[0].clientX; }, { passive: true });
tvHero.addEventListener("touchend", (e) => {
  if (tvTouchX == null) return;
  const dx = e.changedTouches[0].clientX - tvTouchX;
  tvTouchX = null;
  if (Math.abs(dx) > 40) { tvShow(tvAt + (dx < 0 ? 1 : -1)); clearInterval(tvTimer); }
}, { passive: true });
tvShow(0);
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) tvAuto();

// Informações: a click on a title slides its text down under it (the title turns blue, the arrow turns up); another
// slides it back up
document.querySelectorAll(".tv-info-head").forEach((head) => {
  head.addEventListener("click", () => {
    const item = head.closest(".tv-info-item");
    const open = !item.classList.contains("is-open");
    item.classList.toggle("is-open", open);
    head.setAttribute("aria-expanded", String(open));
    item.querySelector(".tv-info-body").setAttribute("aria-hidden", String(!open));
  });
});

// the links to parts of this page land under the fixed header
document.querySelectorAll('.tv-page a[href^="#"], .tv-nav a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.getElementById(a.getAttribute("href").slice(1));
    if (!target || target === a) { e.preventDefault(); return; }
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
  });
});
