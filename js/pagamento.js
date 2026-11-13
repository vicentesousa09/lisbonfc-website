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
// "0214","exp":"09/27"}); nobody else sees it, and with nothing saved the box stays hidden. Signing in through the Link
// popup (below) saves one there too
const pgCardLink = document.getElementById("pgCardLink");
let linkCard = (() => {
  try { return JSON.parse(localStorage.getItem("lfcLinkCard")); } catch { return null; }
})();
// on the black Link box, Visa shows as a white card with the blue wordmark (the dark blue one would disappear)
const LINK_ICONS = {
  Visa: `${cardShape("#fff")}<text x="12" y="14.6" text-anchor="middle" font-family="Arial, sans-serif" font-size="7.4" font-weight="900" font-style="italic" fill="#1A1F71">VISA</text>`,
};
const last4Of = (card) => String(card.last4).replace(/\D/g, "").slice(-4);
function renderLinkCard() {
  if (!linkCard) return;
  const brand = CARD_BRANDS.find((b) => b.name === linkCard.brand);
  document.getElementById("pgCardLinkCard").innerHTML = (brand
    ? `<svg viewBox="0 0 24 24" role="img" aria-label="${brand.name}">${LINK_ICONS[brand.name] || brand.icon}</svg>` : "")
    + `<span>${last4Of(linkCard)}</span>`;
}
renderLinkCard();
const pgCardLinkLogin = document.getElementById("pgCardLinkLogin");
function showLink() {
  // the saved card, or "Utilizar" without one; either fades out once something is typed, and back in when the box is emptied
  pgCardLink.hidden = !linkCard;
  pgCardLinkLogin.hidden = !!linkCard;
  [pgCardLink, pgCardLinkLogin].forEach((box) => box.classList.toggle("is-gone", pgCardNumber.value !== ""));
}
showLink();

// "Utilizar" opens a popup asking for the Link account's email; closed by the ✕, Esc or a click outside it. A valid
// email (typed, or sent with "Continuar") is looked up and the popup moves on to the code sent to it; a wrong one turns
// the box red. Without Stripe connected there's no Link account to look up yet, so for now the lookup is only shown
const linkModal = document.getElementById("linkModal");
const linkEmail = document.getElementById("linkEmail");
const linkEmailField = linkEmail.closest(".co-field");
const emailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(linkEmail.value.trim());
// The popup has four views: the email box ("form"), the details about Link ("info", from the link logo, which swaps
// back and forth, with a back arrow), "Confirme sua identidade" ("code") and, once signed in, "Formas de pagamento" ("pay")
// and "Adicionar um cartão" ("add", with a back arrow to "pay")
const linkModalLogo = document.getElementById("linkModalLogo");
const linkForm = document.getElementById("linkForm");
// switching views (not when the popup first opens) is smooth: the popup's height glides from one to the other while
// the new content fades in
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
function showLinkView(view, smooth = false) {
  const from = linkForm.offsetHeight;
  linkModalLogo.setAttribute("aria-expanded", String(view === "info"));
  linkForm.classList.toggle("is-info", view === "info");
  linkForm.classList.toggle("is-code", view === "code");
  linkForm.classList.toggle("is-pay", view === "pay");
  linkForm.classList.toggle("is-add", view === "add" || view === "update");
  linkForm.classList.toggle("is-update", view === "update");
  linkForm.classList.toggle("is-remove", view === "remove");
  linkForm.classList.toggle("is-logout", view === "logout");
  // (with no card in the account, "Adicionar um cartão" has no back circle)
  linkForm.classList.toggle("is-no-cards", !LINK_TEST_CARDS.length);
  linkPayMenu.hidden = true;
  if (!smooth || reduceMotion.matches) return;
  const to = linkForm.offsetHeight;
  linkForm.classList.remove("is-switching");
  linkForm.style.height = `${from}px`;
  void linkForm.offsetHeight;
  linkForm.classList.add("is-switching");
  linkForm.style.height = `${to}px`;
  // once it's done (0.35s, in style.css), back to its natural height
  clearTimeout(showLinkView.timer);
  showLinkView.timer = setTimeout(() => {
    linkForm.classList.remove("is-switching");
    linkForm.style.height = "";
  }, 360);
}
linkModalLogo.addEventListener("click", () => showLinkView(linkForm.classList.contains("is-info") ? "form" : "info", true));
// back to the email box, ready to type in (also "Não é você?" at the bottom of the code view)
function backToLinkEmail() {
  showLinkView("form", true);
  linkEmail.focus();
}
// (the back arrow on "Adicionar um cartão" goes back to "Formas de pagamento" instead)
document.getElementById("linkModalBack").addEventListener("click", () => {
  if (linkForm.classList.contains("is-logout")) leaveLinkLogout();
  else if (linkForm.classList.contains("is-remove")) closeRemoveConfirm();
  else if (linkForm.classList.contains("is-update")) {
    showLinkPayments(linkPayPicked);
    editLinkWallet(true);
  } else if (linkForm.classList.contains("is-add")) {
    if (LINK_TEST_CARDS.length) showLinkPayments(linkPayPicked);
  }
  else backToLinkEmail();
});
document.getElementById("linkCodeNotYou").addEventListener("click", backToLinkEmail);

