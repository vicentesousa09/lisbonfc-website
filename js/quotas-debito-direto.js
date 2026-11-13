// Pagamento de Quotas, step 3 with Débito Direto (quotas-debito-direto.html), after choosing it on quotas-pagamento.html.
// The adhesion, as Benfica's: the bank account (IBAN, BIC/SWIFT), how often it's charged, and the holder's name, phone,
// e-mail and address (from the account to start); the tick, then Seguinte checks it all. Only the IBAN's last 4 digits
// are kept

let ddChoice = null;
try { ddChoice = JSON.parse(sessionStorage.getItem("lfcQuotasChoice")); } catch {}
// no period chosen yet: back to step 2 (which sends on to step 1 when that's missing too)
if (!ddChoice) location.replace("quotas-valores.html");
let ddSession = null;
try { ddSession = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
ddSession = ddSession || {};
const ddData = ddSession.personal || {};

const $ = (id) => document.getElementById(id);
const ddForm = document.querySelector(".qd-form");
const dd = {
  iban: $("ddIban"), bic: $("ddBic"), period: $("ddPeriod"), name: $("ddName"), phoneCode: $("ddPhoneCode"),
  phone: $("ddPhone"), email: $("ddEmail"), address: $("ddAddress"), postcode1: $("ddPostcode1"),
  postcode2: $("ddPostcode2"), town: $("ddTown"), country: $("ddCountry"), agree: $("ddAgree"),
};

// the country lists (countries and the flag picker: paises.js); the phone's code shown after its flag
COUNTRIES.forEach((c) => {
  dd.country.add(new Option(c.label, c.iso));
  dd.phoneCode.add(new Option(`${c.label} (+${c.dial})`, c.iso));
});
makePicker(dd.country, dd.country.closest(".ac-select"), dd.country.closest(".ac-select"), false);
makePicker(dd.phoneCode, dd.phoneCode.closest(".ac-tel-code"), dd.phoneCode.closest(".ac-tel"), true, true);
// the País box opens its list wherever it's clicked, not only on the flag
const ddCountryBox = dd.country.closest(".ac-select");
ddCountryBox.addEventListener("click", (e) => {
  const btn = ddCountryBox.querySelector(".ac-flag-btn");
  if (!btn.contains(e.target) && !e.target.closest(".ac-countries")) btn.click();
});
const ddDial = document.querySelector(".qd-dial");
function setCountry(select, iso) {
  if (!COUNTRIES.some((c) => c.iso === iso)) return;
  select.value = iso;
  const box = select.closest(".ac-select, .ac-tel-code");
  box.querySelector(".ac-flag").src = flagUrl(iso);
  const text = box.querySelector(".ac-select-text");
  if (text) text.textContent = COUNTRIES.find((c) => c.iso === iso).name;
  select.dispatchEvent(new Event("change"));
}
dd.phoneCode.addEventListener("change", () => {
  ddDial.textContent = `+${COUNTRIES.find((c) => c.iso === dd.phoneCode.value).dial}`;
});

// filling in: the account's name, e-mail, phone and address
const upper = (s) => (s || "").toLocaleUpperCase("pt");
dd.name.value = upper(ddSession.name);
dd.email.value = upper(ddSession.email);
let phoneIso = "PT";
let phoneNational = ddSession.phone || "";
try {
  const parsed = libphonenumber.parsePhoneNumber(ddSession.phone);
  phoneIso = parsed.country || "PT";
  phoneNational = parsed.formatNational();
} catch {}
setCountry(dd.phoneCode, phoneIso);
dd.phone.value = phoneNational;
dd.address.value = upper(ddData.address);
[dd.postcode1.value, dd.postcode2.value] = (ddData.postcode || "").split("-").concat("", "");
dd.town.value = upper(ddData.town || ddData.city);
setCountry(dd.country, ddData.country || "PT");

// typing helps: the IBAN in groups of 4, the BIC in capitals, the postcode digits only (on to the second box when
// the first is full)
dd.iban.addEventListener("input", () => {
  dd.iban.value = dd.iban.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 34).replace(/(.{4})(?=.)/g, "$1 ");
});
dd.bic.addEventListener("input", () => { dd.bic.value = dd.bic.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); });
[dd.postcode1, dd.postcode2].forEach((f) => f.addEventListener("input", () => {
  f.value = f.value.replace(/\D/g, "");
  if (f === dd.postcode1 && f.value.length === 4) dd.postcode2.focus();
}));
dd.phone.addEventListener("input", () => { dd.phone.value = dd.phone.value.replace(/[^\d ()-]/g, ""); });

