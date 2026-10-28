// Checkout, step 2 "Pagamento" (pagamento.html). The cart, header count and order summary come from
// checkout-summary.js, the promo code / gift voucher boxes from cart-codes.js

const pgForm = document.getElementById("pgForm");
const pgPay = document.getElementById("pgPay");

// MB Way: picking it opens a "Telemóvel" box with an "Adicionar" button under it. "Adicionar" only works once the
// number is complete (as many digits as the chosen country's numbers, kept in data-digits by phone-codes.js; Portugal: 9);
// once added, the box and button give way to a blue-outlined box with just the number in it. "Editar" brings the box
// back with an "Alterar" button that can always be clicked: with an incomplete number it turns the box and "Telemóvel"
// red with "Valor inválido." under the box, until the number is complete again
const pgMbway = document.getElementById("pgMbway");
const pgMbwayTel = document.getElementById("pgMbwayTel");
const pgMbwayAdd = document.getElementById("pgMbwayAdd");
const pgMbwayAdded = document.getElementById("pgMbwayAdded");
const pgMbwayField = pgMbwayTel.closest(".co-field");
let mbwayAdded = false;
let mbwayEditing = false;
const mbwayComplete = () => pgMbwayTel.value.replace(/\D/g, "").length >= Number(pgMbwayTel.dataset.digits || 9);
pgMbwayTel.addEventListener("input", () => {
  mbwayAdded = false;
  pgMbwayAdd.disabled = !mbwayEditing && !mbwayComplete();
  if (mbwayComplete()) pgMbwayField.classList.remove("is-invalid");
  updatePay();
});
pgMbwayAdd.addEventListener("click", () => {
  if (!mbwayComplete()) {
    pgMbwayField.classList.add("is-invalid");
    return;
  }
  mbwayAdded = true;
  mbwayEditing = false;
  pgMbwayField.classList.remove("is-invalid");
  document.getElementById("pgMbwayNumber").textContent = pgMbwayTel.value.trim();
  showPanels();
  updatePay();
});
document.getElementById("pgMbwayEdit").addEventListener("click", () => {
  mbwayAdded = false;
  mbwayEditing = true;
  pgMbwayAdd.textContent = "Alterar";
  pgMbwayAdd.disabled = false;
  showPanels();
  updatePay();
  pgMbwayTel.focus();
});

// Card: picking "Cartão Crédito/Débito" opens the card number, expiry (MM/AA) and CVC boxes with "Adicionar" under
// them, which works once all three are right: 16 digits (15 for American Express, starting 34 or 37), a month 01–12
// that hasn't passed, and a 3-digit CVC (4 for American Express). The number is spaced in fours and the "/" in the
// expiry is added while typing. Once added, the boxes give way to the blue box with the last 4 digits; "Editar"
// brings them back with "Alterar", which turns any wrong box red
const pgCard = document.getElementById("pgCard");
const pgCardNumber = document.getElementById("pgCardNumber");
const pgCardExpiry = document.getElementById("pgCardExpiry");
const pgCardCvc = document.getElementById("pgCardCvc");
const pgCardAdd = document.getElementById("pgCardAdd");
const pgCardAdded = document.getElementById("pgCardAdded");
let cardAdded = false;
let cardEditing = false;
const digits = (input) => input.value.replace(/\D/g, "");
const isAmex = () => /^3[47]/.test(digits(pgCardNumber));
const cardChecks = [
  [pgCardNumber, () => digits(pgCardNumber).length === (isAmex() ? 15 : 16)],
  [pgCardExpiry, () => {
    const [, mm, yy] = pgCardExpiry.value.match(/^(\d{2})\/(\d{2})$/) || [];
    if (!mm || mm < 1 || mm > 12) return false;
    const now = new Date();
    const year = 2000 + Number(yy);
    return year > now.getFullYear() || (year === now.getFullYear() && Number(mm) >= now.getMonth() + 1);
  }],
  [pgCardCvc, () => digits(pgCardCvc).length === (isAmex() ? 4 : 3)],
];
// a card picked from Link (see below) counts as complete
const cardComplete = () => linkSelected || cardChecks.every(([, ok]) => ok());
pgCardNumber.addEventListener("input", () => {
  pgCardNumber.value = digits(pgCardNumber).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  showCardBrand();
  showLink();
});