// Looking the email up: for a moment the box turns green with a profile picture and a wave along the email's letters
// (style.css; the box can't be changed meanwhile), then the code view opens. It starts by itself once a valid email
// has been typed and left alone for a moment
const linkCodeBoxes = [...document.querySelectorAll("#linkCodeBoxes input")];
let linkLookup = null;
let linkLookupTimer = null;
function lookUpLinkEmail() {
  clearTimeout(linkLookupTimer);
  if (linkLookup || !emailValid()) return;
  linkEmailField.classList.remove("is-invalid");
  // the email again, one span per letter, each knowing its place (--i) and how many there are (--n) for the wave
  const wave = document.getElementById("linkEmailWave");
  const letters = [...linkEmail.value.trim()];
  // the account's picture: as on Link, the email's first letter in capitals on the green circle
  document.getElementById("linkEmailAvatar").textContent = (letters[0] || "").toLocaleUpperCase("pt");
  wave.replaceChildren(...letters.map((ch, i) => {
    const span = document.createElement("span");
    span.textContent = ch;
    span.style.setProperty("--i", i);
    return span;
  }));
  wave.style.setProperty("--n", letters.length);
  // (an email with no account gets none of that: just a small ring spinning at the right of the box)
  const known = LINK_TEST_ACCOUNTS.includes(linkEmail.value.trim().toLowerCase());
  linkEmailField.classList.add(known ? "is-loading" : "is-checking");
  linkEmail.readOnly = true;
  linkLookup = setTimeout(() => {
    linkLookup = null;
    linkEmailField.classList.remove("is-loading", "is-checking");
    linkEmail.readOnly = false;
    if (!known) {
      showLinkPhone(true);
      return;
    }
    linkNewPhone = "";
    resetLinkCode();
    showLinkView("code", true);
    linkCodeBoxes[0].focus();
  }, 1400);
}
// An email with no Link account: under it, a phone number box opens (the popup growing smoothly), and "Continuar" then
// sends the code to that number to create the account; changing the email closes it again. With no Stripe behind it
// there's no telling which emails have an account, so for now only the test one does (plus any made in this visit)
const LINK_TEST_ACCOUNTS = ["vicentebsousa@gmail.com"];
const linkPhone = document.getElementById("linkPhone");
// the list: every country with its calling code (DIAL_COUNTRIES, from phone-codes.js), by its Portuguese name in
// alphabetical order, e.g. "Portugal (+351)"; picking one changes the flag (the same flag-icons as the other phone boxes)
// and the code in the box
const linkPhoneCountry = document.getElementById("linkPhoneCountry");
linkPhoneCountry.replaceChildren(...DIAL_COUNTRIES
  .filter((c) => c.code !== "AC" && c.code !== "TA")
  .sort((x, y) => x.name.localeCompare(y.name, "pt"))
  .map((c) => new Option(`${c.name} (${c.dial})`, c.code, false, c.code === "PT")));
linkPhoneCountry.addEventListener("change", () => {
  const country = DIAL_COUNTRIES.find((c) => c.code === linkPhoneCountry.value);
  document.getElementById("linkPhoneFlag").className = `fi fi-${country.code.toLowerCase()}`;
  document.getElementById("linkPhoneDial").textContent = country.dial;
  // (a longer code widens the white box, and the number and "Telemóvel" move along with it)
  const left = `${linkPhoneCountry.parentElement.offsetWidth + 21}px`;
  linkPhone.style.paddingLeft = left;
  linkPhoneField.querySelector("label").style.left = left;
  linkPhoneField.classList.remove("is-invalid");
  linkPhone.focus();
});
const linkPhoneField = document.getElementById("linkPhoneField");
// (a Portuguese number has 9 digits; elsewhere anything from 4 to 15)
const phoneValid = () => (linkPhoneCountry.value === "PT" ? digits(linkPhone).length === 9 : /^\d{4,15}$/.test(digits(linkPhone)));
let linkNewPhone = "";
function glideLinkForm(change) {
  const from = linkForm.offsetHeight;
  change();
  if (reduceMotion.matches) return;
  const to = linkForm.offsetHeight;
  linkForm.style.height = `${from}px`;
  void linkForm.offsetHeight;
  linkForm.classList.add("is-resizing");
  linkForm.style.height = `${to}px`;
  clearTimeout(glideLinkForm.timer);
  glideLinkForm.timer = setTimeout(() => {
    linkForm.classList.remove("is-resizing");
    linkForm.style.height = "";
  }, 360);
}
function showLinkPhone(on, smooth = true) {
  if (linkPhoneField.hidden === !on) return;
  const change = () => {
    linkPhoneField.hidden = !on;
    if (!on) {
      linkPhone.value = "";
      linkPhoneField.classList.remove("is-invalid");
    }
  };
  if (smooth && !linkModal.hidden) glideLinkForm(change);
  else change();
  if (on) linkPhone.focus();
}
// (clicked into, it shows the example number; left, a blank space again, so an empty box has just "Telemóvel")
linkPhone.addEventListener("focus", () => { linkPhone.placeholder = linkPhone.dataset.example; });
linkPhone.addEventListener("blur", () => {
  linkPhone.placeholder = " ";
  if (!linkModal.hidden && !linkPhoneField.hidden && linkPhone.value && !phoneValid()) linkPhoneField.classList.add("is-invalid");
});
// typed in threes (912 345 678), digits only; typing takes the red away
linkPhone.addEventListener("input", () => {
  linkPhone.value = digits(linkPhone).slice(0, linkPhoneCountry.value === "PT" ? 9 : 15).replace(/(\d{3})(?=\d)/g, "$1 ");
  linkPhoneField.classList.remove("is-invalid");
});
// "Continuar" with the number right: on to the code, sent to that number (its last two digits shown)
function sendLinkPhoneCode() {
  if (!phoneValid()) {
    linkPhoneField.classList.add("is-invalid");
    linkPhone.focus();
    return;
  }
  linkNewPhone = digits(linkPhone);
  resetLinkCode();
  showLinkView("code", true);
  linkCodeBoxes[0].focus();
}
function cancelLinkLookup() {
  clearTimeout(linkLookupTimer);
  clearTimeout(linkLookup);
  linkLookup = null;
  linkEmailField.classList.remove("is-loading", "is-checking");
  linkEmail.readOnly = false;
}