// Periodicidade: the box opens its list (a click on an option chooses it, as do the arrows and Enter; Esc or a click
// outside closes it)
const ddPeriodBtn = $("ddPeriodBtn");
const ddPeriodList = document.querySelector(".qd-period-list");
const ddPeriodItems = [...ddPeriodList.children];
let ddPeriodActive = -1;
function periodActive(i) {
  ddPeriodActive = i;
  ddPeriodItems.forEach((li, j) => li.classList.toggle("is-active", j === i));
}
function periodOpen(open) {
  ddPeriodList.hidden = !open;
  ddPeriodBtn.setAttribute("aria-expanded", String(open));
  periodActive(open ? ddPeriodItems.findIndex((li) => li.dataset.value === dd.period.value) : -1);
}
function periodChoose(li) {
  dd.period.value = li.dataset.value;
  ddPeriodBtn.querySelector(".qd-period-text").textContent = li.textContent;
  ddPeriodItems.forEach((x) => x.setAttribute("aria-selected", String(x === li)));
  dd.period.dispatchEvent(new Event("change", { bubbles: true }));
  periodOpen(false);
  ddPeriodBtn.focus();
}
ddPeriodBtn.addEventListener("click", () => periodOpen(ddPeriodList.hidden));
ddPeriodList.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li) periodChoose(li); });
ddPeriodBtn.addEventListener("keydown", (e) => {
  if (ddPeriodList.hidden) {
    if (e.key === "ArrowDown") { e.preventDefault(); periodOpen(true); }
    return;
  }
  if (e.key === "ArrowDown") periodActive(Math.min(ddPeriodActive + 1, ddPeriodItems.length - 1));
  else if (e.key === "ArrowUp") periodActive(Math.max(ddPeriodActive - 1, 0));
  else if (e.key === "Enter" && ddPeriodActive >= 0) periodChoose(ddPeriodItems[ddPeriodActive]);
  else if (e.key === "Escape" || e.key === "Tab") { periodOpen(false); return; }
  else return;
  e.preventDefault();
});
document.addEventListener("click", (e) => { if (!e.target.closest(".qd-period")) periodOpen(false); });

// an IBAN is right when its check digits are (ISO 13616: moved to the end, letters as numbers, mod 97 is 1)
function ibanOk(raw) {
  const s = raw.replace(/\s/g, "");
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return false;
  const digits = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let rest = 0;
  for (const d of digits) rest = (rest * 10 + Number(d)) % 97;
  return rest === 1;
}
function phoneOk() {
  try { return libphonenumber.isValidPhoneNumber(dd.phone.value, dd.phoneCode.value); } catch { return dd.phone.value.replace(/\D/g, "").length >= 9; }
}
const ddChecks = {
  iban: () => ibanOk(dd.iban.value),
  bic: () => /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(dd.bic.value),
  period: () => dd.period.value !== "",
  name: () => dd.name.value.trim() !== "",
  phone: phoneOk,
  email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dd.email.value.trim()),
  address: () => dd.address.value.trim() !== "",
  postcode: () => dd.town.value.trim() !== "" && (dd.country.value === "PT"
    ? /^\d{4}$/.test(dd.postcode1.value) && /^\d{3}$/.test(dd.postcode2.value)
    : (dd.postcode1.value + dd.postcode2.value).trim() !== ""),
  agree: () => dd.agree.checked,
};
// a wrong field turns red (its box and title), until it's changed again
ddForm.addEventListener("input", (e) => e.target.closest("[data-field]")?.classList.remove("is-invalid"));
ddForm.addEventListener("change", (e) => e.target.closest("[data-field]")?.classList.remove("is-invalid"));

// Seguinte: everything checked; all right, the adhesion kept with the period (the IBAN only by its last 4 digits)
ddForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const wrong = Object.keys(ddChecks).filter((k) => !ddChecks[k]());
  Object.keys(ddChecks).forEach((k) => ddForm.querySelector(`[data-field="${k}"]`).classList.toggle("is-invalid", wrong.includes(k)));
  if (wrong.length) {
    ddForm.querySelector(`[data-field="${wrong[0]}"]`).scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const debit = { period: dd.period.value, ibanLast4: dd.iban.value.replace(/\s/g, "").slice(-4) };
  try { sessionStorage.setItem("lfcQuotasChoice", JSON.stringify({ ...ddChoice, method: "debito-direto", debit })); } catch {}
  // (what comes after the adhesion is built next)
});

// back to the top: always there, as on the other steps
const ddTop = document.querySelector(".nt-top");
ddTop.hidden = false;
ddTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