// The light blue card icon in front of the number turns into the card company's logo as soon as the first digits give
// it away (4 Visa; 51–55 or 2221–2720 Mastercard; 34/37 American Express; 50, 56–58, 63, 67 Maestro), and back when
// they no longer match. Each logo is a whole card in the company's colours (Mastercard and Maestro on black, Visa and
// American Express on blue), the same size as the default icon. A full 16-digit number that matches none of them turns
// the default card light red, with a red "!" badge on its top-right corner; until then it stays light blue
const pgCardIcon = document.getElementById("pgCardIcon");
const DEFAULT_CARD_ICON = pgCardIcon.innerHTML;
const UNKNOWN_CARD_ICON = DEFAULT_CARD_ICON
  .replace("<svg ", '<svg style="color: #F5C4C4" ')
  .replace("#B9D0F1", "#EB9E9E")
  .replace("</svg>", '<circle cx="19.2" cy="7" r="4.7" fill="#F03E3E"/>'
    + '<path d="M19.2 4.6v2.7" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>'
    + '<circle cx="19.2" cy="9.4" r=".7" fill="#fff"/></svg>');
const cardShape = (fill, stroke = "none") =>
  `<rect x="1.2" y="5" width="21.6" height="14" rx="2" fill="${fill}" stroke="${stroke}" stroke-width=".6"/>`;
const CARD_BRANDS = [
  { name: "Visa", test: /^4/, icon: `${cardShape("#1A1F71")}<text x="12" y="14.6" text-anchor="middle" font-family="Arial, sans-serif" font-size="7.4" font-weight="900" font-style="italic" fill="#fff">VISA</text>` },
  { name: "Mastercard", test: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/, icon: `${cardShape("#111418")}<circle cx="9.6" cy="12" r="4.2" fill="#EB001B"/><circle cx="14.4" cy="12" r="4.2" fill="#F79E1B"/><path d="M12 8.55a4.2 4.2 0 0 1 0 6.9a4.2 4.2 0 0 1 0-6.9z" fill="#FF5F00"/>` },
  { name: "American Express", test: /^3[47]/, icon: `${cardShape("#2E77BC")}<text x="12" y="14.3" text-anchor="middle" font-family="Arial, sans-serif" font-size="6" font-weight="900" fill="#fff">AMEX</text>` },
  { name: "Maestro", test: /^(5[06-8]|6[37])/, icon: `${cardShape("#111418")}<circle cx="9.6" cy="12" r="4.2" fill="#EB001B"/><circle cx="14.4" cy="12" r="4.2" fill="#00A2E5"/><path d="M12 8.55a4.2 4.2 0 0 1 0 6.9a4.2 4.2 0 0 1 0-6.9z" fill="#7375CF"/>` },
];
const brandOf = (number) => CARD_BRANDS.find((b) => b.test.test(number));
function showCardBrand() {
  const number = digits(pgCardNumber);
  const brand = brandOf(number);
  const unknown = !brand && number.length === 16;
  const state = brand ? brand.name : unknown ? "unknown" : "";
  if (pgCardIcon.dataset.brand === state) return;
  pgCardIcon.dataset.brand = state;
  pgCardIcon.innerHTML = brand
    ? `<svg viewBox="0 0 24 24" role="img" aria-label="${brand.name}">${brand.icon}</svg>`
    : unknown ? UNKNOWN_CARD_ICON : DEFAULT_CARD_ICON;
}

