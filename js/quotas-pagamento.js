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
  qpNextBtn.disabled = false;
});

// Seguinte: the way to pay kept with the period
qpNextBtn.addEventListener("click", () => {
  if (!qpMethod) return;
  try { sessionStorage.setItem("lfcQuotasChoice", JSON.stringify({ ...qpChoice, method: qpMethod })); } catch {}
  // Débito Direto: its adhesion form (what comes after the other ways is built next)
  if (qpMethod === "debito-direto") location.href = "quotas-debito-direto.html";
});

// back to the top: always there, as on the other steps
const qpTop = document.querySelector(".nt-top");
qpTop.hidden = false;
qpTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
