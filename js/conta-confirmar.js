// Conta Lisbon FC, creating an account, still step 2 (conta-confirmar.html): a code is sent to the contact given on
// Dados Pessoais that wasn't checked yet (the phone, or the e-mail when the account was started with a phone)

const form = document.querySelector(".ac-confirm-form");
const code = document.getElementById("acConfirmCode");
const btn = form.querySelector(".ac-btn");

// what Dados Pessoais left for this page (kept for the tab only, never in the address)
let confirm = { by: "phone", to: "" };
try { confirm = JSON.parse(sessionStorage.getItem("acRegConfirm")) || confirm; } catch {}
const byEmail = confirm.by === "email";
form.querySelector("[data-what]").textContent = byEmail ? "E-mail" : "Telemóvel";
form.querySelector("[data-to]").textContent = confirm.to;
form.querySelector("[data-channel]").textContent = byEmail ? "E-MAIL" : "SMS";
document.querySelector("[data-sent-to]").textContent = byEmail ? "e-mail" : "telemóvel";

// no codes are really sent yet (there's no server), so this demo code stands in for the one that would arrive
const DEMO_CODE = "123456";
const error = form.querySelector(".ac-error");

// the code box takes digits only; the button lights up once there's something in it, and typing again clears the
// "incorreto" message
code.addEventListener("input", () => {
  code.value = code.value.replace(/\D/g, "");
  btn.disabled = code.value === "";
  error.hidden = true;
});

// "Enviar Novo Código por SMS/E-MAIL" sends a new code quietly (once there's a server); nothing changes on the page

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (btn.disabled) return;
  // the code is checked behind the loader, as a real one would be
  showLoader();
  setTimeout(() => {
    // a wrong code: "Código de verificação incorreto." in red under the box
    if (code.value !== DEMO_CODE) {
      hideLoader();
      error.hidden = false;
      return;
    }
    // a right code: the account is done; it's signed in and the home page opens (the sign-up details are cleared)
    try {
      localStorage.setItem("lfcSession", JSON.stringify({ name: confirm.name || "", email: confirm.email || "", phone: confirm.phone || "", since: Date.now() }));
      ["acRegId", "acRegConfirm"].forEach((k) => sessionStorage.removeItem(k));
    } catch {}
    location.href = "/";
  }, 1600);
});

// coming back with the browser's back button: start clean, not on the loader
window.addEventListener("pageshow", (e) => {
  if (e.persisted) location.reload();
});
