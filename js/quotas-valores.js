// Pagamento de Quotas, step 2 (quotas-valores.html), after step 1 and its reCAPTCHA. Whose quotas they are, then the
// periods to pay, as Benfica's: the months overdue, or those and the next ones (1, 2, 3, 6 months or a year), or
// another number of months; Seguinte, once one is chosen, keeps the choice for the payment step. Until there's a
// server, three months are overdue (up to this month); a month costs 3.00 €, the standard quota

const qvMember = (() => { try { return sessionStorage.getItem("lfcQuotasMember"); } catch { return null; } })();
// not through step 1: back to it
if (!qvMember) location.replace("quotas.html");
let qvSession = null;
try { qvSession = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
document.querySelector("[data-qv-member]").textContent = qvMember || "";
document.querySelector("[data-qv-name]").textContent = (qvSession?.name || "").toLocaleUpperCase("pt");

const QV_MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const QV_OVERDUE = 3;
const qvNow = new Date();
const qvYear = qvNow.getFullYear();
// the month n months from this one (0: this month), as a date
const qvMonth = (n) => new Date(qvYear, qvNow.getMonth() + n, 1);
const qvName = (d) => `${QV_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const QV_FEE = 3;
const qvFee = () => QV_FEE;
// the total for the overdue months and the next `extra` ones
function qvTotal(extra) {
  let total = 0;
  for (let n = -(QV_OVERDUE - 1); n <= extra; n++) total += qvFee(qvMonth(n));
  return total;
}
const qvPrice = (v) => `${v.toFixed(2)} €`;
const qvExtraName = (n) => (n === 12 ? "+ 1 Ano" : `+ ${n} ${n === 1 ? "Mês" : "Meses"}`);

function qvOption(extra, label, period) {
  return `<button type="button" class="qv-option${extra === 0 ? " qv-option--overdue" : ""}" data-extra="${extra}" aria-pressed="false">`
    + `<span class="qv-option-name">${label}</span><span class="qv-option-period">${period}</span>`
    + `<span class="qv-option-price">${qvPrice(qvTotal(extra))}</span></button>`;
}
document.querySelector("[data-qv-overdue]").innerHTML = qvOption(0, `${QV_OVERDUE} meses`, `de ${qvName(qvMonth(-(QV_OVERDUE - 1)))} até ${qvName(qvMonth(0))}`);
const qvNextBox = document.querySelector("[data-qv-next]");
const QV_NEXT = [1, 2, 3, 6, 12];
qvNextBox.innerHTML = QV_NEXT.map((n) => qvOption(n, qvExtraName(n), `até ${qvName(qvMonth(n))}`)).join("");

// choosing a period: it's outlined, and Seguinte wakes up
const qvNextBtn = document.querySelector("[data-qv-next-btn]");
let qvChosen = null;
// (a number typed in "Indicar outro período" chooses too, with no box outlined; null: nothing chosen)
function choose(extra, typed = false) {
  qvChosen = extra;
  document.querySelectorAll(".qv-option").forEach((o) => {
    const on = !typed && Number(o.dataset.extra) === extra;
    o.classList.toggle("is-selected", on);
    o.setAttribute("aria-pressed", String(on));
  });
  qvNextBtn.disabled = extra === null;
}
document.querySelector(".qv-box").addEventListener("click", (e) => {
  const option = e.target.closest(".qv-option");
  if (!option) return;
  choose(Number(option.dataset.extra));
  showOther(Number(option.dataset.extra));
});

// "Indicar outro período +": a box for a number of months, its total shown on the right (with a comma, as Benfica's)
// and chosen as it's typed; choosing a period above puts its number there
const qvOther = document.querySelector("[data-qv-other]");
const qvOtherBox = document.querySelector("[data-qv-other-box]");
const qvOtherInput = document.getElementById("qvOtherMonths");
const qvOtherPrice = document.querySelector("[data-qv-other-price]");
// the number in the box for each period: 3 for the overdue months, 6 more than the extra ones for the next (+ 1 Mês: 7,
// + 2 Meses: 8...). The number is a count of months from the first overdue one, priced at the monthly quota: 7 is the 3
// overdue and the next 4
const qvOtherMonths = (extra) => (extra === 0 ? QV_OVERDUE : extra + 6);
const qvOtherExtra = (months) => months - QV_OVERDUE;
const qvEuro = (v) => `${v.toFixed(2).replace(".", ",")} €`;
function showOther(extra) {
  const months = qvOtherMonths(extra);
  qvOtherInput.value = String(months);
  qvOtherPrice.textContent = qvEuro(qvTotal(qvOtherExtra(months)));
}
qvOther.addEventListener("click", () => {
  const open = qvOtherBox.hidden;
  qvOtherBox.hidden = !open;
  qvOther.setAttribute("aria-expanded", String(open));
  qvOther.textContent = open ? "Indicar outro período -" : "Indicar outro período +";
  // opened: the chosen period's number, or 7 (+ 1 Mês) chosen as if typed when there's none
  if (open && qvChosen !== null) showOther(qvChosen);
  else if (open) {
    qvOtherInput.value = "7";
    qvOtherInput.dispatchEvent(new Event("input"));
  }
});
qvOtherInput.addEventListener("input", () => {
  qvOtherInput.value = qvOtherInput.value.replace(/\D/g, "");
  const n = Number(qvOtherInput.value);
  if (n >= 1) {
    qvOtherPrice.textContent = qvEuro(qvTotal(qvOtherExtra(n)));
    choose(qvOtherExtra(n), true);
  } else {
    // emptied (or 0): a 0 shown in its place, and nothing to pay
    qvOtherPrice.textContent = "0,00 €";
    choose(null);
  }
});

// Seguinte: the choice kept for the payment step
qvNextBtn.addEventListener("click", () => {
  if (qvChosen === null) return;
  const choice = {
    member: qvMember, extra: qvChosen, total: qvTotal(qvChosen),
    from: qvName(qvMonth(-(QV_OVERDUE - 1))), until: qvName(qvMonth(qvChosen)),
  };
  try { sessionStorage.setItem("lfcQuotasChoice", JSON.stringify(choice)); } catch {}
  location.href = "quotas-pagamento.html";
});

// back to the top: always there, as on step 1
const qvTop = document.querySelector(".nt-top");
qvTop.hidden = false;
qvTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
