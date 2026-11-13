// Meios de Pagamento (meios-de-pagamento.html), opened by Gerir on the profile's Dados Pessoais. The account's saved
// cards, one box each: the default one outlined, with its tick (another can be made the default), and a bin that
// removes it; the last box adds a card. Only the last four digits and the expiry are kept (in the session, until
// there's a server): never the full number or the CVC

const saveAccount = () => { try { localStorage.setItem("lfcSession", JSON.stringify(account)); } catch {} };
account.cards = account.cards || [];
// expiry per card (as "9/2027"); cards saved before there was one show a stand-in date
account.cardExp = account.cardExp || {};
const mpExp = (last4) => account.cardExp[last4] || "12/2028";
if (!account.cards.includes(account.defaultCard)) account.defaultCard = account.cards[0];

const mpList = document.querySelector("[data-mp-cards]");
function renderCards() {
  mpList.innerHTML = account.cards.map((last4) => {
    const isDefault = last4 === account.defaultCard;
    return `<div class="mp-card${isDefault ? " is-default" : ""}" data-last4="${last4}">`
      + `<p class="mp-card-title">XXXX ${last4}</p>`
      + `<button type="button" class="mp-delete" aria-label="Remover cartão"><svg viewBox="0 0 19 20" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linejoin="round"><path d="M1 4h17M6.5 4V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 4l1.2 14a1 1 0 0 0 1 1h8.6a1 1 0 0 0 1-1L16 4M11.5 6.5v10"/></svg></button>`
      + (isDefault
        ? `<p class="mp-default"><svg viewBox="0 0 12 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m1 5 3.5 3.5L11 1.5"/></svg>Pré-definido</p>`
        : `<button type="button" class="mp-default mp-make-default" aria-label="Tornar pré-definido"><span class="mp-default-box"></span>Pré-definido</button>`)
      + `<dl class="mp-details"><div><dt>Número Cartão</dt><dd>XXXX XXXX XXXX ${last4}</dd></div>`
      + `<div><dt>Data Validade</dt><dd>${mpExp(last4)}</dd></div></dl></div>`;
  }).join("");
}
renderCards();

// the bin removes a card (the default passes to the first one left); "Tornar pré-definido" makes that one the default
mpList.addEventListener("click", (e) => {
  const card = e.target.closest(".mp-card");
  if (!card) return;
  const last4 = card.dataset.last4;
  if (e.target.closest(".mp-delete")) {
    account.cards = account.cards.filter((c) => c !== last4);
    delete account.cardExp[last4];
    if (account.defaultCard === last4) account.defaultCard = account.cards[0];
  } else if (e.target.closest(".mp-make-default")) {
    account.defaultCard = last4;
  } else return;
  saveAccount();
  renderCards();
});

// adding a card: the number in groups of four, the expiry as MM/AA, the CVC digits only; Guardar checks them (a real
// card number, a date still to come, 3 or 4 digits) and keeps only the last four digits and the expiry
const mpForm = document.querySelector(".mp-new");
const mpNumber = document.getElementById("mpNumber");
const mpExpiry = document.getElementById("mpExp");
const mpCvc = document.getElementById("mpCvc");
const mpError = document.querySelector("[data-mp-error]");
mpNumber.addEventListener("input", () => {
  mpNumber.value = mpNumber.value.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");
});
mpExpiry.addEventListener("input", () => {
  const d = mpExpiry.value.replace(/\D/g, "").slice(0, 4);
  mpExpiry.value = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
});
mpCvc.addEventListener("input", () => { mpCvc.value = mpCvc.value.replace(/\D/g, "").slice(0, 4); });
[mpNumber, mpExpiry, mpCvc].forEach((f) => f.addEventListener("input", () => {
  f.classList.remove("is-invalid");
  mpError.hidden = true;
}));

// the Luhn check every card number passes
function luhnOk(digits) {
  let sum = 0;
  [...digits].reverse().forEach((c, i) => {
    let n = Number(c);
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  });
  return digits.length >= 13 && sum % 10 === 0;
}
mpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const digits = mpNumber.value.replace(/\D/g, "");
  const [mm, yy] = mpExpiry.value.split("/").map(Number);
  const now = new Date();
  const expOk = mm >= 1 && mm <= 12 && yy >= 0 && new Date(2000 + yy, mm, 1) > now;
  const problems = [];
  if (!luhnOk(digits)) problems.push([mpNumber, "O número do cartão não é válido."]);
  if (!expOk) problems.push([mpExpiry, "A validade não é válida."]);
  if (!/^\d{3,4}$/.test(mpCvc.value)) problems.push([mpCvc, "O CVC não é válido."]);
  if (problems.length) {
    problems.forEach(([f]) => f.classList.add("is-invalid"));
    mpError.textContent = problems[0][1];
    mpError.hidden = false;
    return;
  }
  const last4 = digits.slice(-4);
  if (!account.cards.includes(last4)) account.cards.push(last4);
  account.cardExp[last4] = `${mm}/${2000 + yy}`;
  if (!account.defaultCard) account.defaultCard = last4;
  saveAccount();
  mpForm.reset();
  renderCards();
});

