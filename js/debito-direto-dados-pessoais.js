// Adesão ao Débito Direto, step 2 "Dados Pessoais" (debito-direto-dados-pessoais.html), after Continuar on step 1
// (debito-direto-adesao.html). As Benfica's: the bank account (IBAN, BIC/Swift) and how often it's charged, then the
// holder's name, phone, e-mail and address, all but the bank's from the account to start, in capitals. Continuar checks everything (a wrong box red, until it's changed); Anterior goes back to step 1.
// Only the IBAN's last 4 digits are kept. Continuar goes on to step 3, Verificação SMS
// (debito-direto-verificacao.html)

let ddpStep1 = null;
try { ddpStep1 = JSON.parse(sessionStorage.getItem("lfcDebitoDireto")); } catch {}
// step 1 not done: back to it
if (!ddpStep1) location.replace("debito-direto-adesao.html");
let ddpAccount = null;
try { ddpAccount = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
ddpAccount = ddpAccount || {};
const ddpData = ddpAccount.personal || {};

const $ = (id) => document.getElementById(id);
const ddp = {
  iban: $("ddpIban"), bic: $("ddpBic"), period: $("ddpPeriod"), first: $("ddpFirst"), last: $("ddpLast"),
  phoneCode: $("ddpPhoneCode"), phone: $("ddpPhone"), email: $("ddpEmail"), address: $("ddpAddress"),
  postcode1: $("ddpPostcode1"), postcode2: $("ddpPostcode2"), town: $("ddpTown"), country: $("ddpCountry"),
};
const ddpForm = document.querySelector(".ddp-form");
const upper = (s) => (s || "").toLocaleUpperCase("pt");

// the countries (paises.js): the phone's list (the flag picker, the code shown after the flag) and the country's, by
// its two letters with its flag beside
COUNTRIES.forEach((c) => {
  ddp.phoneCode.add(new Option(`${c.label} (+${c.dial})`, c.iso));
  ddp.country.add(new Option(c.iso, c.iso));
});
makePicker(ddp.phoneCode, ddp.phoneCode.closest(".ac-tel-code"), ddp.phoneCode.closest(".ac-tel"), true, true);
const ddpDial = () => COUNTRIES.find((c) => c.iso === ddp.phoneCode.value)?.dial || "351";
function ddpSetPhoneCountry(iso) {
  if (!COUNTRIES.some((c) => c.iso === iso)) iso = "PT";
  ddp.phoneCode.value = iso;
  ddp.phoneCode.closest(".ac-tel-code").querySelector(".ac-flag").src = flagUrl(iso);
  document.querySelector("[data-ddp-dial]").textContent = `+${ddpDial()}`;
}
ddp.phoneCode.addEventListener("change", () => {
  document.querySelector("[data-ddp-dial]").textContent = `+${ddpDial()}`;
  ddp.phone.dispatchEvent(new Event("input"));
});
const ddpFlag = document.querySelector("[data-ddp-flag]");
ddp.country.addEventListener("change", () => { ddpFlag.src = flagUrl(ddp.country.value); });

// filling in from the account: the name in two (first and last), the phone split from its country's code, the e-mail,
// the address, postcode, town and country
const ddpNames = (ddpAccount.name || "").trim().split(/\s+/);
ddp.first.value = upper(ddpData.first || ddpNames[0]);
ddp.last.value = upper(ddpData.last || (ddpNames.length > 1 ? ddpNames[ddpNames.length - 1] : ""));
let ddpPhoneDigits = (ddpAccount.phone || "").replace(/\D/g, "");
const ddpPhoneCountry = COUNTRIES.filter((c) => ddpPhoneDigits.startsWith(c.dial)).sort((x, y) => y.dial.length - x.dial.length)[0];
ddpSetPhoneCountry(ddpPhoneCountry ? (ddpPhoneCountry.iso === "US" || ddpPhoneCountry.dial !== "351" ? ddpPhoneCountry.iso : "PT") : "PT");
if (ddpPhoneCountry) ddpPhoneDigits = ddpPhoneDigits.slice(ddpPhoneCountry.dial.length);
ddp.phone.value = ddpPhoneDigits;
ddp.email.value = upper(ddpAccount.email);
ddp.address.value = upper(ddpData.address);
[ddp.postcode1.value, ddp.postcode2.value] = (ddpData.postcode || "").split("-").concat("", "");
ddp.town.value = upper(ddpData.town || ddpData.city);
ddp.country.value = COUNTRIES.some((c) => c.iso === ddpData.country) ? ddpData.country : "PT";
ddpFlag.src = flagUrl(ddp.country.value);
document.querySelector("[data-ddp-country-text]").textContent = ddp.country.value;

// typing helps: the IBAN and the BIC in capitals with no spaces (as banks write them; the rest is typed as it comes,
// only the account's details are filled in in capitals), the phone in threes for Portugal, the postcode digits only (on to the second box when the first is full)
ddp.iban.addEventListener("input", () => { ddp.iban.value = ddp.iban.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 34); });
ddp.bic.addEventListener("input", () => { ddp.bic.value = ddp.bic.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11); });
ddp.phone.addEventListener("input", () => {
  const pt = ddp.phoneCode.value === "PT";
  const d = ddp.phone.value.replace(/\D/g, "").slice(0, pt ? 9 : 15);
  ddp.phone.value = pt ? d.replace(/(\d{3})(?=\d)/g, "$1 ") : d;
});
ddp.phone.dispatchEvent(new Event("input"));
ddp.postcode1.addEventListener("input", () => {
  ddp.postcode1.value = ddp.postcode1.value.replace(/\D/g, "").slice(0, 4);
  if (ddp.postcode1.value.length === 4) ddp.postcode2.focus();
});
ddp.postcode2.addEventListener("input", () => { ddp.postcode2.value = ddp.postcode2.value.replace(/\D/g, "").slice(0, 3); });

