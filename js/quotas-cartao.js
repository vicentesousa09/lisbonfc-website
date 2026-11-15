// Pagamento de Quotas, step 3 with a card charged each period (quotas-cartao.html), after choosing Cartão de
// Débito/Crédito under Pagamento recorrente on quotas-pagamento.html. As Benfica's: the payment provider's box for the
// details it has kept (the account's e-mail, a six-digit code sent to the phone or the e-mail), then the card's number,
// expiry, security code and country; Seguinte checks them. Until there's a payment provider behind it no code is sent
// and nothing is charged; of the card only its brand and last 4 digits are kept

let qcChoice = null;
try { qcChoice = JSON.parse(sessionStorage.getItem("lfcQuotasChoice")); } catch {}
// no period chosen yet: back to step 2 (which sends on to step 1 when that's missing too)
if (!qcChoice) location.replace("quotas-valores.html");
let qcSession = null;
try { qcSession = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
qcSession = qcSession || {};

const qcForm = document.querySelector(".qc-form");
const qcNumber = document.getElementById("qcNumber");
const qcExpiry = document.getElementById("qcExpiry");
const qcCvc = document.getElementById("qcCvc");
const qcCountry = document.getElementById("qcCountry");

// the kept details: the account's e-mail; the code goes to the phone (all dots but its last 2 digits) or, with the
// link under it, to the e-mail (and back); no e-mail on the account, no box
const qcLink = document.querySelector("[data-qc-link]");
const qcSent = document.querySelector("[data-qc-sent]");
const qcSwitch = document.querySelector("[data-qc-switch]");
const qcCode = [...document.querySelectorAll("[data-qc-code] input")];
const qcPhoneDigits = (qcSession.phone || "").replace(/\D/g, "");
let qcByEmail = !qcPhoneDigits;
function qcShowSent() {
  qcSent.textContent = qcByEmail ? qcSession.email : `••• ••• •${qcPhoneDigits.slice(-2)}`;
  qcSwitch.textContent = qcByEmail ? "Em vez disso, enviar código para o telemóvel" : "Em vez disso, enviar código para o email";
  qcSwitch.hidden = !qcPhoneDigits;
}
if (qcSession.email) {
  document.querySelector("[data-qc-email]").textContent = qcSession.email;
  qcShowSent();
} else {
  qcLink.hidden = true;
}
// the cross puts the box away: a line stays in its place. That line opens the provider's offer (its cross folds it
// back into the line), with an e-mail to type
const qcRelink = document.querySelector("[data-qc-relink]");
const qcPromo = document.querySelector("[data-qc-promo]");
const qcPromoEmail = document.getElementById("qcPromoEmail");
function qcShowLink(shown) {
  qcLink.hidden = !shown;
  qcPromo.hidden = true;
  qcRelink.hidden = shown;
}
// the offer opens by growing down from the line's height (and closes back into it), so what's under it slides
// instead of jumping
const qcStill = window.matchMedia("(prefers-reduced-motion: reduce)");
let qcSlideTimer = 0;
function qcSlide(open, then) {
  const frames = [{ height: `${qcRelink.offsetHeight || 20}px`, opacity: 0 }, { height: `${qcPromo.offsetHeight}px`, opacity: 1 }];
  qcPromo.style.overflow = "hidden";
  const slide = qcPromo.animate(open ? frames : frames.reverse(), { duration: 350, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)" });
  // (ended by the clock, not by the animation's own end, which doesn't come while the tab isn't being drawn)
  clearTimeout(qcSlideTimer);
  qcSlideTimer = setTimeout(() => { slide.cancel(); qcPromo.style.overflow = ""; then?.(); }, 350);
}
function qcShowPromo(shown) {
  qcLink.hidden = true;
  if (shown) {
    const from = qcRelink.offsetHeight;
    qcPromo.hidden = false;
    if (!qcStill.matches && from) { qcRelink.hidden = false; qcSlide(true); }
    qcRelink.hidden = true;
    qcPromoEmail.focus({ preventScroll: true });
    return;
  }
  const fold = () => {
    // (unless something else took its place meanwhile)
    if (qcSigned || !qcLink.hidden) return;
    qcPromo.hidden = true;
    qcRelink.hidden = false;
  };
  if (qcStill.matches || qcPromo.hidden) fold();
  else qcSlide(false, fold);
}
document.querySelector("[data-qc-link-close]").addEventListener("click", () => qcShowLink(false));
qcRelink.addEventListener("click", () => qcShowPromo(true));
document.querySelector("[data-qc-promo-close]").addEventListener("click", () => qcShowPromo(false));
const qcClearCode = () => { qcCode.forEach((box) => { box.value = ""; }); qcCode[0].focus(); };

// the whole code typed: signed in. The box becomes the kept card (the account's default one, by its last 4 digits; a
// stand-in when it has none) with its security code to confirm, and the card's own fields go away. The dots open
// "Pagar sem Link": the box goes away (its line in its place), leaving the card's own fields to fill in
const qcPay = document.querySelector(".qc-pay");
const qcSaved = document.querySelector("[data-qc-saved]");
const qcConfirm = document.getElementById("qcConfirm");
const qcMenu = document.querySelector("[data-qc-menu]");
const qcMore = document.querySelector("[data-qc-more]");
const qcKept = (qcSession.cards || []).includes(qcSession.defaultCard) ? qcSession.defaultCard : (qcSession.cards || [])[0];
let qcSigned = false;
// (the code already confirmed in the popup: the box is just the kept card, with nothing more to type)
let qcConfirmed = false;
function qcOpenMenu(open) {
  qcMenu.hidden = !open;
  qcMore.setAttribute("aria-expanded", String(open));
}
function qcSign(signed, confirmed = false) {
  qcSigned = signed;
  qcConfirmed = signed && confirmed;
  qcPay.classList.toggle("is-signed", signed);
  qcPay.classList.toggle("is-confirmed", qcConfirmed);
  qcLink.hidden = signed;
  if (signed) { qcPromo.hidden = true; qcRelink.hidden = true; }
  qcSaved.hidden = !signed;
  qcOpenMenu(false);
  qcForm.querySelectorAll(".is-invalid").forEach((field) => field.classList.remove("is-invalid"));
  if (!signed) qcClearCode();
  else if (!confirmed) { qcConfirm.value = ""; qcConfirm.focus(); }
}
document.querySelector("[data-qc-saved-email]").textContent = qcSession.email || "";
// the card shown as kept: the account's to start (a Mastercard), or one added in the popup; its brand's small picture
const QC_BRANDS = {
  visa: ["Visa", '<rect width="36" height="24" rx="3" fill="#00579F"/><text x="18" y="16.6" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" font-style="italic" fill="#FFF">VISA</text>'],
  mastercard: ["Mastercard", '<rect width="36" height="24" rx="3" fill="#231F20"/><circle cx="14" cy="12" r="6.3" fill="#EB001B"/><circle cx="22" cy="12" r="6.3" fill="#F79E1B"/><path d="M18 7.1a6.3 6.3 0 0 1 0 9.8 6.3 6.3 0 0 1 0-9.8Z" fill="#FF5F00"/>'],
  discover: ["Discover", '<rect x=".5" y=".5" width="35" height="23" rx="2.5" fill="#FFF" stroke="#D9D9D9"/><text x="18" y="14.2" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="5.6" font-weight="700" fill="#231F20">DISCOVER</text><path d="M8 19.5h20" stroke="#F58220" stroke-width="2"/>'],
  amex: ["American Express", '<rect width="36" height="24" rx="3" fill="#1F72CD"/><text x="18" y="15" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="7.4" font-weight="700" fill="#FFF">AMEX</text>'],
  "": ["Cartão", '<rect x=".5" y=".5" width="35" height="23" rx="2.5" fill="#F5F5F5" stroke="#C4C5CC"/><path d="M.5 7h35v4H.5Z" fill="#9FA0AA"/>'],
};
const qcBrandSvg = (brand, cls) => `<svg class="${cls}" viewBox="0 0 36 24" aria-hidden="true">${(QC_BRANDS[brand] || QC_BRANDS[""])[1]}</svg>`;
let qcKeptCard = { brand: "mastercard", last4: qcKept || "1836", name: qcKept ? "Mastercard" : "Revolut Mastercard" };
function qcShowKept(card) {
  qcKeptCard = card;
  document.querySelectorAll("[data-qc-saved-name], [data-qc-modal-name], [data-qc-pick-name]").forEach((el) => { el.textContent = card.name; });
  document.querySelectorAll("[data-qc-saved-last4], [data-qc-modal-last4], [data-qc-pick-last4]").forEach((el) => { el.textContent = card.last4; });
  document.querySelectorAll(".qc-saved-brand").forEach((el) => { el.outerHTML = qcBrandSvg(card.brand, "qc-saved-brand"); });
}
qcMore.addEventListener("click", () => qcOpenMenu(qcMenu.hidden));
document.addEventListener("click", (e) => { if (!e.target.closest(".qc-saved-more")) qcOpenMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") qcOpenMenu(false); });
document.querySelector("[data-qc-signout]").addEventListener("click", () => { qcSign(false); qcShowLink(false); qcNumber.focus(); });
qcConfirm.addEventListener("input", () => { qcConfirm.value = qcConfirm.value.replace(/\D/g, "").slice(0, 3); });
// a click anywhere in the box types in it
qcConfirm.closest(".qc-confirm").addEventListener("click", () => qcConfirm.focus());
const qcCodeDone = () => { if (qcCode.every((box) => box.value)) qcSign(true); };

// the account's e-mail typed in the offer's box: after a moment, the popup of its kept card. Atualizar wants the
// card's security code ("CVC é exigido" without it, also when the box is left empty; "CVC é inválido" when it's not
// 3 digits) and then signs in, the code confirmed (so the page's box is just the card); the cross (or
// Escape) just closes it; "Alterar forma de pagamento" shows its second layout; the dots, Abrir aplicação and Sair,
// which empties the e-mail too
const qcModal = document.querySelector("[data-qc-modal]");
const qcModalCvc = document.getElementById("qcModalCvc");
const qcModalField = document.querySelector("[data-qc-modal-field]");
const qcModalError = document.querySelector("[data-qc-modal-error]");
const qcModalMenu = document.querySelector("[data-qc-modal-menu]");
const qcModalMore = document.querySelector("[data-qc-modal-more]");
document.querySelector("[data-qc-modal-email]").textContent = qcSession.email || "";
// what's wrong with the code ("CVC é exigido" or "CVC é inválido"), or nothing: the line under the box, its red
// outline and the warning at its end
function qcModalWrong(message) {
  qcModalField.classList.toggle("is-invalid", !!message);
  qcModalError.hidden = !message;
  if (message) qcModalError.textContent = message;
}
// Atualizar is bright once the code is 3 digits, dim until then
const qcModalReady = () => document.querySelector("[data-qc-modal-update]").classList.toggle("is-ready", qcModalCvc.value.length === 3);
function qcOpenModalMenu(open) {
  qcModalMenu.hidden = !open;
  qcModalMore.setAttribute("aria-expanded", String(open));
}
// its layouts: the code to confirm ("cvc"), how to pay instead ("pick") or a new card ("add")
// (reached from "pick" by its kept card, "cvc" has an arrow back there and a title, and no way to pay instead)
const qcModalBox = qcModal.querySelector(".qc-modal-box");
function qcModalView(view, edit = false) {
  qcModal.querySelectorAll("[data-qc-modal-view]").forEach((el) => { el.hidden = el.dataset.qcModalView !== view; });
  qcModalBox.classList.toggle("is-edit", edit);
  document.querySelector("[data-qc-modal-title]").textContent = view === "add" ? "Adicionar um cartão" : "Confirmar CVC";
  qcOpenModalMenu(false);
  if (view === "cvc") qcModalCvc.focus();
}
// while it's open the page behind doesn't scroll (the room of its scrollbar kept, so nothing shifts sideways)
function qcLockPage(locked) {
  const bar = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.overflow = locked ? "hidden" : "";
  document.body.style.paddingRight = locked && bar > 0 ? `${bar}px` : "";
}
function qcOpenModal(open) {
  if (open === qcModal.hidden) qcLockPage(open);
  qcModal.hidden = !open;
  qcModal.querySelectorAll("[data-qc-modal-view]").forEach((el) => { el.hidden = el.dataset.qcModalView !== "cvc"; });
  qcModalBox.classList.remove("is-edit");
  qcOpenModalMenu(false);
  qcModalWrong("");
  if (open) { qcModalCvc.value = ""; qcModalReady(); qcModalCvc.focus(); }
}
let qcEmailTimer = 0;
qcPromoEmail.addEventListener("input", () => {
  clearTimeout(qcEmailTimer);
  const typed = qcPromoEmail.value.trim().toLowerCase();
  if (qcSession.email && typed === qcSession.email.toLowerCase()) qcEmailTimer = setTimeout(() => qcOpenModal(true), 500);
});
qcModalField.addEventListener("click", () => qcModalCvc.focus());
qcModalCvc.addEventListener("input", () => {
  qcModalCvc.value = qcModalCvc.value.replace(/\D/g, "").slice(0, 3);
  qcModalWrong("");
  qcModalReady();
});
// left empty (clicked away): it's asked for
qcModalCvc.addEventListener("blur", () => { if (!qcModal.hidden && !qcModalCvc.value) qcModalWrong("CVC é exigido"); });
qcModalCvc.addEventListener("keydown", (e) => { if (e.key === "Enter") document.querySelector("[data-qc-modal-update]").click(); });
document.querySelector("[data-qc-modal-update]").addEventListener("click", () => {
  if (qcModalCvc.value.length !== 3) { qcModalWrong(qcModalCvc.value ? "CVC é inválido" : "CVC é exigido"); return; }
  qcOpenModal(false);
  qcSign(true, true);
});
// closed without the code (the cross or Escape): signed in all the same, the code still to confirm in the page's box
const qcCloseModal = () => { qcOpenModal(false); qcSign(true); };
document.querySelector("[data-qc-modal-close]").addEventListener("click", qcCloseModal);
// "Alterar forma de pagamento": the second layout. There, the kept card goes back to its code; Cartão, a new card,
// closes the popup for the card's own fields
document.querySelector("[data-qc-modal-other]").addEventListener("click", () => qcModalView("pick"));
qcShowKept(qcKeptCard);
document.querySelector("[data-qc-pick-kept]").addEventListener("click", () => qcModalView("cvc", true));
document.querySelector("[data-qc-modal-back]").addEventListener("click", () => qcModalView("pick"));
document.querySelector("[data-qc-pick-new]").addEventListener("click", () => {
  qcAddClear();
  qcModalView("add", true);
  qcAdd.number.focus();
});

// Cartão, the popup's third layout: a new card. Its number in groups of 4 with its brand at the end (the ones
// taken, in turns, until one is typed), the date as MM/AA, the code and the country; Continuar is bright once they're all right, and
// then the popup closes, signed in with the new card as the kept one (its code already confirmed). Pressed before,
// what's wrong gets a red outline, until it's changed
const qcAdd = {
  number: document.getElementById("qcAddNumber"), expiry: document.getElementById("qcAddExpiry"),
  cvc: document.getElementById("qcAddCvc"), country: document.getElementById("qcAddCountry"),
};
const qcAddBrand = document.querySelector("[data-qc-add-brand]");
const qcAddContinue = document.querySelector("[data-qc-add-continue]");
const qcAddDigits = () => qcAdd.number.value.replace(/\D/g, "");
const qcAddChecks = {
  number: () => qcNumberOk(qcAddDigits()),
  expiry: () => qcExpiryOk(qcAdd.expiry.value),
  cvc: () => qcAdd.cvc.value.length === qcAdd.cvc.maxLength,
  country: () => qcAdd.country.value !== "",
};
const qcAddField = (k) => document.querySelector(`[data-qc-add="${k}"]`);
// the brand at the number's end: the one typed; until one is, the brands taken, one after the other every 3 seconds
const QC_TAKEN = ["visa", "mastercard", "discover"];
let qcAddTurn = 0;
function qcAddShowBrand(brand) {
  if (qcAddBrand.dataset.brand === brand) return;
  qcAddBrand.dataset.brand = brand;
  qcAddBrand.innerHTML = qcBrandSvg(brand, "");
}
setInterval(() => {
  if (qcModal.hidden || qcBrand(qcAddDigits())) return;
  qcAddTurn = (qcAddTurn + 1) % QC_TAKEN.length;
  qcAddShowBrand(QC_TAKEN[qcAddTurn]);
}, 3000);
const qcAddReady = () => qcAddContinue.classList.toggle("is-ready", Object.values(qcAddChecks).every((ok) => ok()));
function qcAddClear() {
  qcAdd.number.value = qcAdd.expiry.value = qcAdd.cvc.value = "";
  qcAdd.cvc.maxLength = 3;
  qcAdd.country.value = qcCountry.value || "PT";
  qcAddTurn = 0;
  qcAddShowBrand("visa");
  Object.keys(qcAddChecks).forEach((k) => qcAddField(k).classList.remove("is-invalid"));
  qcAddReady();
}
qcAdd.number.addEventListener("input", () => {
  const brand = qcBrand(qcAddDigits());
  const digits = qcAddDigits().slice(0, brand === "amex" ? 15 : 19);
  qcAdd.number.value = brand === "amex"
    ? [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10)].filter(Boolean).join(" ")
    : digits.replace(/(.{4})(?=.)/g, "$1 ");
  qcAddShowBrand(brand || QC_TAKEN[qcAddTurn]);
  qcAdd.cvc.maxLength = brand === "amex" ? 4 : 3;
  qcAdd.cvc.value = qcAdd.cvc.value.slice(0, qcAdd.cvc.maxLength);
});
qcAdd.expiry.addEventListener("input", (e) => {
  let digits = qcAdd.expiry.value.replace(/\D/g, "").slice(0, 4);
  if (/^[2-9]/.test(digits)) digits = `0${digits}`.slice(0, 4);
  if (e.inputType === "deleteContentBackward" && digits.length === 2 && !qcAdd.expiry.value.includes("/")) digits = digits.slice(0, 1);
  qcAdd.expiry.value = digits.length >= 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
});
qcAdd.cvc.addEventListener("input", () => { qcAdd.cvc.value = qcAdd.cvc.value.replace(/\D/g, "").slice(0, qcAdd.cvc.maxLength); });
Object.keys(qcAdd).forEach((k) => {
  const changed = () => { qcAddField(k).classList.remove("is-invalid"); qcAddReady(); };
  qcAdd[k].addEventListener("input", changed);
  qcAdd[k].addEventListener("change", changed);
  qcAddField(k).addEventListener("click", () => qcAdd[k].focus());
  qcAdd[k].addEventListener("keydown", (e) => { if (e.key === "Enter" && k !== "country") qcAddContinue.click(); });
});
qcAddContinue.addEventListener("click", () => {
  const wrong = Object.keys(qcAddChecks).filter((k) => !qcAddChecks[k]());
  Object.keys(qcAddChecks).forEach((k) => qcAddField(k).classList.toggle("is-invalid", wrong.includes(k)));
  if (wrong.length) return;
  const brand = qcBrand(qcAddDigits());
  qcShowKept({ brand, last4: qcAddDigits().slice(-4), name: (QC_BRANDS[brand] || QC_BRANDS[""])[0] });
  qcOpenModal(false);
  qcSign(true, true);
});
qcModalMore.addEventListener("click", () => qcOpenModalMenu(qcModalMenu.hidden));
qcModal.addEventListener("click", (e) => { if (!e.target.closest(".qc-saved-more")) qcOpenModalMenu(false); });
// Abrir aplicação: the provider's own site, in a new tab
document.querySelector("[data-qc-modal-app]").addEventListener("click", () => {
  qcOpenModalMenu(false);
  window.open("https://app.link.com/login", "_blank", "noopener");
});
document.querySelector("[data-qc-modal-signout]").addEventListener("click", () => { qcOpenModal(false); qcPromoEmail.value = ""; qcPromoEmail.focus(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !qcModal.hidden) qcCloseModal(); });
document.querySelector("[data-qc-resend]").addEventListener("click", qcClearCode);
qcSwitch.addEventListener("click", () => { qcByEmail = !qcByEmail; qcShowSent(); qcClearCode(); });
// the code's boxes: a digit each, on to the next as it's typed and back with Backspace; a pasted code fills them all
qcCode.forEach((box, i) => {
  box.addEventListener("input", () => {
    box.value = box.value.replace(/\D/g, "").slice(0, 1);
    if (box.value && qcCode[i + 1]) qcCode[i + 1].focus();
    qcCodeDone();
  });
  box.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !box.value && qcCode[i - 1]) { qcCode[i - 1].value = ""; qcCode[i - 1].focus(); }
    if (e.key === "ArrowLeft" && qcCode[i - 1]) qcCode[i - 1].focus();
    if (e.key === "ArrowRight" && qcCode[i + 1]) qcCode[i + 1].focus();
  });
  box.addEventListener("paste", (e) => {
    e.preventDefault();
    const digits = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, qcCode.length - i);
    [...digits].forEach((d, n) => { qcCode[i + n].value = d; });
    qcCode[Math.min(i + digits.length, qcCode.length - 1)].focus();
    qcCodeDone();
  });
});