// The six code boxes take one digit each: typing moves on to the next, backspace on an empty one goes back, the arrows
// move along, and pasting the whole code fills them all
function fillLinkCode(from, text) {
  const nums = text.replace(/\D/g, "").slice(0, linkCodeBoxes.length - from);
  [...nums].forEach((n, i) => { linkCodeBoxes[from + i].value = n; });
  linkCodeBoxes[Math.min(from + nums.length, linkCodeBoxes.length - 1)].focus();
  if (linkCodeBoxes.every((box) => box.value)) checkLinkCode();
}
// Once all six are in, the code is checked: "Reenviar código" and "Enviar código por e-mail" give way to a black
// spinning ring (and the boxes can't be changed). A wrong code brings them back with "Esse código não funcionou…" under
// them and the boxes emptied; the right one turns the ring into a green tick, then opens "Formas de pagamento". With no
// Stripe behind it there's nothing to check the code against, so for now only the test code 000000 works
const LINK_TEST_CODE = "000000";
const linkCodeActions = document.getElementById("linkCodeActions");
const linkCodeError = document.getElementById("linkCodeError");
let linkCodeCheck = null;
function checkLinkCode() {
  if (linkCodeCheck) return;
  linkCodeError.hidden = true;
  linkCodeActions.classList.add("is-checking");
  linkCodeBoxes.forEach((box) => { box.readOnly = true; });
  const right = linkCodeBoxes.map((box) => box.value).join("") === LINK_TEST_CODE;
  linkCodeCheck = setTimeout(() => {
    if (right) {
      linkCodeActions.classList.replace("is-checking", "is-done");
      try { localStorage.setItem("lfcLinkEmail", linkEmail.value.trim()); } catch {}
      if (linkNewPhone) {
        LINK_TEST_ACCOUNTS.push(linkEmail.value.trim().toLowerCase());
        LINK_TEST_CARDS.length = 0;
        linkNewPhone = "";
        showLinkPhone(false, false);
      }
      linkCodeCheck = setTimeout(showLinkPayments, 1100);
      return;
    }
    stopLinkCodeCheck();
    linkCodeError.hidden = false;
    // the wrong code is cleared, ready to type it again from the first box
    linkCodeBoxes.forEach((b) => { b.value = ""; });
    linkCodeBoxes[0].focus();
  }, 1400);
}
function stopLinkCodeCheck() {
  clearTimeout(linkCodeCheck);
  linkCodeCheck = null;
  linkCodeActions.classList.remove("is-checking", "is-done");
  linkCodeBoxes.forEach((box) => { box.readOnly = false; });
}

