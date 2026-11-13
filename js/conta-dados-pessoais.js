// Conta Lisbon FC, creating an account, step 2 (conta-dados-pessoais.html): name, birth date, gender, country, e-mail and
// mobile, plus the consent tick; "Seguinte" stays grey until every required field is filled, then each one is checked

const form = document.querySelector(".ac-dp-form");
const nextBtn = form.querySelector(".ac-btn");
const firstName = document.getElementById("acFirstName");
const lastName = document.getElementById("acLastName");
const day = document.getElementById("acBirthDay");
const month = document.getElementById("acBirthMonth");
const year = document.getElementById("acBirthYear");
const country = document.getElementById("acCountry");
const email = document.getElementById("acEmail");
const phoneCode = document.getElementById("acPhoneCode");
const phone = document.getElementById("acPhone");
const agree = document.getElementById("acAgree");

// the country lists for the País box and the phone's code (countries and the picker: paises.js)
COUNTRIES.forEach((c) => {
  country.add(new Option(c.label, c.iso));
  phoneCode.add(new Option(`${c.label} (+${c.dial})`, c.iso));
});
country.value = "PT";
phoneCode.value = "PT";

makePicker(country, country.closest(".ac-select"), country.closest(".ac-select"), false);
makePicker(phoneCode, phoneCode.closest(".ac-tel-code"), phoneCode.closest(".ac-tel"), true);
phoneCode.addEventListener("change", () => {
  // the example number of the chosen country, written the way it's dialled there (e.g. Afghanistan: 070 123 4567)
  phone.placeholder = examplePhone(phoneCode.value);
  // a number already typed is checked again against the new country
  if (phoneTouched) showInvalid("phone", !isPhone());
  check();
});

// the e-mail/phone used on the code step comes in locked (grey); the other one is filled in here
let regId = "";
try { regId = sessionStorage.getItem("acRegId") || ""; } catch {}
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
if (isEmail(regId)) {
  email.value = regId;
  email.disabled = true;
  form.querySelector('label[for="acEmail"]').classList.add("ac-label--locked");
} else if (regId) {
  phone.value = regId.replace(/^\+?351\s*/, "");
  phone.disabled = true;
  phoneCode.disabled = true;
  phoneCode.closest(".ac-tel-code").querySelector(".ac-flag-btn").disabled = true;
  form.querySelector('label[for="acPhone"]').classList.add("ac-label--locked");
}

// the names get a capital at the start of each word as they're typed (Maria João, Silva-Santos); the rest is left as typed
[firstName, lastName].forEach((box) => {
  box.addEventListener("input", () => {
    const v = box.value.replace(/(^|[\s'-])(\p{Ll})/gu, (m, before, letter) => before + letter.toLocaleUpperCase("pt"));
    if (v !== box.value) {
      const at = box.selectionStart;
      box.value = v;
      box.setSelectionRange(at, at);
    }
  });
});

// the date boxes take digits only and move on to the next box once full; a day, month or year that can't exist turns
// its box red with a message under that box (checked as it's typed, and when leaving a box)
const birthField = form.querySelector('[data-field="birth"]');
const birthError = birthField.querySelector(":scope > .ac-error");
const DATE_PARTS = [
  { box: day, message: "Insira um dia válido", wrong: (n) => n < 1 || n > 31 },
  { box: month, message: "Insira um mês válido", wrong: (n) => n < 1 || n > 12 },
  { box: year, message: "Insira um ano válido", wrong: (n) => n < 1900 || n > new Date().getFullYear() },
];
function checkDateParts(leaving) {
  let allOk = true;
  DATE_PARTS.forEach(({ box, message, wrong }) => {
    const v = box.value;
    // judged once the box is full (or being left); a day or month already over its limit is wrong straight away
    const done = v.length === box.maxLength || ((leaving === box || leaving === true) && v !== "");
    // (a box typed in and then emptied is wrong too)
    const bad = v === "" ? box.dataset.touched === "true" :
      done ? wrong(+v) : box !== year && +v > (box === day ? 31 : 12);
    box.classList.toggle("is-invalid", bad);
    // the message sits under that box, on its right
    const error = box.nextElementSibling;
    error.textContent = bad ? message : "";
    error.hidden = !bad;
    if (bad) allOk = false;
  });
  birthField.classList.remove("is-invalid");
  birthError.hidden = true;
  return allOk;
}
[day, month, year].forEach((box, i, boxes) => {
  box.addEventListener("input", () => {
    box.value = box.value.replace(/\D/g, "");
    box.dataset.touched = "true";
    const ok = checkDateParts();
    if (ok && box.value.length === box.maxLength && boxes[i + 1]) boxes[i + 1].focus();
  });
  box.addEventListener("blur", () => checkDateParts(box));
  // backspace in an empty box goes back to the previous one
  box.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && box.value === "" && boxes[i - 1]) boxes[i - 1].focus();
  });
});
// the phone takes digits (and the spaces, brackets and dashes numbers are written with)
phone.addEventListener("input", () => { phone.value = phone.value.replace(/[^\d\s()-]/g, ""); });
// more digits than the chosen country's numbers have (14 if the phone-number library didn't load)
function tooLong() {
  const digits = phone.value.replace(/\D/g, "");
  if (!window.libphonenumber) return digits.length > 14;
  try { return libphonenumber.validatePhoneNumberLength(digits, phoneCode.value) === "TOO_LONG"; } catch { return false; }
}