// the countries (paises.js) by their Portuguese names, in alphabetical order; Portugal to start, or the account's
let qcNames = null;
try { qcNames = new Intl.DisplayNames(["pt-PT"], { type: "region" }); } catch {}
const qcName = (c) => { try { return qcNames.of(c.iso) || c.name; } catch { return c.name; } };
COUNTRIES.map((c) => [qcName(c), c.iso]).sort((a, b) => a[0].localeCompare(b[0], "pt"))
  .forEach(([name, iso]) => { qcCountry.add(new Option(name, iso)); qcAdd.country.add(new Option(name, iso)); });
qcCountry.value = COUNTRIES.some((c) => c.iso === qcSession.personal?.country) ? qcSession.personal.country : "PT";

// the card's brand, by how its number starts; American Express has 15 digits (in 4-6-5) and a 4-digit code
function qcBrand(digits) {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]|7[01]|720))/.test(digits)) return "mastercard";
  if (/^(6011|65|64[4-9])/.test(digits)) return "discover";
  if (/^3[47]/.test(digits)) return "amex";
  return "";
}
const qcDigits = () => qcNumber.value.replace(/\D/g, "");
const qcBrandIcons = [...document.querySelectorAll("[data-qc-brands] svg")];
qcNumber.dataset.brand = "";
// typing helps: the number in groups of 4 (the three brands at its end become the one typed), the date as MM/AA
// (3 becomes 03), the code digits only
qcNumber.addEventListener("input", () => {
  const brand = qcBrand(qcNumber.value.replace(/\D/g, ""));
  const digits = qcNumber.value.replace(/\D/g, "").slice(0, brand === "amex" ? 15 : 19);
  qcNumber.value = brand === "amex"
    ? [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10)].filter(Boolean).join(" ")
    : digits.replace(/(.{4})(?=.)/g, "$1 ");
  // (American Express's picture is only there once it's the one typed)
  qcBrandIcons.forEach((icon) => icon.toggleAttribute("hidden", brand ? icon.dataset.brand !== brand : icon.dataset.brand === "amex"));
  // the pictures change with a small zoom (started again each time the brand does)
  if (brand !== qcNumber.dataset.brand) {
    qcNumber.dataset.brand = brand;
    qcBrandIcons.forEach((icon) => { icon.classList.remove("is-in"); icon.getBoundingClientRect(); icon.classList.add("is-in"); });
  }
  qcCvc.maxLength = brand === "amex" ? 4 : 3;
  qcCvc.value = qcCvc.value.slice(0, qcCvc.maxLength);
});
qcExpiry.addEventListener("input", (e) => {
  let digits = qcExpiry.value.replace(/\D/g, "").slice(0, 4);
  if (/^[2-9]/.test(digits)) digits = `0${digits}`.slice(0, 4);
  // deleting the bar takes the month's last digit with it
  if (e.inputType === "deleteContentBackward" && digits.length === 2 && !qcExpiry.value.includes("/")) digits = digits.slice(0, 1);
  qcExpiry.value = digits.length >= 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
});
qcCvc.maxLength = 3;
qcCvc.addEventListener("input", () => { qcCvc.value = qcCvc.value.replace(/\D/g, "").slice(0, qcCvc.maxLength); });

