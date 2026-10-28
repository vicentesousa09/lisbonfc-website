// Checkout, step 1 "Envio" (checkout.html). The cart, header count and order summary come from checkout-summary.js
// Delivery estimate: two days from today, e.g. "28 de outubro"
const eta = new Date();
eta.setDate(eta.getDate() + 2);
const etaText = eta.toLocaleDateString("pt-PT", { day: "numeric", month: "long" });
document.querySelectorAll("[data-co-eta]").forEach((el) => { el.textContent = etaText; });

// País: typed freely, with a dropdown. Selecting the box lists every country, the chosen one first and then the rest
// in country-code order (Ilha de Ascensão, Andorra, Emirados Árabes Unidos, Afeganistão…); typing narrows it to the
// countries that match (accents and case ignored; names starting with it first). Click or Enter picks one, the arrow
// keys move through the list, Escape closes it.
// The Portuguese names come from the browser (Intl.DisplayNames), for every two-letter country code it knows; left out
// are groupings that aren't countries and old codes that just repeat a current country under another name
const NOT_COUNTRIES = ["EU", "EZ", "UN", "QO", "XA", "XB", "ZZ", "AN", "BU", "CS", "DD", "FX", "SU", "TP", "YD", "YU", "ZR", "UK"];
const COUNTRIES = (() => {
  const names = [];
  let display;
  try { display = new Intl.DisplayNames(["pt-PT"], { type: "region" }); } catch { return ["Portugal"]; }
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b);
      if (NOT_COUNTRIES.includes(code)) continue;
      let name;
      try { name = display.of(code); } catch { continue; }
      if (name && name !== code && !names.includes(name)) names.push(name);
    }
  }
  return names;
})();
const plain = (text) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const coPais = document.getElementById("coPais");
const coPaisList = document.getElementById("coPaisList");
let paisActive = -1;
// just selected (nothing typed yet): the whole list, with the country already in the box on top
function allCountries() {
  const chosen = COUNTRIES.find((c) => plain(c) === plain(coPais.value));
  return chosen ? [chosen, ...COUNTRIES.filter((c) => c !== chosen)] : COUNTRIES;
}
function paisMatches() {
  const typed = plain(coPais.value);
  if (!typed) return COUNTRIES;
  const starts = COUNTRIES.filter((c) => plain(c).startsWith(typed));
  const contains = COUNTRIES.filter((c) => !starts.includes(c) && plain(c).includes(typed));
  return [...starts, ...contains];
}
function showPaisList(all = false) {
  const found = all ? allCountries() : paisMatches();
  paisActive = -1;
  coPaisList.replaceChildren(...found.map((name) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.textContent = name;
    // mousedown (not click) so it lands before the field loses focus and closes the list
    li.addEventListener("mousedown", (e) => {
      e.preventDefault();
      pickPais(name);
    });
    return li;
  }));
  coPaisList.hidden = found.length === 0;
  coPais.setAttribute("aria-expanded", String(!coPaisList.hidden));
  coPaisList.scrollTop = 0;
  placePaisDot();
}
function hidePaisList() {
  coPaisList.hidden = true;
  coPais.setAttribute("aria-expanded", "false");
  placePaisDot();
}
// the grey dot standing in for the scrollbar: it travels from the top to the bottom of the open list as it scrolls,
// and only shows when there's more to scroll to
const coPaisDot = document.getElementById("coPaisDot");
function placePaisDot() {
  const room = coPaisList.scrollHeight - coPaisList.clientHeight;
  coPaisDot.hidden = coPaisList.hidden || room <= 0;
  if (coPaisDot.hidden) return;
  const top = coPaisList.offsetTop + 6;
  const travel = coPaisList.clientHeight - 12 - coPaisDot.offsetHeight;
  coPaisDot.style.top = `${top + travel * (coPaisList.scrollTop / room)}px`;
}
coPaisList.addEventListener("scroll", placePaisDot);
function pickPais(name) {
  coPais.value = name;
  hidePaisList();
  updatePay();
}
function movePais(step) {
  const options = [...coPaisList.children];
  if (!options.length) return;
  paisActive = (paisActive + step + options.length) % options.length;
  options.forEach((li, i) => li.classList.toggle("is-active", i === paisActive));
  options[paisActive].scrollIntoView({ block: "nearest" });
}
// focusing the field selects what's there, so typing straight away replaces it
coPais.addEventListener("focus", () => {
  coPais.select();
  showPaisList(true);
});
coPais.addEventListener("input", () => showPaisList());
coPais.addEventListener("blur", hidePaisList);
coPais.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (coPaisList.hidden) showPaisList();
    movePais(e.key === "ArrowDown" ? 1 : -1);
  } else if (e.key === "Enter" && !coPaisList.hidden) {
    e.preventDefault();
    const options = [...coPaisList.children];
    const choice = options[paisActive] || options[0];
    if (choice) pickPais(choice.textContent);
  } else if (e.key === "Escape") {
    hidePaisList();
  }
});