// an IBAN is right when its check digits are (ISO 13616: moved to the end, letters as numbers, mod 97 is 1)
function ddpIbanOk(s) {
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return false;
  const digits = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rest = 0;
  for (const d of digits) rest = (rest * 10 + Number(d)) % 97;
  return rest === 1;
}
const ddpChecks = {
  iban: () => ddpIbanOk(ddp.iban.value),
  bic: () => /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(ddp.bic.value),
  period: () => ddp.period.value !== "",
  first: () => ddp.first.value.trim() !== "",
  last: () => ddp.last.value.trim() !== "",
  phone: () => (ddp.phoneCode.value === "PT" ? /^9\d{8}$/ : /^\d{4,15}$/).test(ddp.phone.value.replace(/\D/g, "")),
  email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ddp.email.value.trim()),
  address: () => ddp.address.value.trim() !== "",
  postcode: () => (ddp.country.value === "PT" ? /^\d{4}$/.test(ddp.postcode1.value) && /^\d{3}$/.test(ddp.postcode2.value) : (ddp.postcode1.value + ddp.postcode2.value).trim() !== ""),
  town: () => ddp.town.value.trim() !== "",
  country: () => ddp.country.value !== "",
};
// The dropdowns (Periodicidade and the country): the box opens its list under it (a click on an option chooses it, as
// do the arrows and Enter; Esc or a click outside closes it; on the country's, typing a letter jumps to the countries
// starting with it). The hidden select keeps the value; show(li) puts the choice in the box
const ddpDrops = [];
function ddpDropdown(box, select, show) {
  const btn = box.querySelector(".ddp-period-btn");
  const list = box.querySelector(".ddp-period-list");
  const items = () => [...list.children];
  let active = -1;
  const mark = (i) => {
    active = i;
    items().forEach((li, j) => li.classList.toggle("is-active", j === i));
    // (the list scrolls, so the marked option is brought into view)
    if (i >= 0) list.scrollTop = Math.max(0, Math.min(list.scrollTop, items()[i].offsetTop), items()[i].offsetTop + items()[i].offsetHeight - list.clientHeight);
  };
  const open = (on) => {
    if (on) ddpDrops.forEach((d) => d !== drop && d.open(false));
    list.hidden = !on;
    btn.setAttribute("aria-expanded", String(on));
    const at = items().findIndex((li) => li.dataset.value === select.value);
    if (on && at >= 0) list.scrollTop = items()[at].offsetTop - 4;
    // (nothing greyed when it opens: only the option hovered, or reached with the arrows)
    mark(-1);
  };
  const choose = (li) => {
    select.value = li.dataset.value;
    show(li);
    btn.classList.add("is-chosen");
    items().forEach((x) => x.setAttribute("aria-selected", String(x === li)));
    select.dispatchEvent(new Event("change", { bubbles: true }));
    open(false);
    btn.focus();
  };
  btn.addEventListener("click", () => open(list.hidden));
  list.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li) choose(li); });
  btn.addEventListener("keydown", (e) => {
    if (/^[a-z]$/i.test(e.key) && box.classList.contains("ddp-country")) {
      if (list.hidden) open(true);
      const at = items().findIndex((li) => li.dataset.value.startsWith(e.key.toUpperCase()));
      if (at >= 0) { mark(at); list.scrollTop = items()[at].offsetTop; }
      return;
    }
    if (list.hidden) {
      if (e.key === "ArrowDown") { e.preventDefault(); open(true); }
      return;
    }
    if (e.key === "ArrowDown" && active < 0) mark(Math.max(0, items().findIndex((li) => li.dataset.value === select.value)));
    else if (e.key === "ArrowDown") mark(Math.min(active + 1, items().length - 1));
    else if (e.key === "ArrowUp") mark(Math.max(active - 1, 0));
    else if (e.key === "Enter" && active >= 0) choose(items()[active]);
    else if (e.key === "Escape" || e.key === "Tab") { open(false); return; }
    else return;
    e.preventDefault();
  });
  const drop = { box, open };
  ddpDrops.push(drop);
  return drop;
}
document.addEventListener("click", (e) => ddpDrops.forEach((d) => { if (!d.box.contains(e.target)) d.open(false); }));
ddpDropdown(document.querySelector('[data-field="period"]'), ddp.period, (li) => {
  document.querySelector("[data-ddp-period-text]").textContent = li.textContent;
});
// the country's list: Portugal first, then every other country by its two letters (in their order), with its flag
const ddpCountryList = document.querySelector(".ddp-country-list");
ddpCountryList.replaceChildren(...[...ddp.country.options].sort((x, y) => (x.value === "PT" ? -1 : y.value === "PT" ? 1 : x.value.localeCompare(y.value))).map((o) => {
  const li = document.createElement("li");
  li.setAttribute("role", "option");
  li.dataset.value = o.value;
  li.innerHTML = `<span>${o.value}</span><img src="${flagUrl(o.value)}" alt="" loading="lazy">`;
  return li;
}));
ddpDropdown(document.querySelector('[data-field="country"]'), ddp.country, (li) => {
  document.querySelector("[data-ddp-country-text]").textContent = li.dataset.value;
});