// "Formas de pagamento": the cards saved in the Link account, the first one picked; clicking another picks it instead.
// "Continuar" closes the popup and uses the picked card in the card boxes, as when ticking the saved card there, and the
// card stays saved in this browser so it shows next time. For now the account always has the same test card
const LINK_TEST_CARDS = [{ name: "Revolut Visa", brand: "Visa", last4: "0214", exp: "09/27" }];
const linkPayList = document.getElementById("linkPayList");
let linkPayPicked = 0;
const linkPayContinue = document.getElementById("linkPayContinue");
function renderLinkPayments() {
  linkPayList.replaceChildren(...LINK_TEST_CARDS.map((card, i) => {
    const brand = CARD_BRANDS.find((b) => b.name === card.brand);
    const li = document.createElement("li");
    // (the red minus, shown while editing the wallet, sits over the card's left side, so it isn't inside its button)
    li.innerHTML = `<button type="button" class="link-modal-pay-remove" aria-label="Remover ${card.name || card.brand} •••• ${last4Of(card)}" tabindex="-1"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9.5" fill="currentColor"/><path d="M6 10h8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg></button>`
      + `<button type="button" class="link-modal-pay-card" role="radio" aria-checked="${i === linkPayPicked}">`
      + (brand ? `<svg viewBox="0 0 24 24" aria-hidden="true">${brand.icon}</svg>` : "")
      + `<span>${card.name || card.brand}<small>•••• ${last4Of(card)}</small></span><i></i></button>`;
    li.lastChild.addEventListener("click", () => {
      if (linkPayEditing) { showLinkUpdate(i); return; }
      linkPayPicked = i;
      linkPayList.querySelectorAll(".link-modal-pay-card").forEach((b, j) => b.setAttribute("aria-checked", String(j === i)));
    });
    li.firstChild.addEventListener("click", () => askRemoveLinkPayCard(i));
    return li;
  }));
  linkPayList.querySelectorAll(".link-modal-pay-remove").forEach((b) => { b.tabIndex = linkPayEditing ? 0 : -1; });
  linkPayContinue.disabled = !LINK_TEST_CARDS.length;
}
function showLinkPayments(picked = 0, smooth = true) {
  stopLinkCodeCheck();
  linkPayPicked = picked;
  editLinkWallet(false);
  renderLinkPayments();
  // an account with no card left (all removed) goes to "Adicionar um cartão" instead
  if (!LINK_TEST_CARDS.length) { openLinkAdd(); return; }
  showLinkView("pay", smooth);
  linkPayContinue.focus();
}
// "Editar carteira" (in the three dots' menu): a red circle with a minus slides in at the left of each card's logo, and
// clicking it removes that card from the account; meanwhile the three dots' circle turns black with a yellow tick, which
// stops editing. Removing the
// card saved in this browser takes it out of the card boxes too (the next card, if any, takes its place there; with
// none left, the box goes back to "Utilizar")
let linkPayEditing = false;
function editLinkWallet(on) {
  linkPayEditing = on;
  linkPayList.classList.toggle("is-editing", on);
  linkForm.classList.toggle("is-editing", on);
  linkPayMenuBtn.setAttribute("aria-label", on ? "Concluir edição" : "Mais opções");
  linkPayList.querySelectorAll(".link-modal-pay-remove").forEach((b) => { b.tabIndex = on ? 0 : -1; });
}
// (asked first, on a page of the popup: "Remover cartão?", naming the card, with a red "Remover" and "Cancelar"; the
// back circle cancels too. Either way it goes back to the cards, still editing)
let linkRemoving = null;
function askRemoveLinkPayCard(i) {
  const card = LINK_TEST_CARDS[i];
  linkRemoving = i;
  // (on two lines, the second starting at "removido")
  document.getElementById("linkRemoveText").replaceChildren(`${card.name || card.brand} •••• ${last4Of(card)} será`, document.createElement("br"), "removido da sua conta da Link");
  showLinkView("remove", true);
  document.getElementById("linkRemoveCancel").focus();
}
function backToLinkWallet() {
  showLinkPayments(linkPayPicked);
  editLinkWallet(true);
}
function closeRemoveConfirm() {
  const i = linkRemoving;
  linkRemoving = null;
  backToLinkWallet();
  const minus = linkPayList.querySelectorAll(".link-modal-pay-remove")[i];
  if (minus) minus.focus();
}
document.getElementById("linkRemoveCancel").addEventListener("click", closeRemoveConfirm);
document.getElementById("linkRemoveOk").addEventListener("click", () => {
  const i = linkRemoving;
  linkRemoving = null;
  LINK_TEST_CARDS.splice(i, 1);
  if (linkPayPicked >= i && linkPayPicked > 0) linkPayPicked--;
  forgetSavedLinkCard();
  // the last one gone: straight on to "Adicionar um cartão", with no way back to the (empty) cards until one is added
  if (!LINK_TEST_CARDS.length) {
    editLinkWallet(false);
    renderLinkPayments();
    openLinkAdd();
    return;
  }
  backToLinkWallet();
  linkPayList.querySelectorAll(".link-modal-pay-remove")[Math.min(i, LINK_TEST_CARDS.length - 1)].focus();
});
// the card saved in this browser no longer in the account: out of the card boxes too, the next card (if any) taking
// its place there, or "Utilizar" with none left
function forgetSavedLinkCard() {
  if (!linkCard || LINK_TEST_CARDS.some((c) => c.brand === linkCard.brand && last4Of(c) === last4Of(linkCard))) return;
  if (linkSelected) setLinkSelected(false);
  linkCard = LINK_TEST_CARDS[0] || null;
  try {
    if (linkCard) localStorage.setItem("lfcLinkCard", JSON.stringify(linkCard));
    else localStorage.removeItem("lfcLinkCard");
  } catch {}
  renderLinkCard();
  showLink();
}
// the three dots open a small menu: "Editar carteira" and "Abrir aplicativo" (links to the Link account), and "Sair",
// which goes back to the email box; a click anywhere else, or switching view, closes it
const linkPayMenuBtn = document.getElementById("linkPayMenuBtn");
const linkPayMenu = document.getElementById("linkPayMenu");
// (the email signed in, under the options, is the one typed in the popup, kept in this browser once its code worked, so
// it's still known when the popup opens straight on the cards; "Sair" forgets it)
const linkPayEmail = document.getElementById("linkPayEmail");
function showLinkPayMenu(on) {
  let email = "";
  try { email = localStorage.getItem("lfcLinkEmail") || ""; } catch {}
  linkPayEmail.textContent = email;
  linkPayEmail.hidden = !email;
  linkPayMenu.hidden = !on;
  linkPayMenuBtn.setAttribute("aria-expanded", String(on));
}
linkPayMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (linkPayEditing) { editLinkWallet(false); return; }
  showLinkPayMenu(linkPayMenu.hidden);
});
document.addEventListener("click", (e) => { if (!linkPayMenu.contains(e.target) || e.target.closest("a")) showLinkPayMenu(false); });
document.getElementById("linkPayEdit").addEventListener("click", () => {
  showLinkPayMenu(false);
  editLinkWallet(!linkPayEditing);
});
// "Sair" asks first, on a page of the popup: "Fazer logout?", what it does, then "Cancelar" (or the back circle), back to
// where it was opened from, and a red "Sair". Signing out forgets the Link card and email kept in this browser: the card
// leaves the card boxes, which go back to "Utilizar", and the popup closes (its email box emptied for next time)
document.getElementById("linkPaySignOut").addEventListener("click", () => {
  showLinkPayMenu(false);
  showLinkView("logout", true);
  document.getElementById("linkLogoutCancel").focus();
});
function leaveLinkLogout() {
  if (LINK_TEST_CARDS.length) showLinkPayments(linkPayPicked);
  else openLinkAdd();
}
document.getElementById("linkLogoutCancel").addEventListener("click", leaveLinkLogout);
// ("Sair" first spins a yellow ring in place of its text for a moment, then the popup closes, the card
// box showing "Utilizar" again)
const linkLogoutOk = document.getElementById("linkLogoutOk");
linkLogoutOk.addEventListener("click", () => {
  if (linkLogoutOk.classList.contains("is-loading")) return;
  linkLogoutOk.classList.add("is-loading");
  linkLogoutOk.setAttribute("aria-busy", "true");
  setTimeout(() => {
    linkLogoutOk.classList.remove("is-loading");
    linkLogoutOk.removeAttribute("aria-busy");
    // closed or left meanwhile: still signed in
    if (linkModal.hidden || linkModal.classList.contains("is-closing") || !linkForm.classList.contains("is-logout")) return;
    try {
      localStorage.removeItem("lfcLinkEmail");
      localStorage.removeItem("lfcLinkCard");
    } catch {}
    if (linkSelected) setLinkSelected(false);
    linkCard = null;
    showLink();
    linkEmail.value = "";
    closeLinkModal();
  }, 1400);
});
// "Cartão" (under "Adicionar forma de pagamento") opens "Adicionar um cartão": the card number (spaced in fours),
// Validade (MM/AA, the "/" added while typing), CVC and País ou região (Portugal picked). They're checked the same way
// as the card boxes on the page, and "Continuar" only works once they're right; then the card joins the list in
// "Formas de pagamento", picked, under the brand's name. Nothing is sent to Link yet, so it's only kept until the
// page is left
const linkAddNumber = document.getElementById("linkAddNumber");
const linkAddExpiry = document.getElementById("linkAddExpiry");
const linkAddCvc = document.getElementById("linkAddCvc");
const linkAddCountry = document.getElementById("linkAddCountry");
const linkAddAmex = () => /^3[47]/.test(digits(linkAddNumber));
const linkAddChecks = [
  [linkAddNumber, () => linkUpdating !== null || digits(linkAddNumber).length === (linkAddAmex() ? 15 : 16)],
  [linkAddExpiry, () => {
    const [, mm, yy] = linkAddExpiry.value.match(/^(\d{2})\/(\d{2})$/) || [];
    if (!mm || mm < 1 || mm > 12) return false;
    const now = new Date();
    const year = 2000 + Number(yy);
    return year > now.getFullYear() || (year === now.getFullYear() && Number(mm) >= now.getMonth() + 1);
  }],
  [linkAddCvc, () => digits(linkAddCvc).length === (linkAddAmex() ? 4 : 3)],
];
// every country the browser can name in Portuguese, in alphabetical order (just Portugal if it can't); left out, as in
// the País box in checkout.js, are groupings that aren't countries and old codes repeating a current country
const NOT_COUNTRIES = ["EU", "EZ", "UN", "QO", "XA", "XB", "ZZ", "AN", "BU", "CS", "DD", "FX", "SU", "TP", "YD", "YU", "ZR", "UK"];
linkAddCountry.replaceChildren(...(() => {
  let display;
  try { display = new Intl.DisplayNames(["pt-PT"], { type: "region" }); } catch { return [new Option("Portugal")]; }
  const names = new Set();
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b);
      if (NOT_COUNTRIES.includes(code)) continue;
      let name;
      try { name = display.of(code); } catch { continue; }
      if (name && name !== code) names.add(name);
    }
  }
  return [...names].sort((x, y) => x.localeCompare(y, "pt")).map((name) => new Option(name, name, false, name === "Portugal"));
})());
linkAddNumber.addEventListener("input", () => {
  linkAddNumber.value = digits(linkAddNumber).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  showLinkAddBrand();
});
// At the right of the card number box, the card companies' logos take turns every 3 seconds (Visa, Mastercard,
// American Express, Maestro), fading from one to the next; as soon as the digits typed give the company away (the same
// test as the card boxes on the page), only that one shows, and the turns start again if they stop matching
const linkAddBrand = document.getElementById("linkAddBrand");
let linkAddBrandTurn = 0;
function setLinkAddBrand(brand) {
  if (linkAddBrand.dataset.brand === brand.name) return;
  linkAddBrand.dataset.brand = brand.name;
  linkAddBrand.classList.add("is-fading");
  setTimeout(() => {
    linkAddBrand.innerHTML = `<svg viewBox="0 0 24 24" role="img" aria-label="${brand.name}">${brand.icon}</svg>`;
    linkAddBrand.classList.remove("is-fading");
  }, 200);
}
function showLinkAddBrand() {
  setLinkAddBrand(brandOf(digits(linkAddNumber)) || CARD_BRANDS[linkAddBrandTurn]);
}
setInterval(() => {
  if (linkUpdating !== null || brandOf(digits(linkAddNumber))) return;
  linkAddBrandTurn = (linkAddBrandTurn + 1) % CARD_BRANDS.length;
  showLinkAddBrand();
}, 3000);
showLinkAddBrand();
linkAddExpiry.addEventListener("input", (e) => {
  let d = digits(linkAddExpiry).slice(0, 4);
  if (e.inputType === "deleteContentBackward" && d.length === 2 && !linkAddExpiry.value.includes("/")) d = d.slice(0, 1);
  linkAddExpiry.value = d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
});
linkAddCvc.addEventListener("input", () => {
  linkAddCvc.value = digits(linkAddCvc).slice(0, 4);
});
// clicked into, each box shows its example (data-example in pagamento.html); left, it goes back to a blank space, which
// is what lets the box's name sit big in the middle while it's empty
[linkAddNumber, linkAddExpiry, linkAddCvc].forEach((input) => {
  input.addEventListener("focus", () => { input.placeholder = input.dataset.example; });
  input.addEventListener("blur", () => { input.placeholder = " "; });
});
// Leaving a box with something unfinished or wrong in it turns it red with a line saying what's wrong ("O número do
// cartão está incompleto", …, in pagamento.html); typing in it takes that away again. "Continuar" stays off (light
// grey text) until all three are right. Typing the last digit that makes the number or Validade right moves on to the
// next box
const linkAddSubmit = document.getElementById("linkAddSubmit");
const updateLinkAddSubmit = () => { linkAddSubmit.disabled = !linkAddChecks.every(([, ok]) => ok()); };
linkAddChecks.forEach(([input, ok], i) => {
  const field = input.closest(".link-modal-field");
  input.addEventListener("input", (e) => {
    field.classList.remove("is-invalid");
    updateLinkAddSubmit();
    const next = linkAddChecks[i + 1];
    if (next && ok() && e.inputType && !e.inputType.startsWith("delete")) next[0].focus();
  });
  input.addEventListener("blur", () => {
    if (linkForm.classList.contains("is-add") && input.value && !ok()) field.classList.add("is-invalid");
  });
});
function openLinkAdd() {
  linkUpdating = null;
  linkAddNumber.readOnly = false;
  linkAddNumber.tabIndex = 0;
  linkAddSubmit.textContent = "Continuar";
  [linkAddNumber, linkAddExpiry, linkAddCvc].forEach((input) => {
    input.value = "";
    input.closest(".link-modal-field").classList.remove("is-invalid");
  });
  linkAddCountry.value = "Portugal";
  updateLinkAddSubmit();
  showLinkAddBrand();
  showLinkView("add", true);
  linkAddNumber.focus();
}
document.getElementById("linkPayNewCard").addEventListener("click", openLinkAdd);
// "Continuar": its text gives way to a yellow spinning ring for a moment (the card being added to Link), then the new
// card joins the account's cards and is used straight away in the checkout, the popup closing, as "Continuar" does on
// "Formas de pagamento"
linkAddSubmit.addEventListener("click", () => {
  linkAddChecks.forEach(([input, ok]) => input.closest(".link-modal-field").classList.toggle("is-invalid", !ok()));
  if (!linkAddChecks.every(([, ok]) => ok()) || linkAddSubmit.classList.contains("is-loading")) return;
  if (linkUpdating !== null) { updateLinkPayCard(); return; }
  const brand = brandOf(digits(linkAddNumber));
  const card = {
    name: brand ? brand.name : "Cartão",
    brand: brand ? brand.name : "",
    last4: digits(linkAddNumber).slice(-4),
    exp: linkAddExpiry.value,
  };
  linkAddSubmit.classList.add("is-loading");
  linkAddSubmit.setAttribute("aria-busy", "true");
  setTimeout(() => {
    linkAddSubmit.classList.remove("is-loading");
    linkAddSubmit.removeAttribute("aria-busy");
    // closed meanwhile: nothing is added
    if (linkModal.hidden || linkModal.classList.contains("is-closing")) return;
    LINK_TEST_CARDS.push(card);
    linkPayPicked = LINK_TEST_CARDS.length - 1;
    useLinkCard(card);
  }, 1400);
});
document.getElementById("linkPayContinue").addEventListener("click", () => useLinkCard(LINK_TEST_CARDS[linkPayPicked]));
// "Atualizar cartão" (the arrow on a card while editing the wallet): the same boxes as "Adicionar um cartão", with the
// card number shown (only its last digits) and fixed, its company's logo still at the right, and Validade filled in;
// CVC has to be typed again. "Atualizar" spins the same yellow ring, then saves the new date (in the card boxes on the
// page too, if it's the card saved there) and goes back to the cards, still editing
let linkUpdating = null;
function showLinkUpdate(i) {
  const card = LINK_TEST_CARDS[i];
  linkUpdating = i;
  linkAddNumber.readOnly = true;
  linkAddNumber.tabIndex = -1;
  linkAddNumber.value = `•••• •••• •••• ${last4Of(card)}`;
  linkAddExpiry.value = card.exp || "";
  linkAddCvc.value = "";
  [linkAddNumber, linkAddExpiry, linkAddCvc].forEach((input) => input.closest(".link-modal-field").classList.remove("is-invalid"));
  linkAddCountry.value = "Portugal";
  const brand = CARD_BRANDS.find((b) => b.name === card.brand);
  if (brand) setLinkAddBrand(brand);
  linkAddSubmit.textContent = "Atualizar";
  updateLinkAddSubmit();
  showLinkView("update", true);
  linkAddExpiry.focus();
}
function updateLinkPayCard() {
  const i = linkUpdating;
  linkAddSubmit.classList.add("is-loading");
  linkAddSubmit.setAttribute("aria-busy", "true");
  setTimeout(() => {
    linkAddSubmit.classList.remove("is-loading");
    linkAddSubmit.removeAttribute("aria-busy");
    // closed or left meanwhile: nothing changes
    if (linkModal.hidden || linkModal.classList.contains("is-closing") || !linkForm.classList.contains("is-update")) return;
    const card = LINK_TEST_CARDS[i];
    const saved = linkCard && card.brand === linkCard.brand && last4Of(card) === last4Of(linkCard);
    card.exp = linkAddExpiry.value;
    if (saved) {
      linkCard = card;
      try { localStorage.setItem("lfcLinkCard", JSON.stringify(linkCard)); } catch {}
      if (linkSelected) document.getElementById("pgCardLinkExp").textContent = card.exp;
    }
    backToLinkWallet();
  }, 1400);
}
// using a card from Link: it's kept in this browser as the saved Link card, put in the card boxes (ticked, as when
// ticking it there) and the popup closes
function useLinkCard(card) {
  linkCard = card;
  try { localStorage.setItem("lfcLinkCard", JSON.stringify(linkCard)); } catch {}
  renderLinkCard();
  pgCardNumber.value = "";
  showCardBrand();
  showLink();
  slideLinkSelected(true);
  closeLinkModal();
}
linkCodeBoxes.forEach((box, i) => {
  box.addEventListener("input", () => {
    const typed = box.value;
    box.value = "";
    // changing the code takes the red line away
    linkCodeError.hidden = true;
    if (typed) fillLinkCode(i, typed);
  });
  box.addEventListener("keydown", (e) => {
    if (box.readOnly) return;
    if (e.key === "Backspace") linkCodeError.hidden = true;
    if (e.key === "Backspace" && !box.value && i > 0) {
      e.preventDefault();
      linkCodeBoxes[i - 1].value = "";
      linkCodeBoxes[i - 1].focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      linkCodeBoxes[i - 1].focus();
    } else if (e.key === "ArrowRight" && i < linkCodeBoxes.length - 1) {
      e.preventDefault();
      linkCodeBoxes[i + 1].focus();
    }
  });
  box.addEventListener("paste", (e) => {
    e.preventDefault();
    if (box.readOnly) return;
    linkCodeError.hidden = true;
    fillLinkCode(i, e.clipboardData.getData("text"));
  });
  box.addEventListener("focus", () => box.select());
});

