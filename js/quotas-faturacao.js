// Pagamento de Quotas, step 3, the billing details (quotas-faturacao.html), after choosing Referência Multibanco on
// quotas-pagamento.html (or after any other way to pay is filled in). As Benfica's: the invoice goes to "Consumidor Final" (only the account's e-mail and phone) or
// to the member by name, with their NIF when the account has one (picked to start; without a NIF, Consumidor Final
// is); Finalizar keeps the one picked with the period and the way to pay

let qfChoice = null;
try { qfChoice = JSON.parse(sessionStorage.getItem("lfcQuotasChoice")); } catch {}
// no period chosen yet: back to step 2 (which sends on to step 1 when that's missing too)
if (!qfChoice) location.replace("quotas-valores.html");
let qfSession = null;
try { qfSession = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
qfSession = qfSession || {};

// Voltar: back to where the way to pay was filled in (the card's page, the Débito Direto form, or the choice itself)
const QF_BACK = { "debito-direto": "quotas-debito-direto.html", "cartao-recorrente": "quotas-cartao.html", cartao: "quotas-cartao-unico.html" };
document.querySelector(".qv-back").href = QF_BACK[qfChoice?.method] || "quotas-pagamento.html";

// the account's details, in capitals as on Benfica's (the phone without its spaces)
const qfUpper = (s) => (s || "").toLocaleUpperCase("pt");
const qfNif = qfSession.personal?.nif || "";
document.querySelectorAll("[data-qf-email]").forEach((el) => { el.textContent = qfUpper(qfSession.email); });
document.querySelectorAll("[data-qf-phone]").forEach((el) => { el.textContent = (qfSession.phone || "").replace(/\s/g, ""); });
document.querySelector("[data-qf-name]").textContent = qfUpper(qfSession.name);
document.querySelector("[data-qf-nif]").textContent = qfNif;
document.querySelector("[data-qf-nif-line]").hidden = !qfNif;
// (no name on the account: only Consumidor Final)
const qfMember = document.querySelector('[data-billing="socio"]');
qfMember.hidden = !qfSession.name;

// billing details kept on the profile before: one more box each, as the member's (name, NIF if any, e-mail, phone)
const qfList = document.querySelector("[data-qf-options]");
(qfSession.billing || []).forEach((b, i) => {
  const option = qfMember.cloneNode(true);
  option.hidden = false;
  option.dataset.billing = `guardado-${i}`;
  option.querySelector("[data-qf-name]").textContent = qfUpper(b.name);
  option.querySelector("[data-qf-nif]").textContent = b.nif || "";
  option.querySelector("[data-qf-nif-line]").hidden = !b.nif;
  option.querySelector("[data-qf-email]").textContent = qfUpper(b.email);
  option.querySelector("[data-qf-phone]").textContent = b.phone;
  qfList.append(option);
});

// picking one outlines it
const qfOptions = [...document.querySelectorAll(".qf-option")];
let qfBilling = "";
function qfPick(billing) {
  qfBilling = billing;
  qfOptions.forEach((option) => {
    const picked = option.dataset.billing === billing;
    option.classList.toggle("is-selected", picked);
    option.setAttribute("aria-checked", String(picked));
  });
}
qfOptions.forEach((option) => option.addEventListener("click", () => { qfOpenNew(false); qfPick(option.dataset.billing); }));
const qfStart = qfSession.name && qfNif ? "socio" : "consumidor-final";
qfPick(qfStart);

// "Adicionar dados de faturação +": the form for new ones opens under it (its "+" a "-"; the boxes above unpicked),
// the name ready to type; "-" closes it and the box picked to start is picked again. Finalizar waits, while it's open,
// for the name, a whole phone number and an e-mail (a NIF, if any, of 9 digits); a box left wrong turns red (its title
// too) until it's changed
const qfAdd = document.querySelector("[data-qf-add]");
const qfNew = document.querySelector("[data-qf-new]");
const qfFinish = document.querySelector("[data-qf-finish]");
const qfName = document.getElementById("qfName");
const qfPhone = document.getElementById("qfPhone");
const qfPhoneCode = document.getElementById("qfPhoneCode");
const qfEmail = document.getElementById("qfEmail");
const qfNifBox = document.getElementById("qfNif");
let qfIsNew = false;
function qfOpenNew(open) {
  if (open === qfIsNew) return;
  qfIsNew = open;
  qfNew.classList.toggle("is-open", open);
  qfNew.inert = !open;
  qfAdd.setAttribute("aria-expanded", String(open));
  document.querySelector("[data-qf-add-sign]").textContent = open ? "-" : "+";
  if (open) { qfPick(""); qfName.focus({ preventScroll: true }); }
  else if (!qfBilling) qfPick(qfStart);
  qfReady();
}
qfAdd.addEventListener("click", () => qfOpenNew(!qfIsNew));

// the phone: its country's code picked from the list (paises.js; Portugal to start), digits only, in threes for Portugal
COUNTRIES.forEach((c) => qfPhoneCode.add(new Option(`${c.label} (+${c.dial})`, c.iso)));
qfPhoneCode.value = "PT";
makePicker(qfPhoneCode, qfPhoneCode.closest(".ac-tel-code"), qfPhoneCode.closest(".ac-tel"), true, true);
const qfDial = () => COUNTRIES.find((c) => c.iso === qfPhoneCode.value).dial;
qfPhoneCode.addEventListener("change", () => {
  document.querySelector("[data-qf-dial]").textContent = `+${qfDial()}`;
  qfPhone.dispatchEvent(new Event("input"));
  qfPhone.focus();
});
const qfDigits = (input) => input.value.replace(/\D/g, "");
qfPhone.addEventListener("input", () => {
  const pt = qfPhoneCode.value === "PT";
  const d = qfDigits(qfPhone).slice(0, pt ? 9 : 15);
  qfPhone.value = pt ? d.replace(/(\d{3})(?=\d)/g, "$1 ") : d;
});
qfNifBox.addEventListener("input", () => { qfNifBox.value = qfDigits(qfNifBox).slice(0, 9); });

const qfChecks = {
  name: () => qfName.value.trim().length >= 2,
  phone: () => (qfPhoneCode.value === "PT" ? /^9\d{8}$/.test(qfDigits(qfPhone)) : /^\d{4,15}$/.test(qfDigits(qfPhone))),
  email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(qfEmail.value.trim()),
  nif: () => qfNifBox.value === "" || /^\d{9}$/.test(qfNifBox.value),
};
const qfField = (k) => qfNew.querySelector(`[data-field="${k}"]`);
function qfReady() { qfFinish.disabled = qfIsNew && !Object.values(qfChecks).every((ok) => ok()); }
Object.keys(qfChecks).forEach((k) => {
  const input = qfField(k).querySelector("input");
  input.addEventListener("input", () => { qfField(k).classList.remove("is-invalid"); qfReady(); });
  input.addEventListener("blur", () => { if (qfIsNew && input.value && !qfChecks[k]()) qfField(k).classList.add("is-invalid"); });
});
qfPhoneCode.addEventListener("change", qfReady);

// Finalizar: the billing kept with the period and the way to pay
qfFinish.addEventListener("click", () => {
  if (qfFinish.disabled) return;
  const saved = /^guardado-(\d+)$/.exec(qfBilling);
  let billing = qfBilling === "socio" ? { to: "socio", name: qfSession.name || "", nif: qfNif }
    : saved ? { to: "guardado", ...qfSession.billing[+saved[1]] } : { to: "consumidor-final" };
  // new details: kept with the choice and, ticked, on the account for next time (shown as one more box)
  if (qfIsNew) {
    billing = { to: "novo", name: qfName.value.trim(), phone: `+${qfDial()}${qfDigits(qfPhone)}`, email: qfEmail.value.trim(), nif: qfNifBox.value };
    if (document.getElementById("qfKeep").checked && qfSession.email) {
      qfSession.billing = [...(qfSession.billing || []), { name: billing.name, phone: billing.phone, email: billing.email, nif: billing.nif }];
      try { localStorage.setItem("lfcSession", JSON.stringify(qfSession)); } catch {}
    }
  }
  // Paid: there's no payment provider behind the site yet, so nothing is really charged; the payment is registered with
  // a number, joins the account's orders (Sócios, in Histórico de encomendas) and the confirmation opens
  const number = lfcPaymentNumber();
  const total = `${Number(qfChoice.total || 0).toFixed(2).replace(".", ",")}€`;
  qfSession.orders = [{ id: number, date: lfcToday(), status: "Processada", kind: "socios", total, items: [] }, ...(qfSession.orders || [])];
  // (the quotas now paid up to this month plus the extra ones chosen on step 2, as the profile shows them)
  const paidTo = new Date(new Date().getFullYear(), new Date().getMonth() + Number(qfChoice.extra || 0), 1);
  qfSession.quotasPaidUntil = `${paidTo.getFullYear()}-${String(paidTo.getMonth() + 1).padStart(2, "0")}`;
  try {
    localStorage.setItem("lfcSession", JSON.stringify(qfSession));
    sessionStorage.setItem("lfcLastPayment", JSON.stringify({ type: "quotas", number }));
    sessionStorage.removeItem("lfcQuotasChoice");
  } catch {}
  location.href = "obrigado.html";
});

// a payment's number, as Benfica's (10 capitals and digits, e.g. JSRZXZJAF1), and today as the orders show it
function lfcPaymentNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  return Array.from({ length: 10 }, (_, i) => chars[Math.floor(Math.random() * (i ? chars.length : 24))]).join("");
}
function lfcToday() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// back to the top: always there, as on the other steps
const qfTop = document.querySelector(".nt-top");
qfTop.hidden = false;
qfTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
