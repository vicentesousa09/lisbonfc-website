// Perfil (perfil.html): the signed-in account's page. The banner shows the photo, name, member number and since when;
// the tabs below switch by the address's #part (#socio, #dados-pessoais, ...), so the account popup can open any of them

let profile = null;
try { profile = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
// not signed in: the sign-in page instead
if (!profile) location.replace("conta.html");
profile = profile || {};

// since when: the month and year (as "OUT 24") the session was first started, until there's a server with the real date
const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const sinceDate = new Date(profile.since || Date.now());
const since = `${MONTHS[sinceDate.getMonth()]} ${String(sinceDate.getFullYear()).slice(2)}`;
const name = (profile.name || "").toLocaleUpperCase("pt");
document.querySelectorAll("[data-pf-name]").forEach((el) => { el.textContent = name; });
document.querySelectorAll("[data-pf-member]").forEach((el) => { el.textContent = profile.socio || "-"; });
document.querySelectorAll("[data-pf-since]").forEach((el) => { el.textContent = since; });
// the card says the full year ("DESDE 2025")
document.querySelectorAll("[data-pf-since-year]").forEach((el) => { el.textContent = sinceDate.getFullYear(); });
// Dados Pessoais: the e-mail and phone, and the saved cards (their last four digits) as grey strips with a tick
document.querySelectorAll("[data-pf-email]").forEach((el) => { el.textContent = (profile.email || "").toLocaleUpperCase("pt"); });
document.querySelectorAll("[data-pf-phone]").forEach((el) => { el.textContent = profile.phone || ""; });
const cards = profile.cards || [];
document.querySelector("[data-pf-cards-count]").textContent = cards.length;
// Moradas: how many (the profile's and the saved ones), and which is the billing and the delivery one (by its title)
const addresses = profile.addresses || [];
const addressTitle = (id) => addresses.find((a) => a.id === id)?.title || "Morada Perfil";
document.querySelector("[data-pf-addresses-count]").textContent = addresses.length + 1;
document.querySelector("[data-pf-billing]").textContent = addressTitle(profile.billing);
document.querySelector("[data-pf-delivery]").textContent = addressTitle(profile.delivery);
document.querySelector("[data-pf-cards]").innerHTML =cards.map((last4) => `<li>**** **** **** ${last4}<svg viewBox="0 0 16 16" fill="none" stroke="var(--blue)" stroke-width="2"><path d="m2.5 8.5 3.6 3.6 7.4-8"/></svg></li>`).join("");

// Encomendas: a row per order (code, date, state) with Ver, which opens it in the order history; none yet: a line
// saying so, and no Ver Todas
const orders = profile.orders || [];
document.querySelector("[data-pf-orders]").innerHTML = orders.length
  ? orders.map((o, i) => `<div class="pf-row"><p class="pf-row-info"><strong>${o.id}</strong><span>${o.date}</span><span>${o.status}</span></p><a href="historico-de-encomendas.html#${i}" class="pf-btn pf-btn--outline">Ver</a></div>`).join("")
  : `<p class="pf-en-none">Ainda não tem encomendas.</p>`;
document.querySelector(".pf-en-all").hidden = !orders.length;

// Consentimentos: a Não/Sim per subject (all Sim to start), kept in this browser until there's a server. The Sim/Não
// above them sets them all; any one on Sim puts it back on Sim, all on Não puts it on Não
const CONSENTS = ["Sócios", "Merchandising", "Conteúdos de Futebol (Pré e Pós Jogo)", "Universo Lisbon FC", "Eventos", "Lisbon FC TV", "Lisbon FC Foundation"];
let consents = {};
try { consents = JSON.parse(localStorage.getItem("lfcConsents")) || {}; } catch {}
document.querySelector("[data-pf-consents]").innerHTML = CONSENTS.map((label, i) => {
  const yes = consents[label] !== false;
  return `<div class="pf-cs-row"><p>${label}</p><div class="pf-cs-choice">`
    + `<label class="pf-radio"><input type="radio" name="cs-${i}" value="nao" data-label="${label}"${yes ? "" : " checked"}><span>Não</span></label>`
    + `<label class="pf-radio"><input type="radio" name="cs-${i}" value="sim" data-label="${label}"${yes ? " checked" : ""}><span>Sim</span></label>`
    + `</div></div>`;
}).join("");
const consentAll = document.querySelectorAll("[data-pf-consent-all]");
function syncConsentAll() {
  const any = CONSENTS.some((label) => consents[label] !== false);
  consentAll.forEach((r) => { r.checked = r.value === (any ? "sim" : "nao"); });
}
syncConsentAll();
const saveConsents = () => { try { localStorage.setItem("lfcConsents", JSON.stringify(consents)); } catch {} };
// (on click, so Sim sets them all again even when it's already on Sim because one of them is)
consentAll.forEach((r) => r.addEventListener("click", () => {
  CONSENTS.forEach((label) => { consents[label] = r.value === "sim"; });
  document.querySelectorAll("[data-pf-consents] input").forEach((i) => { i.checked = i.value === r.value; });
  saveConsents();
}));
document.querySelector("[data-pf-consents]").addEventListener("change", (e) => {
  consents[e.target.dataset.label] = e.target.value === "sim";
  syncConsentAll();
  saveConsents();
});
// when the terms were accepted: the day the account started (as "1 de janeiro de 2025")
document.querySelector("[data-pf-accepted]").textContent = sinceDate.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });

