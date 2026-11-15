// Pagamento de Quotas, step 3 (quotas-pagamento.html), after the period chosen on step 2. How to pay, as Benfica's:
// a recurring payment (Débito Direto or a card) or a single one (card or MB WAY); Seguinte, once one is chosen, keeps
// it with the period

let qpChoice = null;
try { qpChoice = JSON.parse(sessionStorage.getItem("lfcQuotasChoice")); } catch {}
// no period chosen yet: back to step 2 (which sends on to step 1 when that's missing too)
if (!qpChoice) location.replace("quotas-valores.html");
let qpSession = null;
try { qpSession = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
document.querySelector("[data-qv-member]").textContent = qpChoice?.member || "";
document.querySelector("[data-qv-name]").textContent = (qpSession?.name || "").toLocaleUpperCase("pt");

// choosing a way to pay: it's outlined, and Seguinte wakes up
const qpNextBtn = document.querySelector("[data-qp-next-btn]");
let qpMethod = null;
document.querySelector(".qv-box").addEventListener("click", (e) => {
  const option = e.target.closest(".qp-option");
  if (!option) return;
  qpMethod = option.dataset.method;
  document.querySelectorAll(".qp-option").forEach((o) => {
    o.classList.toggle("is-selected", o === option);
    o.setAttribute("aria-pressed", String(o === option));
  });
  qpShowMbway();
});

// MB WAY: its phone number, with the country's code picked from the list (paises.js; Portugal to start). Seguinte only
// once it's a whole number: 9 digits starting with 9 for Portugal, 4 to 15 elsewhere. Picked, the box opens on it
// (ready to type), and closes again when another way is picked
const qpMbway = document.querySelector('[data-method="mbway"]');
const qpPanel = document.querySelector("[data-qp-mbway-panel]");
const qpPhone = document.getElementById("qpPhone");
const qpPhoneCode = document.getElementById("qpPhoneCode");
COUNTRIES.forEach((c) => qpPhoneCode.add(new Option(`${c.label} (+${c.dial})`, c.iso)));
qpPhoneCode.value = "PT";
makePicker(qpPhoneCode, qpPhoneCode.closest(".ac-tel-code"), qpPhoneCode.closest(".ac-tel"), true, true);
qpPhoneCode.addEventListener("change", () => {
  document.querySelector("[data-qp-dial]").textContent = `+${COUNTRIES.find((c) => c.iso === qpPhoneCode.value).dial}`;
  qpPhone.focus();
  qpShowMbway();
});
const qpPhoneDigits = () => qpPhone.value.replace(/\D/g, "");
const qpPhoneOk = () => (qpPhoneCode.value === "PT" ? /^9\d{8}$/.test(qpPhoneDigits()) : /^\d{4,15}$/.test(qpPhoneDigits()));
qpPhone.addEventListener("input", () => {
  qpPhone.value = qpPhoneDigits().slice(0, qpPhoneCode.value === "PT" ? 9 : 15);
  qpShowMbway();
});
function qpShowMbway() {
  const open = qpMethod === "mbway";
  qpPanel.inert = !open;
  if (open && !qpMbway.dataset.opened) { qpMbway.dataset.opened = "1"; setTimeout(() => qpPhone.focus({ preventScroll: true }), 50); }
  if (!open) delete qpMbway.dataset.opened;
  qpNextBtn.disabled = !qpMethod || (open && !qpPhoneOk());
}
// (the box isn't a button itself, so Enter and Space pick it as a click would)
qpMbway.addEventListener("keydown", (e) => {
  if (e.target === qpMbway && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); qpMbway.click(); }
});

// Seguinte: the way to pay kept with the period
qpNextBtn.addEventListener("click", () => {
  if (!qpMethod || qpNextBtn.disabled) return;
  // (MB WAY keeps the phone number too, with its country's code)
  const phone = qpMethod === "mbway" ? `+${COUNTRIES.find((c) => c.iso === qpPhoneCode.value).dial}${qpPhoneDigits()}` : undefined;
  try { sessionStorage.setItem("lfcQuotasChoice", JSON.stringify({ ...qpChoice, method: qpMethod, phone })); } catch {}
  // Débito Direto: its adhesion form
  if (qpMethod === "debito-direto") location.href = "quotas-debito-direto.html";
  // a card charged each period: the card's details
  if (qpMethod === "cartao-recorrente") location.href = "quotas-cartao.html";
  // a single payment by card: the card's details too, on their own page
  if (qpMethod === "cartao") location.href = "quotas-cartao-unico.html";
  // Referência Multibanco, and MB WAY with its number: nothing more about the payment, so on to the billing details
  if (qpMethod === "multibanco" || qpMethod === "mbway") location.href = "quotas-faturacao.html";
});

// back to the top: always there, as on the other steps
const qpTop = document.querySelector(".nt-top");
qpTop.hidden = false;
qpTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
