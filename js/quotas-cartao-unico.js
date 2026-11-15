// Pagamento de Quotas, step 3 with a single payment by card (quotas-cartao-unico.html), after choosing Cartão de
// Débito/Crédito under Pagamento único on quotas-pagamento.html. As Benfica's: the card's number, expiry and security
// code, and a tick to keep the card on the profile; Seguinte checks them. Until there's a payment provider behind it
// nothing is charged; of the card only its brand and last 4 digits are kept (and, ticked, the last 4 digits and the
// expiry on the account, as Meios de Pagamento keeps them)

let quChoice = null;
try { quChoice = JSON.parse(sessionStorage.getItem("lfcQuotasChoice")); } catch {}
// no period chosen yet: back to step 2 (which sends on to step 1 when that's missing too)
if (!quChoice) location.replace("quotas-valores.html");
let quSession = null;
try { quSession = JSON.parse(localStorage.getItem("lfcSession")); } catch {}

const quForm = document.querySelector(".qu-form");
const quNumber = document.getElementById("quNumber");
const quExpiry = document.getElementById("quExpiry");
const quCvc = document.getElementById("quCvc");
const quKeep = document.getElementById("quKeep");

// the small card at the number's start: a plain one until the brand shows in what's typed, then the brand's
const QU_CARDS = {
  "": '<rect width="36" height="24" rx="3" fill="#E0E2FA"/><rect x="5" y="6" width="9" height="6" rx="1" fill="#FFF"/><path d="M5 17.5h4M11 17.5h4M17 17.5h4M23 17.5h4" stroke="#C6C9F5" stroke-width="2"/>',
  visa: '<rect width="36" height="24" rx="3" fill="#00579F"/><text x="18" y="16.6" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" font-style="italic" fill="#FFF">VISA</text>',
  mastercard: '<rect width="36" height="24" rx="3" fill="#231F20"/><circle cx="14" cy="12" r="6.3" fill="#EB001B"/><circle cx="22" cy="12" r="6.3" fill="#F79E1B"/><path d="M18 7.1a6.3 6.3 0 0 1 0 9.8 6.3 6.3 0 0 1 0-9.8Z" fill="#FF5F00"/>',
  discover: '<rect x=".5" y=".5" width="35" height="23" rx="2.5" fill="#FFF" stroke="#D9D9D9"/><text x="18" y="14.2" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="5.6" font-weight="700" fill="#231F20">DISCOVER</text><path d="M8 19.5h20" stroke="#F58220" stroke-width="2"/>',
  // (the number left unfinished or wrong: a red card with a warning)
  wrong: '<rect y="4" width="31" height="20" rx="3" fill="#FBD5D7"/><rect x="4.5" y="10.5" width="7.5" height="5" rx="1" fill="#FFF"/><path d="M4.5 20h4M10.5 20h4M16.5 20h4" stroke="#F3A3A8" stroke-width="2"/><circle cx="27.5" cy="8.5" r="8.5" fill="#EB1C26"/><path d="M27.5 4v5.4" stroke="#FFF" stroke-width="2.1" stroke-linecap="round"/><circle cx="27.5" cy="12.8" r="1.3" fill="#FFF"/>',
  amex: '<rect width="36" height="24" rx="3" fill="#1F72CD"/><text x="18" y="15" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="7.4" font-weight="700" fill="#FFF">AMEX</text>',
};
const quBrandBox = document.querySelector("[data-qu-brand]");
function quShowBrand(brand, zoom) {
  if (quBrandBox.dataset.brand === brand) return;
  quBrandBox.dataset.brand = brand;
  quBrandBox.innerHTML = `<svg viewBox="0 0 36 24"${zoom ? ' class="is-in"' : ""}>${QU_CARDS[brand]}</svg>`;
}
quShowBrand("", false);

// the card's brand, by how its number starts; American Express has 15 digits (in 4-6-5) and a 4-digit code
function quBrand(digits) {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]|7[01]|720))/.test(digits)) return "mastercard";
  if (/^(6011|65|64[4-9])/.test(digits)) return "discover";
  if (/^3[47]/.test(digits)) return "amex";
  return "";
}
const quDigits = () => quNumber.value.replace(/\D/g, "");