// a card number is right when it's long enough and its check digit is (Luhn)
function qcNumberOk(digits = qcDigits()) {
  if (digits.length < (qcBrand(digits) === "amex" ? 15 : 13)) return false;
  let sum = 0;
  [...digits].reverse().forEach((d, i) => {
    let n = +d;
    if (i % 2) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  });
  return sum % 10 === 0;
}
// the date: a real month, not gone by
function qcExpiryOk(value = qcExpiry.value) {
  const m = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!m || +m[1] < 1 || +m[1] > 12) return false;
  const now = new Date();
  return 2000 + +m[2] > now.getFullYear() || (2000 + +m[2] === now.getFullYear() && +m[1] >= now.getMonth() + 1);
}
// what's wrong with the number typed, said under its box: not all of it yet, or not a card's number
const qcNumberError = document.querySelector("[data-qc-number-error]");
function qcNumberWrong() {
  const digits = qcDigits();
  if (digits.length < (qcBrand(digits) === "amex" ? 15 : 16)) return "O número do seu cartão está incompleto.";
  return qcNumberOk(digits) ? "" : "O número do seu cartão é inválido.";
}
function qcShowNumberError(message) {
  qcNumberError.textContent = message;
  qcNumberError.hidden = !message;
  qcNumber.closest("[data-field]").classList.toggle("is-invalid", !!message);
}
// left unfinished (another box clicked, or another tab): red, with the reason; changed again, it goes
qcNumber.addEventListener("blur", () => { if (qcDigits()) qcShowNumberError(qcNumberWrong()); });
qcNumber.addEventListener("input", () => qcShowNumberError(""));
const qcChecks = {
  number: () => qcNumberOk(),
  expiry: () => qcExpiryOk(),
  cvc: () => qcCvc.value.length === qcCvc.maxLength,
  country: () => qcCountry.value !== "",
};
// a wrong field turns red (its box and title), until it's changed again
qcForm.addEventListener("input", (e) => e.target.closest("[data-field]")?.classList.remove("is-invalid"));
qcForm.addEventListener("change", (e) => e.target.closest("[data-field]")?.classList.remove("is-invalid"));

