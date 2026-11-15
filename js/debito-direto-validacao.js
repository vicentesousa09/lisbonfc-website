// Adesão ao Débito Direto, step 4 "Validação" (debito-direto-validacao.html), once the SMS code is in on step 3: the
// adhesion done, and its details (the IBAN only by its last 4 digits). Opened before that, back to step 1

let ddzState = null;
try { ddzState = JSON.parse(sessionStorage.getItem("lfcDebitoDireto")); } catch {}
if (!ddzState?.done) location.replace("debito-direto-adesao.html");
const ddzD = ddzState?.details || {};

const DDZ_PERIODS = { mensal: "Mensal", bimestral: "Bimestral", trimestral: "Trimestral", semestral: "Semestral", anual: "Anual" };
const ddzRows = [
  ["Nº Sócio", ddzState?.socio],
  ["Titular", ddzD.name],
  ["IBAN", ddzD.ibanLast4 && `•••• •••• •••• ${ddzD.ibanLast4}`],
  ["BIC/Swift", ddzD.bic],
  ["Periodicidade", DDZ_PERIODS[ddzD.period] || ddzD.period],
  ["Data de adesão", ddzState?.done],
  ["Telemóvel", ddzD.phone],
  ["E-mail", ddzD.email],
  ["Morada", [ddzD.address, `${ddzD.postcode || ""} ${ddzD.town || ""}`.trim(), ddzD.country].filter(Boolean).join(", ")],
];
document.querySelector("[data-ddz-details]").replaceChildren(...ddzRows.filter(([, v]) => v).map(([label, value]) => {
  const row = document.createElement("div");
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  dd.textContent = value;
  row.append(dt, dd);
  return row;
}));

// back to the top: shown once the page has scrolled down
const ddzTop = document.querySelector(".nt-top");
const ddzShowTop = () => { ddzTop.hidden = window.scrollY < 300; };
window.addEventListener("scroll", ddzShowTop, { passive: true });
ddzShowTop();
ddzTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