// The provider's button at the number's end, there while nothing is typed: "Utilizar" and its mark or, signed in to
// Link before, its mark and the card kept from it (linkCard, in link-popup.js). It opens the Link popup: on the
// account's e-mail (then the code sent to its phone), or straight on its cards for someone signed in. A card picked
// there fills the three boxes, which turn grey and can't be typed in (its last 4 digits, its date, dots for the code);
// the cross after the button, or the card leaving the account, empties them again
const quLink = document.querySelector("[data-qu-link]");
const quUnlinkBtn = document.querySelector("[data-qu-unlink]");
let quLinked = null;
const QU_LINK_BRANDS = { Visa: "visa", Mastercard: "mastercard", "American Express": "amex" };
function quRenderLink() {
  const brand = linkCard && CARD_BRANDS.find((b) => b.name === linkCard.brand);
  document.querySelector("[data-qu-link-text]").hidden = !!linkCard;
  document.querySelector("[data-qu-link-dots]").toggleAttribute("hidden", !linkCard);
  const card = document.querySelector("[data-qu-link-card]");
  card.hidden = !brand;
  card.innerHTML = brand ? `<svg viewBox="0 0 24 24">${brand.icon}</svg>` : "";
}
const quShowLink = () => { quLink.hidden = quNumber.value !== "" && !quLinked; };
function quUseLink(card) {
  quLinked = card;
  quForm.classList.add("is-linked");
  quForm.querySelectorAll(".is-invalid, .is-wrong").forEach((field) => field.classList.remove("is-invalid", "is-wrong"));
  [quNumber, quExpiry, quCvc].forEach((input) => { input.readOnly = true; });
  quNumber.value = `•••• •••• •••• ${last4Of(card)}`;
  quExpiry.value = card.exp || "••/••";
  quCvc.value = "•••";
  quShowBrand(QU_LINK_BRANDS[card.brand] || "", true);
  quUnlinkBtn.hidden = false;
  quRenderLink();
  quShowLink();
}
function quUnlink() {
  if (!quLinked) return;
  quLinked = null;
  quForm.classList.remove("is-linked");
  [quNumber, quExpiry, quCvc].forEach((input) => { input.readOnly = false; input.value = ""; });
  quShowBrand("", true);
  quUnlinkBtn.hidden = true;
  quShowLink();
}
const LINK_HOST = {
  use: quUseLink,
  unuse: quUnlink,
  refresh() { quRenderLink(); quShowLink(); },
  updated(card) { if (quLinked) quExpiry.value = card.exp; },
  focus() { (quLink.hidden ? quNumber : quLink).focus(); },
};
quLink.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!linkCard) { openLinkModal(); return; }
  let picked = LINK_TEST_CARDS.findIndex((c) => c.brand === linkCard.brand && c.last4 === linkCard.last4);
  // a card added in an earlier visit isn't in this visit's list yet
  if (picked < 0) picked = LINK_TEST_CARDS.push(linkCard) - 1;
  openLinkModal();
  showLinkPayments(picked, false);
});
quUnlinkBtn.addEventListener("click", (e) => { e.stopPropagation(); quUnlink(); quNumber.focus(); });
quRenderLink();
quShowLink();

// the number left unfinished or wrong (another box clicked, or another tab): what's typed turns red and the small
// card becomes the red one with the warning; typed in again, both go back
const quNumberField = quNumber.closest("[data-field]");
quNumber.addEventListener("blur", () => {
  if (quLinked || !quDigits() || quNumberOk()) return;
  quNumberField.classList.add("is-wrong");
  quShowBrand("wrong", true);
});

