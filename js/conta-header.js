// The account pages' header, menu and footer (notificacoes.html, historico-de-encomendas.html): signed out, the
// sign-in page instead; the name and initials, the account popup, the menu, and the TOP button

// not signed in: the sign-in page instead, except on the Adesão pages (becoming a member), which can be done without an
// account: there the form starts empty, and the header shows a sign-in icon in place of "Olá, NAME" and the wallet
let account = null;
try { account = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
const nhOpenPage = /(^|\/)adesao-[a-z-]+\.html$/.test(location.pathname);
if (!account && !nhOpenPage) location.replace("conta.html");
if (!account && nhOpenPage) {
  document.querySelectorAll(".nh-user, .nh-wallet").forEach((el) => { el.hidden = true; });
  const signIn = document.createElement("a");
  signIn.href = "conta.html";
  signIn.className = "nh-signin";
  signIn.setAttribute("aria-label", "Iniciar sessão");
  signIn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5"/></svg>';
  const cart = document.querySelector(".nh-cart");
  if (cart) cart.parentNode.insertBefore(signIn, cart);
}
account = account || {};

// the header: "Olá," with the first name, and the initials (first and last name) in the circles
const names = (account.name || "").trim().split(/\s+/).filter(Boolean);
document.querySelector("[data-nh-name]").textContent = (names[0] || "").toLocaleUpperCase("pt");
const nhInitials = names.filter((w, i) => i === 0 || i === names.length - 1).map((w) => w[0].toLocaleUpperCase("pt")).join("");
document.querySelectorAll("[data-nh-initials]").forEach((el) => { el.textContent = nhInitials; });

// the account popup: the full name, the member number (none: no line), since when (as "OUT 2025"), and the photo
// picked on the profile, if there is one, in place of the initials
const NH_MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const nhSince = new Date(account.since || Date.now());
document.querySelector("[data-nh-fullname]").textContent = (account.name || "").toLocaleUpperCase("pt");
const nhMember = document.querySelector("[data-nh-member]");
if (account.socio) nhMember.querySelector("span").textContent = account.socio;
else nhMember.hidden = true;
document.querySelector("[data-nh-since]").textContent = `${NH_MONTHS[nhSince.getMonth()]} ${nhSince.getFullYear()}`;
// (the photo also takes the place of the initials in the header's small circle; called again when a new one is picked)
function showNhPhoto(photo) {
  const img = document.querySelector("[data-nh-photo]");
  img.src = photo;
  img.hidden = false;
  document.querySelectorAll(".nh-initials").forEach((el) => {
    el.classList.add("has-photo");
    el.innerHTML = '<img alt="">';
    el.firstElementChild.src = photo;
  });
}
try {
  const photo = localStorage.getItem("lfcAvatar");
  if (photo) showNhPhoto(photo);
} catch {}

// "Olá, VICENTE" with the initials (one button) opens and closes it; a click anywhere else or Esc closes it
const nhAccountToggles = document.querySelectorAll(".nh-user");
const nhAccount = document.getElementById("nhAccount");
function setAccountOpen(open) {
  nhAccount.hidden = !open;
  nhAccountToggles.forEach((t) => t.setAttribute("aria-expanded", String(open)));
}
nhAccountToggles.forEach((t) => t.addEventListener("click", () => setAccountOpen(nhAccount.hidden)));
document.addEventListener("click", (e) => {
  if (!nhAccount.hidden && !nhAccount.contains(e.target) && ![...nhAccountToggles].some((t) => t.contains(e.target))) setAccountOpen(false);
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setAccountOpen(false); });

// Logout: signs out and goes to the home page
document.querySelector(".nh-account-logout").addEventListener("click", () => {
  try { localStorage.removeItem("lfcSession"); } catch {}
  location.href = "/";
});

// the menu: the menu lines open it (the header shrinks to its top row and the page under it stops scrolling) and,
// turned into a cross, close it; Esc closes it too
const nhHeader = document.querySelector(".nh-header");
const nhMenuBtn = document.querySelector(".nh-menu");
const nmMenu = document.getElementById("nmMenu");
function setMenuOpen(open) {
  nhHeader.classList.toggle("is-menu-open", open);
  nmMenu.classList.toggle("is-open", open);
  document.body.classList.toggle("nm-open", open);
  nhMenuBtn.setAttribute("aria-expanded", String(open));
  nhMenuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  // (from the top of the page, so the menu hangs right under the header)
  if (open) {
    setAccountOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}
nhMenuBtn.addEventListener("click", () => setMenuOpen(!nmMenu.classList.contains("is-open")));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenuOpen(false); });

// back to the top: shows once the page has scrolled down a screen
const nhTop = document.querySelector(".nt-top");
const syncNhTop = () => { nhTop.hidden = window.scrollY < 400; };
window.addEventListener("scroll", syncNhTop, { passive: true });
syncNhTop();
nhTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// scrolled past the header, its row stays fixed at the top in a smaller version (.is-compact in style.css); it
// switches at once, without the menu's slide (.nh-instant), and not while the menu is open
function syncCompact() {
  const compact = window.scrollY > 120 && !nhHeader.classList.contains("is-menu-open");
  if (compact === nhHeader.classList.contains("is-compact")) return;
  nhHeader.classList.add("nh-instant");
  nhHeader.classList.toggle("is-compact", compact);
  if (!compact) setMoreOpen(false);
  requestAnimationFrame(() => requestAnimationFrame(() => nhHeader.classList.remove("nh-instant")));
}
// the arrow that stands for "Lisbon FC" there: drops its box, closed by another click, a click elsewhere or Esc
const nhMoreBtn = document.querySelector(".nh-more-btn");
const nhMoreList = document.querySelector(".nh-more-list");
function setMoreOpen(open) {
  nhMoreList.hidden = !open;
  nhMoreBtn.setAttribute("aria-expanded", String(open));
}
nhMoreBtn.addEventListener("click", () => setMoreOpen(nhMoreList.hidden));
document.addEventListener("click", (e) => { if (!e.target.closest(".nh-more")) setMoreOpen(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMoreOpen(false); });
window.addEventListener("scroll", syncCompact, { passive: true });
syncCompact();