// Gerir Cookies: the privacy popup. Each category opens with its +; the switches start on (or as last saved) and are
// kept in this browser by "Confirmar as minhas escolhas"; "Aceitar apenas cookies necessários" turns them all off
const ckOverlay = document.querySelector(".ck-overlay");
const ckSwitches = ckOverlay.querySelectorAll(".ck-switch");
function openCookies() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem("lfcCookies")) || {}; } catch {}
  ckSwitches.forEach((s) => { s.checked = saved[s.dataset.ck] !== false; });
  syncAllowAll();
  clearTimeout(ckFade);
  ckOverlay.classList.remove("is-closing");
  // the page behind goes back to its top, so it's there when the popup closes
  window.scrollTo({ top: 0, behavior: "instant" });
  ckOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  ckOverlay.querySelector(".ck-body").scrollTop = 0;
}
// it fades out first, then hides
let ckFade;
function closeCookies() {
  if (ckOverlay.hidden || ckOverlay.classList.contains("is-closing")) return;
  ckOverlay.classList.add("is-closing");
  ckFade = setTimeout(() => {
    ckOverlay.hidden = true;
    ckOverlay.classList.remove("is-closing");
    document.body.style.overflow = "";
  }, 500);
}
function saveCookies() {
  const choice = {};
  ckSwitches.forEach((s) => { choice[s.dataset.ck] = s.checked; });
  try { localStorage.setItem("lfcCookies", JSON.stringify(choice)); } catch {}
  closeCookies();
}
document.querySelector(".pf-cs-cookies-btn").addEventListener("click", openCookies);
ckOverlay.querySelector(".ck-close").addEventListener("click", closeCookies);
// a click on the dark page around it closes it too, as does Esc
ckOverlay.addEventListener("click", (e) => { if (e.target === ckOverlay) closeCookies(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !ckOverlay.hidden) closeCookies(); });
ckOverlay.querySelectorAll(".ck-toggle-info").forEach((b) => b.addEventListener("click", () => {
  const open = b.getAttribute("aria-expanded") !== "true";
  b.setAttribute("aria-expanded", String(open));
  b.closest(".ck-item").querySelector(".ck-item-text").hidden = !open;
}));
ckOverlay.querySelector("[data-ck-only-needed]").addEventListener("click", () => {
  ckSwitches.forEach((s) => { s.checked = false; });
  saveCookies();
});
ckOverlay.querySelector("[data-ck-confirm]").addEventListener("click", saveCookies);
// "Permitir todos" only shows while a switch is off; it turns them all on, saves and closes
const ckAllowAll = ckOverlay.querySelector("[data-ck-allow]");
function syncAllowAll() { ckAllowAll.hidden = [...ckSwitches].every((s) => s.checked); }
ckSwitches.forEach((s) => s.addEventListener("change", syncAllowAll));
ckAllowAll.addEventListener("click", () => {
  ckSwitches.forEach((s) => { s.checked = true; });
  saveCookies();
});

// an account without a member number: no "Sócio Nº" line under the name; the card with dashes for the number and the
// year (as Benfica's), and instead of the rows "Já sou sócio" and "Ainda não és sócio?"
if (!profile.socio) {
  document.querySelector("[data-pf-member-line]").hidden = true;
  document.querySelector(".pf-card-text [data-pf-member]").textContent = "- - - - -";
  document.querySelector("[data-pf-card-since]").textContent = "- - - - - - - - - - - -";
  document.querySelector("[data-pf-rows]").hidden = true;
  document.querySelector("[data-pf-join]").hidden = false;
  document.querySelector(".pf-card-box").classList.add("is-join");
}
// "Já sou sócio": both boxes needed (an empty one turns red); Guardar links the number to the account (until there's a
// server to check it against the ID document) and the page shows the member's layout
const pfJoinForm = document.querySelector("[data-pf-join-form]");
pfJoinForm.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));
pfJoinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const empty = [...pfJoinForm.querySelectorAll(".pf-join-input")].filter((i) => !i.value.trim());
  empty.forEach((i) => i.classList.add("is-invalid"));
  if (empty.length) { empty[0].focus(); return; }
  profile.socio = pfJoinForm.socio.value.trim();
  try { localStorage.setItem("lfcSession", JSON.stringify(profile)); } catch {}
  location.reload();
});

