// Adesão (becoming a member), step 3 "Quotas" (adesao-quotas.html), after Continuar on step 2 (adesao-familia.html).
// As Benfica's: how often the quotas are paid (a dropdown) and how (Débito Direto or Cobrança Postal); Continuar stays
// grey until both are chosen, then keeps them with the details for step 4, Confirmação. Anterior goes back to step 2

let aqKept = null;
try { aqKept = JSON.parse(sessionStorage.getItem("lfcAdesao")); } catch {}
// the earlier steps not done: back to the first
if (!aqKept) location.replace("adesao-dados-pessoais.html");
aqKept = aqKept || {};

const aqForm = document.querySelector(".aq-form");
const aqPeriod = document.getElementById("aqPeriod");
const aqContinue = aqForm.querySelector(".dda-btn");
const aqMethod = () => aqForm.querySelector('input[name="aqMethod"]:checked')?.value || "";
const aqSync = () => { aqContinue.disabled = !(aqPeriod.value && aqMethod()); };

// Periodicidade: the box opens its list under it (a click on an option chooses it, as do the arrows and Enter; Esc or
// a click outside closes it), as on step 1
const aqBox = aqForm.querySelector('[data-field="period"]');
const aqBtn = aqBox.querySelector(".ddp-period-btn");
const aqList = aqBox.querySelector(".ddp-period-list");
const aqItems = [...aqList.children];
let aqActive = -1;
const aqMark = (i) => { aqActive = i; aqItems.forEach((li, j) => li.classList.toggle("is-active", j === i)); };
const aqOpen = (on) => { aqList.hidden = !on; aqBtn.setAttribute("aria-expanded", String(on)); aqMark(-1); };
function aqChoose(li) {
  aqPeriod.value = li.dataset.value;
  aqBox.querySelector("[data-aq-period-text]").textContent = li.textContent;
  aqBtn.classList.add("is-chosen");
  aqItems.forEach((x) => x.setAttribute("aria-selected", String(x === li)));
  aqOpen(false);
  aqBtn.focus();
  aqSync();
}
aqBtn.addEventListener("click", () => aqOpen(aqList.hidden));
aqList.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li) aqChoose(li); });
aqBtn.addEventListener("keydown", (e) => {
  if (aqList.hidden) { if (e.key === "ArrowDown") { e.preventDefault(); aqOpen(true); } return; }
  if (e.key === "ArrowDown") aqMark(aqActive < 0 ? Math.max(0, aqItems.findIndex((li) => li.dataset.value === aqPeriod.value)) : Math.min(aqActive + 1, aqItems.length - 1));
  else if (e.key === "ArrowUp") aqMark(Math.max(aqActive - 1, 0));
  else if (e.key === "Enter" && aqActive >= 0) aqChoose(aqItems[aqActive]);
  else if (e.key === "Escape" || e.key === "Tab") { aqOpen(false); return; }
  else return;
  e.preventDefault();
});
document.addEventListener("click", (e) => { if (!aqBox.contains(e.target)) aqOpen(false); });
aqForm.addEventListener("change", aqSync);

// coming back from step 4: what was chosen before
if (aqKept.period) { const li = aqItems.find((x) => x.dataset.value === aqKept.period); if (li) { aqChoose(li); aqBtn.blur(); } }
if (aqKept.method) { const r = aqForm.querySelector(`input[name="aqMethod"][value="${aqKept.method}"]`); if (r) r.checked = true; }
aqSync();

// Continuar: the choices kept with the details, for step 4, Confirmação
aqForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (aqContinue.disabled) return;
  try { sessionStorage.setItem("lfcAdesao", JSON.stringify({ ...aqKept, period: aqPeriod.value, method: aqMethod() })); } catch {}
  // on to step 4, Confirmação
  location.href = "adesao-confirmacao.html";
});

// back to the top: shown once the page has scrolled down
const aqTop = document.querySelector(".nt-top");
const aqShowTop = () => { aqTop.hidden = window.scrollY < 300; };
window.addEventListener("scroll", aqShowTop, { passive: true });
aqShowTop();
aqTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