// Under the boxes: "Reenviar código" empties them and says "Código reenviado" for a few seconds; "Enviar código por
// e-mail" says the code went to the email instead (shown in place of the phone's last digits) and then goes. Neither
// sends anything yet
const linkCodeTo = document.getElementById("linkCodeTo");
const linkCodeResend = document.getElementById("linkCodeResend");
const linkCodeByEmail = document.getElementById("linkCodeByEmail");
function resetLinkCode() {
  stopLinkCodeCheck();
  linkCodeError.hidden = true;
  linkCodeBoxes.forEach((box) => { box.value = ""; });
  document.getElementById("linkCodeAccount").textContent = linkEmail.value.trim();
  linkCodeTo.textContent = `••• ••• •${linkNewPhone ? linkNewPhone.slice(-2) : "20"}`;
  linkCodeByEmail.hidden = false;
  clearTimeout(linkCodeResend.timer);
  linkCodeResend.disabled = false;
  linkCodeResend.textContent = "Reenviar código";
}
linkCodeResend.addEventListener("click", () => {
  linkCodeError.hidden = true;
  linkCodeBoxes.forEach((box) => { box.value = ""; });
  linkCodeBoxes[0].focus();
  linkCodeResend.disabled = true;
  linkCodeResend.textContent = "Código reenviado";
  linkCodeResend.timer = setTimeout(() => {
    linkCodeResend.disabled = false;
    linkCodeResend.textContent = "Reenviar código";
  }, 4000);
});
linkCodeByEmail.addEventListener("click", () => {
  linkCodeTo.textContent = linkEmail.value.trim();
  linkCodeError.hidden = true;
  linkCodeBoxes.forEach((box) => { box.value = ""; });
  linkCodeByEmail.hidden = true;
  linkCodeBoxes[0].focus();
});
// while the popup is open the page behind it can't scroll; the scrollbar's width is made up with padding so nothing shifts
function lockPageScroll(on) {
  const root = document.documentElement;
  root.style.paddingRight = on ? `${innerWidth - root.clientWidth}px` : "";
  root.classList.toggle("is-modal-open", on);
}
function openLinkModal() {
  cancelLinkLookup();
  showLinkPhone(false, false);
  showLinkView("form");
  linkModal.classList.remove("is-closing");
  linkModal.hidden = false;
  lockPageScroll(true);
  linkEmailField.classList.remove("is-invalid");
  linkEmailTyped = !!linkEmail.value;
  linkEmail.focus();
}
// closing (not opening) slides the popup down as the dark background fades, then hides it
function closeLinkModal() {
  if (linkModal.hidden || linkModal.classList.contains("is-closing")) return;
  cancelLinkLookup();
  linkModal.classList.add("is-closing");
  // back on "Utilizar", or on the saved card once signed in
  (linkCard ? pgCardLink : pgCardLinkLogin).focus();
}
linkModal.addEventListener("animationend", (e) => {
  if (e.target !== linkModal || !linkModal.classList.contains("is-closing")) return;
  linkModal.classList.remove("is-closing");
  linkModal.hidden = true;
  lockPageScroll(false);
});
pgCardLinkLogin.addEventListener("click", openLinkModal);
// The saved Link card in the card number box, once ticked: hovering it widens it a little to show an arrow at its
// right end, and the arrow opens the popup straight on "Formas de pagamento" (already signed in), the saved card
// picked; the rest of the box still unticks it
// (the Validade and CVC grey boxes have the same arrow on hover)
document.querySelectorAll("#pgCard .co-card-link-open").forEach((arrow) => arrow.addEventListener("click", (e) => {
  e.stopPropagation();
  let picked = LINK_TEST_CARDS.findIndex((c) => c.brand === linkCard.brand && c.last4 === linkCard.last4);
  // a card added in an earlier visit isn't in this visit's list yet
  if (picked < 0) picked = LINK_TEST_CARDS.push(linkCard) - 1;
  openLinkModal();
  showLinkPayments(picked, false);
}));
document.getElementById("linkModalClose").addEventListener("click", closeLinkModal);
linkModal.addEventListener("click", (e) => { if (e.target === linkModal) closeLinkModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !linkModal.hidden) closeLinkModal(); });
// typing or deleting clears the warnings straight away
let linkEmailTyped = false;
linkEmail.addEventListener("input", () => {
  if (linkEmail.value) linkEmailTyped = true;
  linkEmailField.classList.remove("is-invalid");
  showLinkPhone(false);
  // a valid email left alone for a moment is looked up by itself
  clearTimeout(linkLookupTimer);
  if (emailValid()) linkLookupTimer = setTimeout(lookUpLinkEmail, 800);
});
// leaving the box (clicking elsewhere, switching tabs) with a wrong email in it marks it as wrong too; so does leaving
// it empty after something was typed and deleted (just the red outline and "!", not the message)
linkEmail.addEventListener("blur", () => {
  if (linkModal.hidden || linkLookup || linkForm.matches(".is-info, .is-code")) return;
  if (linkEmail.value.trim() ? !emailValid() : linkEmailTyped) linkEmailField.classList.add("is-invalid");
});
// "Continuar" looks the email up straight away, or turns the box red if it's wrong
linkForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!emailValid()) {
    linkEmailField.classList.add("is-invalid");
    return;
  }
  if (!linkPhoneField.hidden) sendLinkPhoneCode();
  else lookUpLinkEmail();
});
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
// The same, moving: ticking slides the three grey boxes in to the right, into place; unticking slides them out to the
// left, then the grey examples (1234 1234 1234 1234, MM/AA, CVC) slide back in to the left and the black Link box fades
// back in (classes in style.css; no movement for someone who'd rather have less)
function restartClass(el, name, ms) {
  el.classList.remove(name);
  void el.offsetWidth;
  el.classList.add(name);
  clearTimeout(restartClass[name]);
  restartClass[name] = setTimeout(() => el.classList.remove(name), ms);
}
let linkSliding = false;
function slideLinkSelected(on) {
  if (linkSliding) return;
  if (reduceMotion.matches) {
    setLinkSelected(on);
    return;
  }
  if (on) {
    pgCard.classList.remove("is-unlink-in");
    setLinkSelected(true);
    restartClass(pgCard, "is-link-in", 400);
    return;
  }
  linkSliding = true;
  pgCard.classList.add("is-link-out");
  setTimeout(() => {
    linkSliding = false;
    pgCard.classList.remove("is-link-out", "is-link-in");
    setLinkSelected(false);
    restartClass(pgCard, "is-unlink-in", 400);
  }, 300);
}
pgCardLink.addEventListener("click", () => slideLinkSelected(!linkSelected));
// the ✕ shown beside the ticked card on hover takes it out of the boxes, the same as unticking it
document.getElementById("pgCardLinkClear").addEventListener("click", (e) => {
  e.stopPropagation();
  slideLinkSelected(false);
  pgCardNumber.focus();
});

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
  // (Referência Multibanco and Klarna aren't paid here, so it says "Finalizar encomenda" for them)
  pgPay.textContent = method && (method.value === "multibanco" || method.value === "prestacoes") ? "Finalizar encomenda" : "Pagar";
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
  document.getElementById("pgMultibanco").hidden = !method || method.value !== "multibanco";
  document.getElementById("pgKlarna").hidden = !method || method.value !== "prestacoes";
}
pgForm.addEventListener("change", () => {
  showPanels();
  updatePay();
});
// there's no payment provider behind it yet, so nothing is charged or sent
pgForm.addEventListener("submit", (e) => e.preventDefault());