// a wrong box turns red (and its asterisk), until it's changed
ddpForm.addEventListener("input", (e) => e.target.closest("[data-field]")?.classList.remove("is-invalid"));
ddpForm.addEventListener("change", (e) => e.target.closest("[data-field]")?.classList.remove("is-invalid"));
// a click anywhere in the postcode's pair (not on a box) types in the first
ddpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const wrong = Object.keys(ddpChecks).filter((k) => !ddpChecks[k]());
  Object.keys(ddpChecks).forEach((k) => ddpForm.querySelector(`[data-field="${k}"]`).classList.toggle("is-invalid", wrong.includes(k)));
  if (wrong.length) {
    ddpForm.querySelector(`[data-field="${wrong[0]}"] input, [data-field="${wrong[0]}"] button, [data-field="${wrong[0]}"] select:not([hidden])`).focus();
    return;
  }
  const details = {
    ibanLast4: ddp.iban.value.slice(-4), bic: ddp.bic.value, period: ddp.period.value,
    name: `${ddp.first.value.trim()} ${ddp.last.value.trim()}`, phone: `+${ddpDial()}${ddp.phone.value.replace(/\D/g, "")}`,
    email: ddp.email.value.trim(), address: ddp.address.value.trim(), postcode: `${ddp.postcode1.value}-${ddp.postcode2.value}`,
    town: ddp.town.value.trim(), country: ddp.country.value,
  };
  try { sessionStorage.setItem("lfcDebitoDireto", JSON.stringify({ ...ddpStep1, details })); } catch {}
  // on to step 3, Verificação SMS
  location.href = "debito-direto-verificacao.html";
});

// back to the top: shown once the page has scrolled down
const ddpTop = document.querySelector(".nt-top");
const ddpShowTop = () => { ddpTop.hidden = window.scrollY < 300; };
window.addEventListener("scroll", ddpShowTop, { passive: true });
ddpShowTop();
ddpTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
