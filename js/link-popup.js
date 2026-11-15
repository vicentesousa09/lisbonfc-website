// The Link popup (Stripe's saved cards), shared by the pages with a card number box that can be filled from Link: the
// checkout's payment step (pagamento.js) and the quotas' single payment by card (quotas-cartao-unico.js). This file
// adds the popup to the page and runs all of it: the Link account's e-mail, the code sent to its phone, the cards
// kept in it ("Formas de pagamento"), adding, updating and removing cards, and signing out.
//
// The page using it loads phone-codes.js before this file (for the countries' calling codes) and, in a script after
// it, says what happens on its side in LINK_HOST:
//   use(card)      a card was picked in the popup: put it in the page's card boxes (the popup closes itself)
//   unuse()        the card in the page's boxes is no longer in the account: take it out of them
//   refresh()      the card kept in this browser (linkCard, below) changed or went: show it, or its absence, again
//   updated(card)  the kept card got a new expiry
//   focus()        the popup closed: put the keyboard back where it was opened from
// and opens it with openLinkModal() (on the e-mail) followed, for someone already signed in, by showLinkPayments(i, false)

document.body.insertAdjacentHTML("beforeend", `
<div class="captcha-modal link-modal" id="linkModal" hidden>
  <form class="captcha-modal-box link-modal-box" id="linkForm" role="dialog" aria-modal="true" aria-labelledby="linkModalTitle" novalidate>
    <button type="button" class="link-modal-close" id="linkModalClose" aria-label="Fechar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    <!-- on the Link details: the same grey circle on the left, with an arrow back to the email box -->
    <button type="button" class="link-modal-close link-modal-back" id="linkModalBack" aria-label="Voltar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 6 8.5 12l6 6"/></svg></button>
    <!-- on "Formas de pagamento": a grey circle with three dots in the top-left corner, opening a small menu -->
    <button type="button" class="link-modal-close link-modal-menu-btn" id="linkPayMenuBtn" aria-label="Mais opções" aria-haspopup="menu" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5.5" cy="12" r="1.9" fill="currentColor"/><circle cx="12" cy="12" r="1.9" fill="currentColor"/><circle cx="18.5" cy="12" r="1.9" fill="currentColor"/></svg><svg class="link-modal-menu-done" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 12.5l4.2 4.2 8.8-9.4"/></svg></button>
    <!-- each with a small black icon on its left (a square with a pencil, the "opens elsewhere" arrow, a half square with
         an arrow out); under "Sair", inside it, the email signed in to Link, small and grey. "Editar carteira" puts a red minus by each card, to remove it (the dots circle turns black with a yellow tick
         meanwhile, to stop); "Abrir aplicação" goes to the Link account on link.com (in a new tab), "Sair" signs out -->
    <div class="link-modal-menu" id="linkPayMenu" role="menu" hidden>
      <button type="button" role="menuitem" id="linkPayEdit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M17.6 3.4a1.9 1.9 0 0 1 2.7 2.7l-8 8-3.6.9.9-3.6z"/></svg>Editar carteira</button>
      <a href="https://app.link.com/login" role="menuitem" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>Abrir aplicação</a>
      <button type="button" role="menuitem" id="linkPaySignOut"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="M10 12h10M16 8l4 4-4 4"/></svg><span>Sair<span class="link-modal-menu-email" id="linkPayEmail"></span></span></button>
    </div>
    <!-- the link logo switches the popup to the "what is Link" details (and back): its own title, no email box or "Continuar" -->
    <button type="button" class="co-card-link-logo link-modal-logo" id="linkModalLogo" aria-expanded="false" aria-controls="linkModalInfo" aria-label="Sobre o Link"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="#00D66F"/><path d="M6.6 4.6 10 8l-3.4 3.4" fill="none" stroke="#011E0F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>link</button>
    <h2 id="linkModalTitle"><span class="link-modal-title-form">Checkout rápido e seguro</span><span class="link-modal-title-info">Pague rapidamente,<br>compre com confiança</span><span class="link-modal-title-code">Confirme a sua identidade</span><span class="link-modal-title-pay">Formas de pagamento</span><span class="link-modal-title-add">Adicionar um cartão</span><span class="link-modal-title-update">Atualizar cartão</span><span class="link-modal-title-remove">Remover cartão?</span><span class="link-modal-title-logout">Terminar sessão?</span></h2>
    <p>Indique o seu e-mail para iniciar sessão ou registar-se</p>
    <div class="co-field link-modal-email">
      <label for="linkEmail">E-mail</label>
      <input type="email" id="linkEmail" autocomplete="email" placeholder=" " aria-describedby="linkEmailError">
      <span class="link-modal-alert" aria-hidden="true"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 5.6v5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="14" r="1.1" fill="currentColor"/></svg></span>
      <!-- while the email is looked up: a profile picture on the left, and the email again on top of the box's own
           (hidden) text, with a green wave running through it -->
      <span class="link-modal-avatar" id="linkEmailAvatar" aria-hidden="true"></span>
      <span class="link-modal-wave" id="linkEmailWave" aria-hidden="true"></span>
      <span class="link-modal-spinner" aria-hidden="true"></span>
      <p class="link-modal-error" id="linkEmailError">O e-mail introduzido é inválido.</p>
    </div>
    <!-- an email with no Link account yet: a phone number box opens under it, for the code that creates the account -->
    <div class="co-field link-modal-email link-modal-phone" id="linkPhoneField" hidden>
      <!-- on its left, a small white box with the country's flag and code (Portugal, +351, to start with); clicking it opens
           the list of every country with its code ("Portugal (+351)"), the select itself lying invisible over the box.
           Then "Telemóvel": big in the middle while empty, small at the top over an example number once clicked -->
      <span class="link-modal-phone-code">
        <span class="fi fi-pt" id="linkPhoneFlag" aria-hidden="true"></span>
        <span id="linkPhoneDial">+351</span>
        <select id="linkPhoneCountry" aria-label="País do telefone"></select>
      </span>
      <label for="linkPhone">Telemóvel</label>
      <input type="tel" id="linkPhone" inputmode="tel" autocomplete="tel-national" placeholder=" " data-example="912 345 678" aria-describedby="linkPhoneError">
      <span class="link-modal-alert" aria-hidden="true"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 5.6v5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="14" r="1.1" fill="currentColor"/></svg></span>
      <p class="link-modal-error" id="linkPhoneError">O número de telefone é inválido.</p>
    </div>
    <button type="submit" class="co-pay">Continuar</button>
    <!-- after the email is looked up: the 6-digit code sent to the account's phone (only its last digits shown) -->
    <div class="link-modal-code" id="linkModalCode">
      <p>Introduza o código enviado para <span id="linkCodeTo">••• ••• •20</span> para usar os seus dados guardados.</p>
      <div class="link-modal-code-boxes" id="linkCodeBoxes" role="group" aria-label="Código de 6 dígitos">
        <input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="1" aria-label="Dígito 1">
        <input type="text" inputmode="numeric" maxlength="1" aria-label="Dígito 2">
        <input type="text" inputmode="numeric" maxlength="1" aria-label="Dígito 3">
        <input type="text" inputmode="numeric" maxlength="1" aria-label="Dígito 4">
        <input type="text" inputmode="numeric" maxlength="1" aria-label="Dígito 5">
        <input type="text" inputmode="numeric" maxlength="1" aria-label="Dígito 6">
      </div>
      <!-- send the code again, or to the email instead of the phone; while a full code is checked, a black ring spins in
           their place, and a code that didn't work is said under them -->
      <div class="link-modal-code-actions" id="linkCodeActions">
        <button type="button" id="linkCodeResend">Reenviar código</button>
        <button type="button" id="linkCodeByEmail">Enviar código por e-mail</button>
        <span class="link-modal-code-spinner" aria-hidden="true"></span>
        <svg class="link-modal-code-check" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="16" fill="transparent" stroke="#00D66F" stroke-width="2" transform="rotate(-90 17 17)"/><path d="M11 17.5l4 4 8-8.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <p class="link-modal-code-error" id="linkCodeError" role="alert" hidden>Esse código não funcionou. Verifique e tente novamente.</p>
      </div>
      <!-- the email being signed in with, and a way back to change it -->
      <div class="link-modal-code-account">
        <span id="linkCodeAccount"></span>
        <button type="button" id="linkCodeNotYou">Não é o titular?</button>
      </div>
    </div>
    <!-- signed in: the cards saved in Link to pick from (filled in by pagamento.js), and "Continuar" to use the picked one -->
    <div class="link-modal-pay" id="linkModalPay">
      <p>Selecione como pretende pagar</p>
      <ul class="link-modal-pay-list" id="linkPayList" role="radiogroup" aria-label="Formas de pagamento"></ul>
      <!-- or a new card: the same grey block, with a black card on a darker grey rounded square, "Cartão" and an arrow -->
      <p>Adicionar forma de pagamento</p>
      <button type="button" class="link-modal-pay-card link-modal-pay-new" id="linkPayNewCard">
        <em aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/></svg></em>
        <span>Cartão</span>
        <b aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6l6 6-6 6"/></svg></b>
      </button>
      <button type="button" class="co-pay" id="linkPayContinue">Continuar</button>
    </div>
    <!-- "Adicionar um cartão", from "Cartão": a new card for the Link account (the countries are filled in by pagamento.js) -->
    <!-- the red minus on a card (editing the wallet) asks first, on a page of its own: the card named, then "Cancelar" and
         "Remover" (red) side by side -->
    <div class="link-modal-remove" id="linkModalRemove">
      <p id="linkRemoveText"></p>
      <div class="link-modal-remove-actions">
        <button type="button" class="link-modal-remove-cancel" id="linkRemoveCancel">Cancelar</button>
        <button type="button" class="link-modal-remove-ok" id="linkRemoveOk">Remover</button>
      </div>
    </div>
    <!-- "Sair" (in the three dots' menu) asks first too, on its own page laid out the same way -->
    <div class="link-modal-remove link-modal-logout" id="linkModalLogout">
      <p>Isto terminará a sua sessão e<br>removerá as suas informações de<br>checkout da Link deste dispositivo.<br>Poderá iniciar sessão novamente a<br>qualquer momento com o seu e-mail.</p>
      <div class="link-modal-remove-actions">
        <button type="button" class="link-modal-remove-cancel" id="linkLogoutCancel">Cancelar</button>
        <button type="button" class="link-modal-remove-ok" id="linkLogoutOk">Sair</button>
      </div>
    </div>
    <div class="link-modal-add" id="linkModalAdd">
      <div class="link-modal-field">
        <input type="text" id="linkAddNumber" inputmode="numeric" autocomplete="cc-number" placeholder=" " data-example="1234 1234 1234 1234">
        <label for="linkAddNumber">Número do cartão</label>
        <span class="link-modal-card-brand" id="linkAddBrand" aria-hidden="true"></span>
        <p class="link-modal-field-error">O número do cartão está incompleto</p>
      </div>
      <div class="link-modal-add-row">
        <div class="link-modal-field">
          <input type="text" id="linkAddExpiry" inputmode="numeric" autocomplete="cc-exp" placeholder=" " data-example="MM/AA">
          <label for="linkAddExpiry">Validade</label>
          <span class="link-modal-alert" aria-hidden="true"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 5.6v5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="14" r="1.1" fill="currentColor"/></svg></span>
          <p class="link-modal-field-error">A validade do cartão é inválida</p>
        </div>
        <div class="link-modal-field">
          <input type="text" id="linkAddCvc" inputmode="numeric" autocomplete="cc-csc" placeholder=" " data-example="CVC">
          <label for="linkAddCvc">CVC</label>
          <span class="link-modal-alert" aria-hidden="true"><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 5.6v5.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="14" r="1.1" fill="currentColor"/></svg></span>
          <p class="link-modal-field-error">CVC é inválido</p>
        </div>
      </div>
      <div class="link-modal-field">
        <select id="linkAddCountry" autocomplete="off"></select>
        <label for="linkAddCountry">País ou região</label>
        <svg class="link-modal-field-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      <button type="button" class="co-pay" id="linkAddSubmit" disabled>Continuar</button>
    </div>
    <div class="link-modal-info" id="linkModalInfo">
      <div class="link-modal-info-inner">
        <ul>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>
            <div><strong>Rápido e simples</strong><p>Preencha automaticamente os seus dados de pagamento, de contacto e de envio na finalização da compra.</p></div>
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></svg>
            <div><strong>Várias formas de pagamento</strong><p>Escolha entre os seus cartões favoritos ou conta bancária.</p></div>
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
            <div><strong>Protege os seus dados</strong><p>Compre em segurança sabendo que as suas informações estão encriptadas.</p></div>
          </li>
        </ul>
        <a href="https://link.com/pt-pt" class="co-pay link-modal-more" target="_blank" rel="noopener">Saiba mais</a>
        <!-- Link's privacy and cookie policies (addresses still to be filled in) -->
        <div class="link-modal-legal">
          <a href="#">Privacidade</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </div>
  </form>
</div>
`);