// typing helps: the number in groups of 4, the date as MM/AA (3 becomes 03), the code digits only
quNumber.addEventListener("input", () => {
  const brand = quBrand(quDigits());
  const digits = quDigits().slice(0, brand === "amex" ? 15 : 19);
  quNumber.value = brand === "amex"
    ? [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10)].filter(Boolean).join(" ")
    : digits.replace(/(.{4})(?=.)/g, "$1 ");
  quNumberField.classList.remove("is-wrong");
  quShowBrand(brand, true);
  quShowLink();
  quCvc.maxLength = brand === "amex" ? 4 : 3;
  quCvc.value = quCvc.value.slice(0, quCvc.maxLength);
});
quExpiry.addEventListener("input", (e) => {
  let digits = quExpiry.value.replace(/\D/g, "").slice(0, 4);
  if (/^[2-9]/.test(digits)) digits = `0${digits}`.slice(0, 4);
  // deleting the bar takes the month's last digit with it
  if (e.inputType === "deleteContentBackward" && digits.length === 2 && !quExpiry.value.includes("/")) digits = digits.slice(0, 1);
  quExpiry.value = digits.length >= 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
});
quCvc.maxLength = 3;
quCvc.addEventListener("input", () => { quCvc.value = quCvc.value.replace(/\D/g, "").slice(0, quCvc.maxLength); });
// a click anywhere in a box types in it
document.querySelectorAll(".qu-box").forEach((box) => box.addEventListener("click", () => { if (!quLinked) box.querySelector("input").focus(); }));

// a card number is right when it's long enough and its check digit is (Luhn); the date, a real month not gone by
function quNumberOk() {
  const digits = quDigits();
  if (digits.length < (quBrand(digits) === "amex" ? 15 : 13)) return false;
  let sum = 0;
  [...digits].reverse().forEach((d, i) => {
    let n = +d;
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  });
  return sum % 10 === 0;
}
function quExpiryOk() {
  const m = /^(\d{2})\/(\d{2})$/.exec(quExpiry.value);
  if (!m || +m[1] < 1 || +m[1] > 12) return false;
  const now = new Date();
  return 2000 + +m[2] > now.getFullYear() || (2000 + +m[2] === now.getFullYear() && +m[1] >= now.getMonth() + 1);
}
const quChecks = { number: quNumberOk, expiry: quExpiryOk, cvc: () => quCvc.value.length === quCvc.maxLength };
// a wrong field turns red (its box and title), until it's changed again
quForm.addEventListener("input", (e) => e.target.closest("[data-field]")?.classList.remove("is-invalid"));

// Seguinte: everything checked; all right, the card kept with the period by its brand and last 4 digits and, ticked,
// added to the account's cards (its last 4 digits and expiry)
quForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // (a card from Link is already whole)
  const wrong = quLinked ? [] : Object.keys(quChecks).filter((k) => !quChecks[k]());
  Object.keys(quChecks).forEach((k) => quForm.querySelector(`[data-field="${k}"]`).classList.toggle("is-invalid", wrong.includes(k)));
  if (wrong.length) {
    quForm.querySelector(`[data-field="${wrong[0]}"] input`).focus();
    return;
  }
  const last4 = quLinked ? last4Of(quLinked) : quDigits().slice(-4);
  const card = quLinked ? { brand: QU_LINK_BRANDS[quLinked.brand] || "", last4, link: true } : { brand: quBrand(quDigits()), last4 };
  try { sessionStorage.setItem("lfcQuotasChoice", JSON.stringify({ ...quChoice, method: "cartao", card })); } catch {}
  if (quKeep.checked && quSession && /^\d{2}\/\d{2}$/.test(quExpiry.value)) {
    const [mm, yy] = quExpiry.value.split("/");
    quSession.cards = quSession.cards || [];
    if (!quSession.cards.includes(last4)) quSession.cards.push(last4);
    quSession.cardExp = { ...quSession.cardExp, [last4]: `${+mm}/${2000 + +yy}` };
    quSession.defaultCard = quSession.defaultCard || last4;
    try { localStorage.setItem("lfcSession", JSON.stringify(quSession)); } catch {}
  }
  // then the billing details
  location.href = "quotas-faturacao.html";
});

// back to the top: always there, as on the other steps
const quTop = document.querySelector(".nt-top");
quTop.hidden = false;
quTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