// "Inicia sessão" banner can be closed
document.getElementById("coLoginClose").addEventListener("click", () => {
  document.getElementById("coLogin").hidden = true;
});

// Picking a delivery type shows what it needs: an address for DHL and DPD, a pickup point for Pickup Point
const coMorada = document.getElementById("coMorada");
const coPickup = document.getElementById("coPickup");
const coBillingFields = document.getElementById("coBillingFields");
document.querySelectorAll('input[name="coShipping"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    coMorada.hidden = radio.value === "pickup";
    coPickup.hidden = radio.value !== "pickup";
    updatePay();
  });
});
// Pickup Point: ticking "Pickup Points" opens the list of collection points
const coPickupType = document.getElementById("coPickupType");
coPickupType.addEventListener("change", () => {
  document.getElementById("coPickupPointField").hidden = !coPickupType.checked;
  updatePay();
});
document.getElementById("coBilling").addEventListener("change", (e) => {
  coBillingFields.hidden = !e.target.checked;
  updatePay();
});

// Postcode boxes: digits only, and the cursor jumps to the second box once the first 4 are typed
document.querySelectorAll(".co-cp").forEach((cp) => {
  const [first, second] = cp.querySelectorAll("input");
  [first, second].forEach((input) => input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
  }));
  first.addEventListener("input", () => {
    if (first.value.length === 4) second.focus();
  });
});

// "Pagamento" stays grey and off until everything required is filled in and the terms are accepted
const coForm = document.getElementById("coForm");
const coPay = document.getElementById("coPay");
function isFilled(input) {
  const value = input.value.trim();
  return input.dataset.length ? value.length === Number(input.dataset.length) : value !== "";
}
// a required box is wrong when it's empty (or, for the postcode, short), the e-mail doesn't look like one, or the phone
// has fewer digits than the chosen country's numbers (phone-codes.js keeps that count in data-digits; Portugal: 9)
const telComplete = (input) => input.value.replace(/\D/g, "").length >= Number(input.dataset.digits || 9);
function isValid(input) {
  if (!isFilled(input)) return false;
  if (input.id === "coEmail") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  if (input.id === "coTel") return telComplete(input);
  return true;
}

// Leaving a required box without filling it in turns it and its title red (.is-invalid in style.css); it goes back
// to normal as soon as it's filled in. Boxes are only judged once they've been left, never before they're touched
function checkField(field) {
  const touched = [...field.querySelectorAll("[data-required]")].filter((el) => el.dataset.touched);
  field.classList.toggle("is-invalid", touched.some((el) => !isValid(el)));
}
coForm.querySelectorAll("[data-required]").forEach((input) => {
  const field = input.closest(".co-field");
  input.addEventListener("blur", () => {
    input.dataset.touched = "true";
    checkField(field);
  });
  const recheck = () => {
    if (field.classList.contains("is-invalid")) checkField(field);
  };
  input.addEventListener("input", recheck);
  input.addEventListener("change", recheck);
});

function formReady() {
  const shipping = coForm.querySelector('input[name="coShipping"]:checked');
  if (!shipping) return false;
  if (shipping.value === "pickup" && !coPickupType.checked) return false;
  // required fields only count in the parts that are showing
  const required = [...coForm.querySelectorAll("[data-required]")].filter((el) => !el.closest("[hidden]"));
  if (!required.every(isFilled)) return false;
  const email = document.getElementById("coEmail").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
  if (!telComplete(document.getElementById("coTel"))) return false;
  return document.getElementById("coTerms").checked && items.length > 0;
}
function updatePay() {
  coPay.disabled = !formReady();
}
coForm.addEventListener("input", updatePay);
coForm.addEventListener("change", updatePay);
// with everything filled in, "Pagamento" moves on to step 2 (pagamento.html); the details aren't sent anywhere yet
coForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (formReady()) window.location.href = "pagamento.html";
});
updatePay();
