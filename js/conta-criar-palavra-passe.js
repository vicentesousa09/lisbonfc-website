// Conta Lisbon FC, creating an account, step 1 (conta-criar-palavra-passe.html): the e-mail from the code step shown
// locked, the new password twice (each with its eye), checked against the rules on the right when "Seguinte" is pressed

const form = document.querySelector(".ac-create-form");
const email = document.getElementById("acNewEmail");
const pass = document.getElementById("acNewPass");
const pass2 = document.getElementById("acNewPass2");
const rulesError = form.querySelector('[data-error="rules"]');
const matchError = form.querySelector('[data-error="match"]');

// the e-mail/phone typed on the code step (kept for the tab only, never in the address)
try { email.value = sessionStorage.getItem("acRegId") || ""; } catch {}
// (a phone number instead of an e-mail: the label says so)
if (email.value && !email.value.includes("@")) form.querySelector('label[for="acNewEmail"]').textContent = "Telemóvel*";

// the password boxes are text boxes shown as dots (so Chrome doesn't pop up its suggested password);
// a browser that can't draw the dots gets real password boxes instead
const canMask = CSS.supports("-webkit-text-security", "disc");
if (!canMask) [pass, pass2].forEach((input) => { input.type = "password"; });

form.querySelectorAll(".ac-eye").forEach((eye) => {
  eye.addEventListener("click", () => {
    const input = eye.previousElementSibling;
    const show = canMask ? !input.classList.contains("is-shown") : input.type === "password";
    if (canMask) input.classList.toggle("is-shown", show);
    else input.type = show ? "text" : "password";
    eye.setAttribute("aria-label", show ? "Esconder palavra-passe" : "Mostrar palavra-passe");
    eye.classList.toggle("is-on", show);
  });
});

// at least 8 characters, an upper-case letter, a lower-case letter and a number
const RULES = [(v) => v.length >= 8, (v) => /[A-Z]/.test(v), (v) => /[a-z]/.test(v), (v) => /[0-9]/.test(v)];
const meetsRules = (v) => RULES.every((rule) => rule(v));

// "Palavra-passe: Fraca" under the first box, and inside it a bar that slides wider (and changes colour) with each level
const strength = form.querySelector(".ac-strength");
const strengthBar = form.querySelector(".ac-strength-bar");
const strengthText = strength.querySelector("[data-strength-text]");
// one rule met (or none): Fraca; two or three: Média; all four: Forte
const nextBtn = form.querySelector(".ac-btn");
const ruleItems = document.querySelectorAll(".ac-rules li[data-rule]");
const LEVELS = ["", "Fraca", "Média", "Forte"];
function updateStrength() {
  const v = pass.value;
  const met = RULES.filter((rule) => rule(v)).length;
  const level = met === 4 ? 3 : met >= 2 ? 2 : 1;
  strength.hidden = v === "";
  strength.dataset.level = level;
  // the bar stays in place so it can slide: no level (no fill, no track) while the box is empty
  if (v === "") delete strengthBar.dataset.level;
  else strengthBar.dataset.level = level;
  // the fill grows a quarter for each rule met (a quarter even with none), so every rule moves it
  strengthBar.style.setProperty("--fill", v === "" ? "0%" : Math.max(met, 1) * 25 + "%");
  strengthText.textContent = LEVELS[level];
  // the rules on the right: each one met moves right with a blue tick
  ruleItems.forEach((li) => li.classList.toggle("is-met", RULES[li.dataset.rule](v)));
  updateNext();
}

// "Seguinte" stays grey until the password meets every rule and something is typed in the confirm box
function updateNext() {
  nextBtn.disabled = !meetsRules(pass.value) || pass2.value === "";
}

// typing again clears that box's message
pass.addEventListener("input", () => { rulesError.hidden = true; updateStrength(); });
// the confirm box: red with "As senhas digitadas não coincidem." when it doesn't repeat the password, checked when
// leaving the box and on "Seguinte"; typing in it again clears the red
const pass2Wrap = pass2.closest(".ac-input-wrap");
const pass2Label = form.querySelector('label[for="acNewPass2"]');
function showMismatch(on) {
  matchError.hidden = !on;
  pass2Wrap.classList.toggle("is-invalid", on);
  pass2Label.classList.toggle("is-invalid", on);
}
pass2.addEventListener("input", () => { showMismatch(false); updateNext(); });
pass2.addEventListener("blur", () => { if (pass2.value) showMismatch(pass2.value !== pass.value); });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  rulesError.hidden = meetsRules(pass.value);
  if (!rulesError.hidden) return;
  if (pass.value !== pass2.value) {
    showMismatch(true);
    return;
  }
  // on to "2. Dados Pessoais" (the password itself is never kept: there's no server to send it to yet)
  showLoader();
  setTimeout(() => { location.href = "conta-dados-pessoais.html"; }, 1600);
});

// coming back from Dados Pessoais with the browser's back button: start clean, not on the loader
window.addEventListener("pageshow", (e) => {
  if (e.persisted) location.reload();
});