// Link: someone with a card saved in Link (Stripe) sees it in the empty card number box, e.g. the Visa logo and 0214;
// ticking it uses that card, as if it had been typed in and added. Without Stripe connected there's no way to ask Link
// yet, so for now the saved card is read from this browser (localStorage "lfcLinkCard", e.g. {"brand":"Visa","last4":
// "0214"}); nobody else sees it, and with nothing saved the box stays hidden
const pgCardLink = document.getElementById("pgCardLink");
const linkCard = (() => {
  try { return JSON.parse(localStorage.getItem("lfcLinkCard")); } catch { return null; }
})();
// on the black Link box, Visa shows as a white card with the blue wordmark (the dark blue one would disappear)
const LINK_ICONS = {
  Visa: `${cardShape("#fff")}<text x="12" y="14.6" text-anchor="middle" font-family="Arial, sans-serif" font-size="7.4" font-weight="900" font-style="italic" fill="#1A1F71">VISA</text>`,
};
if (linkCard) {
  const brand = CARD_BRANDS.find((b) => b.name === linkCard.brand);
  document.getElementById("pgCardLinkCard").innerHTML = (brand
    ? `<svg viewBox="0 0 24 24" role="img" aria-label="${brand.name}">${LINK_ICONS[brand.name] || brand.icon}</svg>` : "")
    + `<span>${String(linkCard.last4).replace(/\D/g, "").slice(-4)}</span>`;
}
function showLink() {
  // fades out once something is typed, and back in when the box is emptied
  pgCardLink.hidden = !linkCard;
  pgCardLink.classList.toggle("is-gone", pgCardNumber.value !== "");
}
showLink();
// Ticking it keeps the three boxes but fills them from Link: the Link box turns grey (ticked) in the number box, and
// Validade and CVC show the same grey box with the card's date (linkCard.exp) and "•••". "Adicionar" then adds that card; clicking the
// Link box again unticks it and empties the boxes
let linkSelected = false;
function setLinkSelected(on) {
  linkSelected = on;
  pgCardLink.setAttribute("aria-checked", String(on));
  pgCard.classList.toggle("is-link", on);
  [pgCardNumber, pgCardExpiry, pgCardCvc].forEach((input) => {
    input.readOnly = on;
    input.closest(".co-field").classList.remove("is-invalid");
  });
  pgCardExpiry.value = "";
  pgCardCvc.value = "";
  document.getElementById("pgCardLinkExp").textContent = (on && linkCard.exp) || "••/••";
  cardAdded = false;
  pgCardAdd.disabled = !cardEditing && !cardComplete();
  updatePay();
}
pgCardLink.addEventListener("click", () => setLinkSelected(!linkSelected));

pgCardExpiry.addEventListener("input", (e) => {
  let d = digits(pgCardExpiry).slice(0, 4);
  // deleting the "/" deletes the digit before it too, so backspace doesn't get stuck
  if (e.inputType === "deleteContentBackward" && d.length === 2 && !pgCardExpiry.value.includes("/")) d = d.slice(0, 1);
  pgCardExpiry.value = d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
});
pgCardCvc.addEventListener("input", () => {
  pgCardCvc.value = digits(pgCardCvc).slice(0, 4);
});
// after any of the three (the listeners above have tidied the value by then)
cardChecks.forEach(([input, ok]) => input.addEventListener("input", () => {
  cardAdded = false;
  pgCardAdd.disabled = !cardEditing && !cardComplete();
  if (ok()) input.closest(".co-field").classList.remove("is-invalid");
  updatePay();
}));
pgCardAdd.addEventListener("click", () => {
  if (!linkSelected) cardChecks.forEach(([input, ok]) => input.closest(".co-field").classList.toggle("is-invalid", !ok()));
  if (!cardComplete()) return;
  cardAdded = true;
  cardEditing = false;
  const last4 = linkSelected ? String(linkCard.last4).slice(-4) : digits(pgCardNumber).slice(-4);
  document.getElementById("pgCardSummary").textContent = `•••• •••• •••• ${last4}`;
  showPanels();
  updatePay();
});
document.getElementById("pgCardEdit").addEventListener("click", () => {
  cardAdded = false;
  cardEditing = true;
  pgCardAdd.textContent = "Alterar";
  pgCardAdd.disabled = false;
  showPanels();
  updatePay();
  pgCardNumber.focus();
});

// "Pagar" stays grey and off until a payment method is picked (and, for MB Way or a card, its details are added)
function updatePay() {
  const method = pgForm.querySelector('input[name="pgMethod"]:checked');
  pgPay.disabled = !method || (method.value === "mbway" && !mbwayAdded) || (method.value === "cartao" && !cardAdded)
    || items.length === 0;
}
// under the picked option: its boxes and "Adicionar" until the details are added, then the blue box with them
function showPanels() {
  const method = pgForm.querySelector('input[name="pgMethod"]:checked');
  const mbway = method && method.value === "mbway";
  const card = method && method.value === "cartao";
  pgMbway.hidden = !mbway || mbwayAdded;
  pgMbwayAdded.hidden = !mbway || !mbwayAdded;
  pgCard.hidden = !card || cardAdded;
  pgCardAdded.hidden = !card || !cardAdded;
}
pgForm.addEventListener("change", () => {
  showPanels();
  updatePay();
});
// there's no payment provider behind it yet, so nothing is charged or sent
pgForm.addEventListener("submit", (e) => e.preventDefault());