// digits only, of what's in a box
const digits = (input) => input.value.replace(/\D/g, "");
// the card companies, each known by how its numbers start, with a small picture of a card in its colours
const cardShape = (fill, stroke = "none") =>
  `<rect x="1.2" y="5" width="21.6" height="14" rx="2" fill="${fill}" stroke="${stroke}" stroke-width=".6"/>`;
const CARD_BRANDS = [
  { name: "Visa", test: /^4/, icon: `${cardShape("#1A1F71")}<text x="12" y="14.6" text-anchor="middle" font-family="Arial, sans-serif" font-size="7.4" font-weight="900" font-style="italic" fill="#fff">VISA</text>` },
  { name: "Mastercard", test: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/, icon: `${cardShape("#111418")}<circle cx="9.6" cy="12" r="4.2" fill="#EB001B"/><circle cx="14.4" cy="12" r="4.2" fill="#F79E1B"/><path d="M12 8.55a4.2 4.2 0 0 1 0 6.9a4.2 4.2 0 0 1 0-6.9z" fill="#FF5F00"/>` },
  { name: "American Express", test: /^3[47]/, icon: `${cardShape("#2E77BC")}<text x="12" y="14.3" text-anchor="middle" font-family="Arial, sans-serif" font-size="6" font-weight="900" fill="#fff">AMEX</text>` },
  { name: "Maestro", test: /^(5[06-8]|6[37])/, icon: `${cardShape("#111418")}<circle cx="9.6" cy="12" r="4.2" fill="#EB001B"/><circle cx="14.4" cy="12" r="4.2" fill="#00A2E5"/><path d="M12 8.55a4.2 4.2 0 0 1 0 6.9a4.2 4.2 0 0 1 0-6.9z" fill="#7375CF"/>` },
];
const brandOf = (number) => CARD_BRANDS.find((b) => b.test.test(number));
// the card kept in this browser from Link (localStorage "lfcLinkCard", e.g. {"brand":"Visa","last4":"0214","exp":
// "09/27"}); nobody else sees it. Signing in through the popup saves one there
let linkCard = (() => {
  try { return JSON.parse(localStorage.getItem("lfcLinkCard")); } catch { return null; }
})();
const last4Of = (card) => String(card.last4).replace(/\D/g, "").slice(-4);