// the card's network from its first digits, drawn as a whole little card in its colours (as on the payment page,
// pagamento.js: Mastercard and Maestro on black, Visa and American Express on blue), in place of the plain card drawing
const mpCardShape = (fill) => `<rect x="1.2" y="5" width="21.6" height="14" rx="2" fill="${fill}"/>`;
const MP_BRANDS = [
  { name: "Visa", test: /^4/, icon: `${mpCardShape("#1A1F71")}<text x="12" y="14.6" text-anchor="middle" font-family="Arial, sans-serif" font-size="7.4" font-weight="900" font-style="italic" fill="#fff">VISA</text>` },
  { name: "Mastercard", test: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/, icon: `${mpCardShape("#111418")}<circle cx="9.6" cy="12" r="4.2" fill="#EB001B"/><circle cx="14.4" cy="12" r="4.2" fill="#F79E1B"/><path d="M12 8.55a4.2 4.2 0 0 1 0 6.9a4.2 4.2 0 0 1 0-6.9z" fill="#FF5F00"/>` },
  { name: "American Express", test: /^3[47]/, icon: `${mpCardShape("#2E77BC")}<text x="12" y="14.3" text-anchor="middle" font-family="Arial, sans-serif" font-size="6" font-weight="900" fill="#fff">AMEX</text>` },
  { name: "Maestro", test: /^(5[06-8]|6[37])/, icon: `${mpCardShape("#111418")}<circle cx="9.6" cy="12" r="4.2" fill="#EB001B"/><circle cx="14.4" cy="12" r="4.2" fill="#00A2E5"/><path d="M12 8.55a4.2 4.2 0 0 1 0 6.9a4.2 4.2 0 0 1 0-6.9z" fill="#7375CF"/>` },
];
const mpCardIcon = document.querySelector(".mp-field--number svg");
const MP_DEFAULT_ICON = { viewBox: mpCardIcon.getAttribute("viewBox"), html: mpCardIcon.innerHTML };
// a number left unfinished or wrong: the plain card in light red with a red "!" badge on its top-right corner (as on
// the payment page), and the number in red, until it's typed in again
// (the card drawn a little smaller there)
const MP_INVALID_ICON = '<g transform="translate(15 10) scale(0.88) translate(-15 -10)">' + MP_DEFAULT_ICON.html
  .replace('fill="#D3DAF9"', 'fill="#F5C4C4"')
  .replaceAll('fill="#A6B4F2"', 'fill="#EB9E9E"') + '</g>'
  + '<circle cx="25" cy="4.5" r="6.8" fill="#E00000"/><path d="M25 0.9v4.1" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/><circle cx="25" cy="7.9" r="1" fill="#fff"/>';
let mpNumberInvalid = false;
function showBrand() {
  const brand = mpNumberInvalid ? null : MP_BRANDS.find((b) => b.test.test(mpNumber.value.replace(/\D/g, "")));
  const state = mpNumberInvalid ? "invalid" : brand ? brand.name : "";
  mpNumber.classList.toggle("is-invalid", mpNumberInvalid);
  if ((mpCardIcon.dataset.brand || "") === state) return;
  mpCardIcon.dataset.brand = state;
  mpCardIcon.setAttribute("viewBox", brand ? "1.2 5 21.6 14" : MP_DEFAULT_ICON.viewBox);
  mpCardIcon.innerHTML = mpNumberInvalid ? MP_INVALID_ICON : brand ? brand.icon : MP_DEFAULT_ICON.html;
  mpCardIcon.setAttribute("aria-label", mpNumberInvalid ? "Número inválido" : brand ? brand.name : "");
  // the new icon zooms in from small as it takes the old one's place
  mpCardIcon.animate([{ transform: "scale(0.4)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 260, easing: "cubic-bezier(0.34, 1.4, 0.64, 1)" });
}
mpNumber.addEventListener("input", () => {
  mpNumberInvalid = false;
  showBrand();
});
// leaving the box with a number that isn't a whole, real card number
mpNumber.addEventListener("blur", () => {
  mpNumberInvalid = mpNumber.value !== "" && !luhnOk(mpNumber.value.replace(/\D/g, ""));
  showBrand();
});
// (and on Guardar, an empty box too)
mpForm.addEventListener("submit", () => {
  mpNumberInvalid = !luhnOk(mpNumber.value.replace(/\D/g, ""));
  showBrand();
});
mpForm.addEventListener("reset", () => setTimeout(() => {
  mpNumberInvalid = false;
  showBrand();
}));