// each check returns true when that field is right
const isName = (v) => /^[\p{L}][\p{L}' .-]*$/u.test(v.trim());
function isBirthDate() {
  const d = +day.value, m = +month.value, y = +year.value;
  if (year.value.length !== 4 || !d || !m) return false;
  const date = new Date(y, m - 1, d);
  const today = new Date();
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d && y >= 1900 && date <= today;
}
// Portugal: 9 digits starting with 9; elsewhere the length that country's numbers have (libphonenumber), or 6 to 14 digits
// if that didn't load
function isPhone() {
  const digits = phone.value.replace(/[\s()-]/g, "");
  if (phoneCode.value === "PT") return /^9\d{8}$/.test(digits);
  if (window.libphonenumber) {
    try { return libphonenumber.isValidPhoneNumber(digits, phoneCode.value); } catch { return false; }
  }
  return /^\d{6,14}$/.test(digits);
}
const CHECKS = {
  first: () => isName(firstName.value),
  last: () => isName(lastName.value),
  birth: isBirthDate,
  email: () => email.disabled || isEmail(email.value.trim()),
  phone: () => phone.disabled || isPhone(),
};

// "Seguinte" stays grey until every required box has something in it, a gender is chosen and the consent is ticked
const required = [firstName, lastName, day, month, year, email, phone];
function check() {
  nextBtn.disabled = !agree.checked || !form.querySelector('input[name="gender"]:checked') ||
    required.some((input) => input.value.trim() === "");
}

// a wrong field: its label and box turn red with the message under it; typing in it again clears it
function showInvalid(name, on) {
  // (a day, month or year that can't exist keeps its own box red and message instead)
  if (name === "birth" && !checkDateParts(true)) return;
  const field = form.querySelector(`[data-field="${name}"]`);
  field.classList.toggle("is-invalid", on);
  const error = field.querySelector(":scope > .ac-error");
  error.hidden = !on;
  // a date whose parts are each fine but don't make a real day (e.g. 31/02, or in the future)
  if (name === "birth" && on) error.textContent = "Data de nascimento inválida.";
}
Object.keys(CHECKS).forEach((name) => {
  // (the date boxes and the phone clear and set their own red)
  if (name !== "birth" && name !== "phone") form.querySelector(`[data-field="${name}"]`).addEventListener("input", () => showInvalid(name, false));
});
form.addEventListener("input", check);
agree.addEventListener("change", check);

// the phone: "Número de telemóvel inválido" as soon as it has more digits than the country's numbers, when digits are
// deleted and what's left isn't a right number (or nothing is left), and when it's left with a wrong number; the box
// itself only turns red once it's left (while typing it stays black)
let phoneTouched = false;
let phoneDigits = 0;
phone.addEventListener("input", () => {
  phoneTouched = true;
  const digits = phone.value.replace(/\D/g, "").length;
  const deleting = digits < phoneDigits;
  phoneDigits = digits;
  showInvalid("phone", phone.value.trim() === "" || tooLong() || (deleting && !isPhone()));
});
phone.addEventListener("blur", () => {
  if (phoneTouched && !phone.disabled) showInvalid("phone", !isPhone());
});
check();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (nextBtn.disabled) return;
  const wrong = Object.keys(CHECKS).filter((name) => !CHECKS[name]());
  Object.keys(CHECKS).forEach((name) => showInvalid(name, wrong.includes(name)));
  if (wrong.length) {
    form.querySelector(`[data-field="${wrong[0]}"] .ac-input:not(:disabled)`)?.focus();
    return;
  }
  // next, a code to the contact not checked yet: the phone (as +351 923525245), or the e-mail if the account was
  // started with a phone (kept for the tab only, never in the address)
  const dial = COUNTRIES.find((c) => c.iso === phoneCode.value).dial;
  const confirm = phone.disabled
    ? { by: "email", to: email.value.trim() }
    : { by: "phone", to: `+${dial} ${phone.value.replace(/\D/g, "")}` };
  const name = `${firstName.value.trim()} ${lastName.value.trim()}`;
  // (the e-mail and phone also go on to the account, for its Dados Pessoais)
  const contacts = { email: email.value.trim(), phone: `+${dial}${phone.value.replace(/\D/g, "")}` };
  try { sessionStorage.setItem("acRegConfirm", JSON.stringify({ ...confirm, name, ...contacts })); } catch {}
  showLoader();
  setTimeout(() => { location.href = "conta-confirmar.html"; }, 1600);
});

// coming back with the browser's back button: start clean, not on the loader
window.addEventListener("pageshow", (e) => {
  if (e.persisted) location.reload();
});