// "Utilizar" opens a popup asking for the Link account's email; closed by the ✕, Esc or a click outside it. A valid
// email (typed, or sent with "Continuar") is looked up and the popup moves on to the code sent to it; a wrong one turns
// the box red. Without Stripe connected there's no Link account to look up yet, so for now the lookup is only shown
const linkModal = document.getElementById("linkModal");
const linkEmail = document.getElementById("linkEmail");
const linkEmailField = linkEmail.closest(".co-field");
const emailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(linkEmail.value.trim());
// The popup has four views: the email box ("form"), the details about Link ("info", from the link logo, which swaps
// back and forth, with a back arrow), "Confirme a sua identidade" ("code") and, once signed in, "Formas de pagamento" ("pay")
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
// back to the email box, ready to type in (also "Não é o titular?" at the bottom of the code view)
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
  LINK_HOST.unuse();
  linkCard = LINK_TEST_CARDS[0] || null;
  try {
    if (linkCard) localStorage.setItem("lfcLinkCard", JSON.stringify(linkCard));
    else localStorage.removeItem("lfcLinkCard");
  } catch {}
  LINK_HOST.refresh();
}
// the three dots open a small menu: "Editar carteira" and "Abrir aplicação" (links to the Link account), and "Sair",
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
// "Sair" asks first, on a page of the popup: "Terminar sessão?", what it does, then "Cancelar" (or the back circle), back to
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
    LINK_HOST.unuse();
    linkCard = null;
    LINK_HOST.refresh();
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
      LINK_HOST.updated(card);
    }
    backToLinkWallet();
  }, 1400);
}
// using a card from Link: it's kept in this browser as the saved Link card, put in the card boxes (ticked, as when
// ticking it there) and the popup closes
function useLinkCard(card) {
  linkCard = card;
  try { localStorage.setItem("lfcLinkCard", JSON.stringify(linkCard)); } catch {}
  LINK_HOST.use(card);
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
  LINK_HOST.focus();
}
linkModal.addEventListener("animationend", (e) => {
  if (e.target !== linkModal || !linkModal.classList.contains("is-closing")) return;
  linkModal.classList.remove("is-closing");
  linkModal.hidden = true;
  lockPageScroll(false);
});
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
