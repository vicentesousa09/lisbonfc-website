// Adesão ao Débito Direto, step 1 "Dados de Sócio" (debito-direto-adesao.html), opened by Aderir on the profile's
// Débito Direto. As Benfica's: the member's number and identity document's number, the account's to start (the header's
// script sends someone signed out to the sign-in page); Continuar checks both are there and goes on to step 2,
// Dados Pessoais (debito-direto-dados-pessoais.html)

let ddaAccount = null;
try { ddaAccount = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
ddaAccount = ddaAccount || {};

const ddaForm = document.querySelector(".dda-form");
const ddaSocio = document.getElementById("ddaSocio");
const ddaDoc = document.getElementById("ddaDoc");
let ddaKept = null;
try { ddaKept = JSON.parse(sessionStorage.getItem("lfcDebitoDireto")); } catch {}
ddaSocio.value = ddaKept?.socio || ddaAccount.socio || "";
ddaDoc.value = ddaKept?.doc || ddaAccount.personal?.docnumber || "";

// the member's number: digits only
ddaSocio.addEventListener("input", () => { ddaSocio.value = ddaSocio.value.replace(/\D/g, ""); });
// a box left empty turns red when Continuar is pressed, until something is typed in it
ddaForm.addEventListener("input", (e) => e.target.closest("[data-field]")?.classList.remove("is-invalid"));
ddaForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const empty = [ddaSocio, ddaDoc].filter((input) => !input.value.trim());
  [ddaSocio, ddaDoc].forEach((input) => input.closest("[data-field]").classList.toggle("is-invalid", empty.includes(input)));
  if (empty.length) { empty[0].focus(); return; }
  // on to step 2, Dados Pessoais, with the member's numbers
  try { sessionStorage.setItem("lfcDebitoDireto", JSON.stringify({ socio: ddaSocio.value.trim(), doc: ddaDoc.value.trim() })); } catch {}
  location.href = "debito-direto-dados-pessoais.html";
});

// back to the top: shown once the page has scrolled down
const ddaTop = document.querySelector(".nt-top");
const ddaShowTop = () => { ddaTop.hidden = window.scrollY < 300; };
window.addEventListener("scroll", ddaShowTop, { passive: true });
ddaShowTop();
ddaTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
