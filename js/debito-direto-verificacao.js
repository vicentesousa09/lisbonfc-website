// Adesão ao Débito Direto, step 3 "Verificação SMS" (debito-direto-verificacao.html), after Continuar on step 2. The
// code sent by SMS to the phone given there (its last 3 digits shown), in six boxes of one digit each: typing moves on,
// Backspace goes back, a pasted code fills them all. Continuar wants all six (the boxes red, with a line, until then);
// "Reenviar código" empties them and says so for a few seconds. There's no SMS service behind the site yet, so no code
// is sent and any 6 digits are taken

let ddvState = null;
try { ddvState = JSON.parse(sessionStorage.getItem("lfcDebitoDireto")); } catch {}
// step 2 not done: back to it
if (!ddvState?.details) location.replace("debito-direto-dados-pessoais.html");
ddvState = ddvState || {};

const ddvPhone = (ddvState.details?.phone || "").replace(/\D/g, "");
document.querySelector("[data-ddv-phone]").textContent = `••• ••• ${ddvPhone.slice(-3)}`;

const ddvForm = document.querySelector(".ddv-form");
const ddvField = document.querySelector('[data-field="code"]');
const ddvError = document.querySelector("[data-ddv-error]");
const ddvBoxes = [...ddvField.querySelectorAll("input")];
const ddvClear = () => { ddvField.classList.remove("is-invalid"); ddvError.hidden = true; };
function ddvFill(from, text) {
  const digits = text.replace(/\D/g, "").slice(0, ddvBoxes.length - from);
  [...digits].forEach((d, i) => { ddvBoxes[from + i].value = d; });
  ddvBoxes[Math.min(from + digits.length, ddvBoxes.length - 1)].focus();
}
ddvBoxes.forEach((box, i) => {
  box.addEventListener("input", () => {
    const typed = box.value.replace(/\D/g, "");
    box.value = "";
    ddvClear();
    if (typed) ddvFill(i, typed);
  });
  box.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !box.value && i > 0) { e.preventDefault(); ddvBoxes[i - 1].value = ""; ddvBoxes[i - 1].focus(); }
    else if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); ddvBoxes[i - 1].focus(); }
    else if (e.key === "ArrowRight" && i < ddvBoxes.length - 1) { e.preventDefault(); ddvBoxes[i + 1].focus(); }
  });
  box.addEventListener("paste", (e) => { e.preventDefault(); ddvClear(); ddvFill(i, e.clipboardData.getData("text")); });
  box.addEventListener("focus", () => box.select());
});
ddvBoxes[0].focus({ preventScroll: true });

const ddvResend = document.querySelector("[data-ddv-resend]");
let ddvResendTimer = 0;
ddvResend.addEventListener("click", () => {
  ddvBoxes.forEach((b) => { b.value = ""; });
  ddvClear();
  ddvBoxes[0].focus();
  ddvResend.disabled = true;
  ddvResend.textContent = "Código reenviado";
  clearTimeout(ddvResendTimer);
  ddvResendTimer = setTimeout(() => { ddvResend.disabled = false; ddvResend.textContent = "Reenviar código"; }, 4000);
});

// Continuar: the six digits there, then the adhesion is done: kept on the account (its period, bank and the IBAN's last
// 4 digits), and on to step 4
ddvForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (ddvBoxes.some((b) => !b.value)) {
    ddvField.classList.add("is-invalid");
    ddvError.hidden = false;
    ddvBoxes.find((b) => !b.value).focus();
    return;
  }
  const d = new Date();
  const since = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  let account = null;
  try { account = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
  try {
    if (account) {
      account.directDebit = { period: ddvState.details.period, ibanLast4: ddvState.details.ibanLast4, bic: ddvState.details.bic, since };
      localStorage.setItem("lfcSession", JSON.stringify(account));
    }
    sessionStorage.setItem("lfcDebitoDireto", JSON.stringify({ ...ddvState, done: since }));
  } catch {}
  location.href = "debito-direto-validacao.html";
});

// back to the top: shown once the page has scrolled down
const ddvTop = document.querySelector(".nt-top");
const ddvShowTop = () => { ddvTop.hidden = window.scrollY < 300; };
window.addEventListener("scroll", ddvShowTop, { passive: true });
ddvShowTop();
ddvTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