// Seguinte: everything checked; all right, the card kept with the period, only by its brand and last 4 digits
qcForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // signed in: only the kept card's security code to check
  if (qcSigned) {
    const ok = qcConfirmed || qcConfirm.value.length === 3;
    qcConfirm.closest("[data-field]").classList.toggle("is-invalid", !ok);
    if (!ok) { qcConfirm.focus(); return; }
    const kept = { brand: qcKeptCard.brand, last4: qcKeptCard.last4, kept: true };
    try { sessionStorage.setItem("lfcQuotasChoice", JSON.stringify({ ...qcChoice, method: "cartao-recorrente", card: kept })); } catch {}
    location.href = "quotas-faturacao.html";
    return;
  }
  const wrong = Object.keys(qcChecks).filter((k) => !qcChecks[k]());
  Object.keys(qcChecks).forEach((k) => qcForm.querySelector(`[data-field="${k}"]`).classList.toggle("is-invalid", wrong.includes(k)));
  qcShowNumberError(wrong.includes("number") ? qcNumberWrong() : "");
  if (wrong.length) {
    qcForm.querySelector(`[data-field="${wrong[0]}"] .qc-input`).focus();
    return;
  }
  const card = { brand: qcBrand(qcDigits()), last4: qcDigits().slice(-4), country: qcCountry.value };
  try { sessionStorage.setItem("lfcQuotasChoice", JSON.stringify({ ...qcChoice, method: "cartao-recorrente", card })); } catch {}
  // then the billing details
  location.href = "quotas-faturacao.html";
});

// back to the top: always there, as on the other steps
const qcTop = document.querySelector(".nt-top");
qcTop.hidden = false;
qcTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