// quotas: monthly; overdue (the row and its button in red) until they're paid (the last month paid kept on the account
// by the quotas' Finalizar). Paid up, the row is as the others: "Mensal Pago até nov 26" with a blue tick, and a plain
// Pagar Quotas (to pay ahead)
const PF_MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const pfNow = new Date();
const pfThisMonth = `${pfNow.getFullYear()}-${String(pfNow.getMonth() + 1).padStart(2, "0")}`;
const feesOverdue = !(profile.quotasPaidUntil && profile.quotasPaidUntil >= pfThisMonth);
const feesRow = document.querySelector("[data-pf-fees]");
feesRow.classList.toggle("is-alert", feesOverdue);
feesRow.querySelector(".pf-btn").classList.toggle("pf-btn--alert", feesOverdue);
const feesText = feesRow.querySelector("[data-pf-fees-text]");
if (feesOverdue) feesText.textContent = "Mensal em atraso";
else {
  const [year, month] = profile.quotasPaidUntil.split("-").map(Number);
  feesText.textContent = `Mensal Pago até ${PF_MONTHS[month - 1]} ${String(year).slice(-2)}`;
  // (and a thin blue tick after it)
  feesText.insertAdjacentHTML("afterend", '<svg class="pf-paid-tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-label="Pagas"><path d="m5 12.5 5 5 10-11"/></svg>');
}

// the photo: the camera picks one; it's kept in this browser and shown in the banner and on the card
const avatarImg = document.querySelector(".pf-avatar-img");
const cardImg = document.querySelector(".pf-card-photo img");
function showPhoto(src) {
  [avatarImg, cardImg].forEach((img) => { img.src = src; img.hidden = false; });
  document.querySelector(".pf-avatar-person").style.display = "none";
}
try {
  const saved = localStorage.getItem("lfcAvatar");
  if (saved) showPhoto(saved);
} catch {}
const photoInput = document.querySelector(".pf-avatar-camera input");
// clicking the picture itself picks a photo too, same as the camera
document.querySelector(".pf-avatar-circle").addEventListener("click", () => photoInput.click());
photoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  // made small (240px) before keeping it, so it fits in the browser's storage
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const size = 240;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const side = Math.min(img.width, img.height);
      canvas.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      // (a .jpg stays a .jpg; any other picture is kept as a .png, so its see-through parts stay see-through and the
      // circle's own background shows behind them, not black)
      const src = file.type === "image/jpeg" ? canvas.toDataURL("image/jpeg", 0.85) : canvas.toDataURL("image/png");
      showPhoto(src);
      try { localStorage.setItem("lfcAvatar", src); } catch {}
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Logout: signs out and goes to the home page
document.querySelector(".pf-logout").addEventListener("click", () => {
  try { localStorage.removeItem("lfcSession"); } catch {}
  location.href = "/";
});

// the tabs follow the address's #part; an unknown or missing one opens Dados de Sócio
const tabs = document.querySelectorAll("[data-pf-tab]");
const panels = document.querySelectorAll("[data-pf-panel]");
function showTab() {
  const wanted = location.hash.slice(1);
  const id = [...tabs].some((t) => t.dataset.pfTab === wanted) ? wanted : "socio";
  tabs.forEach((t) => {
    t.classList.toggle("is-active", t.dataset.pfTab === id);
    t.setAttribute("aria-selected", String(t.dataset.pfTab === id));
  });
  panels.forEach((p) => { p.hidden = p.dataset.pfPanel !== id; });
}
showTab();
window.addEventListener("hashchange", showTab);

// Débito Direto: active once joined (debito-direto-validacao.html), with how often it's charged; Aderir then says Alterar
if (profile.directDebit) {
  const periods = { mensal: "Mensal", bimestral: "Bimestral", trimestral: "Trimestral", semestral: "Semestral", anual: "Anual" };
  const debit = document.querySelector("[data-pf-debit]");
  debit.textContent = `Ativo · ${periods[profile.directDebit.period] || ""}`;
  const btn = debit.closest(".pf-row").querySelector(".pf-btn");
  if (btn) btn.textContent = "Alterar";
}
