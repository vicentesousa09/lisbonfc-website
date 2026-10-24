// Débito Direto: four-step form (Dados de Sócio > Dados Pessoais > Verificação SMS > Validação).
// Everything happens on the page; nothing is sent anywhere.
const ddPanels = document.querySelectorAll(".dd-panel");
const ddSteps = document.querySelectorAll(".dd-step");
const ddCrumb = document.getElementById("ddCrumb");
let ddCurrent = 1;

function ddShowStep(n) {
  ddCurrent = n;
  ddPanels.forEach((p) => p.classList.toggle("is-active", Number(p.dataset.step) === n));
  ddSteps.forEach((s, i) => {
    s.classList.toggle("is-active", i + 1 === n);
    s.classList.toggle("is-done", i + 1 < n);
  });
  ddCrumb.textContent = ddSteps[n - 1].textContent.replace(/^\d/, "").trim();
  window.scrollTo({ top: 0, behavior: "instant" });
}

// Simple checks per field, on top of "required"
function ddFieldError(input) {
  const v = input.value.trim();
  if (input.type === "checkbox") return input.checked ? "" : "Tens de autorizar o débito.";
  if (!v) return "Campo obrigatório.";
  if (input.name === "socio" && !/^\d+$/.test(v)) return "Usa apenas números.";
  if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Email inválido.";
  if (input.type === "tel" && !/^\+?\d{9,15}$/.test(v.replace(/\s/g, ""))) return "Telemóvel inválido.";
  if (input.name === "iban" && !/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(v.replace(/\s/g, "").toUpperCase())) return "IBAN inválido.";
  if (input.name === "codigo" && !/^\d{6}$/.test(v)) return "O código tem 6 dígitos.";
  return "";
}

function ddValidate(form) {
  let ok = true;
  form.querySelectorAll("input").forEach((input) => {
    const holder = input.closest(".dd-field, .dd-check");
    const msg = ddFieldError(input);
    holder.classList.toggle("has-error", !!msg);
    let err = holder.querySelector(".dd-error");
    if (msg && !err) {
      err = document.createElement("span");
      err.className = "dd-error";
      holder.appendChild(err);
    }
    if (err) err.textContent = msg;
    if (msg && ok) { input.focus(); ok = false; }
  });
  return ok;
}

document.querySelectorAll("form.dd-panel").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (ddValidate(form)) ddShowStep(ddCurrent + 1);
  });
  // clear a field's error as soon as it's edited
  form.addEventListener("input", (e) => {
    const holder = e.target.closest(".has-error");
    if (holder && !ddFieldError(e.target)) holder.classList.remove("has-error");
  });
});

document.querySelectorAll("[data-back]").forEach((btn) => {
  btn.addEventListener("click", () => ddShowStep(ddCurrent - 1));
});

const ddResend = document.querySelector(".dd-resend");
ddResend.addEventListener("click", () => {
  ddResend.textContent = "Código reenviado";
  ddResend.disabled = true;
  setTimeout(() => { ddResend.textContent = "Reenviar código"; ddResend.disabled = false; }, 30000);
});
