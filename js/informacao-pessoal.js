// Informação Pessoal (informacao-pessoal.html), opened by Editar on the profile's Dados Pessoais. The account's
// details in a form: the member number and full name locked, and the name, birth date, gender and address locked too
// once they're saved (grey, as on Benfica's page); the rest can be changed. Seguinte checks the required fields and
// keeps everything in the session (until there's a server), then goes back to Dados Pessoais

let ipSession = null;
try { ipSession = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
// not signed in: the sign-in page instead
if (!ipSession) location.replace("conta.html");
ipSession = ipSession || {};
const ipData = ipSession.personal || {};

const $ = (id) => document.getElementById(id);
const ipForm = document.querySelector(".ip-form");
const ipFields = {
  member: $("ipMember"), fullname: $("ipFullName"), first: $("ipFirst"), last: $("ipLast"),
  day: $("ipDay"), month: $("ipMonth"), year: $("ipYear"), country: $("ipCountry"), postcode: $("ipPostcode"),
  town: $("ipTown"), address: $("ipAddress"), city: $("ipCity"), email: $("ipEmail"), phoneCode: $("ipPhoneCode"),
  phone: $("ipPhone"), doc: $("ipDoc"), docnumber: $("ipDocNumber"), nifCountry: $("ipNifCountry"), nif: $("ipNif"),
};

// the country lists (countries and the flag picker: paises.js)
COUNTRIES.forEach((c) => {
  ipFields.country.add(new Option(c.label, c.iso));
  ipFields.phoneCode.add(new Option(`${c.label} (+${c.dial})`, c.iso));
  ipFields.nifCountry.add(new Option(c.label, c.iso));
});
makePicker(ipFields.country, ipFields.country.closest(".ac-select"), ipFields.country.closest(".ac-select"), false);
makePicker(ipFields.phoneCode, ipFields.phoneCode.closest(".ac-tel-code"), ipFields.phoneCode.closest(".ac-tel"), true);
makePicker(ipFields.nifCountry, ipFields.nifCountry.closest(".ac-tel-code"), ipFields.nifCountry.closest(".ac-tel"), false);
// a country chosen in code: its flag (and name, in the País box) too
function setCountry(select, iso) {
  if (!COUNTRIES.some((c) => c.iso === iso)) return;
  select.value = iso;
  const box = select.closest(".ac-select, .ac-tel-code");
  box.querySelector(".ac-flag").src = flagUrl(iso);
  const text = box.querySelector(".ac-select-text");
  if (text) text.textContent = COUNTRIES.find((c) => c.iso === iso).name;
}

// filling in: the session's name, e-mail and phone, and the details saved here before
const names = (ipSession.name || "").trim().split(/\s+/).filter(Boolean);
ipFields.member.value = ipSession.socio || "";
ipFields.fullname.value = (ipSession.name || "").toLocaleUpperCase("pt");
ipFields.first.value = ipData.first || names[0] || "";
ipFields.last.value = ipData.last || (names.length > 1 ? names[names.length - 1] : "");
[ipFields.day.value, ipFields.month.value, ipFields.year.value] = (ipData.birth || "").split("/").concat("", "", "");
if (ipData.gender) ipForm.querySelector(`input[name="ip-gender"][value="${ipData.gender}"]`).checked = true;
if (ipData.language) ipForm.querySelector(`input[name="ip-lang"][value="${ipData.language}"]`).checked = true;
setCountry(ipFields.country, ipData.country || "PT");
ipFields.postcode.value = ipData.postcode || "";
ipFields.town.value = ipData.town || "";
ipFields.address.value = ipData.address || "";
ipFields.city.value = ipData.city || "";
ipFields.email.value = ipSession.email || "";
// the phone as saved ("+351960414665"): its country's code and the national number
let phoneIso = "PT";
let phoneNational = ipSession.phone || "";
try {
  const parsed = libphonenumber.parsePhoneNumber(ipSession.phone);
  phoneIso = parsed.country || "PT";
  phoneNational = parsed.nationalNumber;
} catch {}
setCountry(ipFields.phoneCode, phoneIso);
ipFields.phone.value = phoneNational;
if (ipData.doc) ipFields.doc.value = ipData.doc;
ipFields.docnumber.value = ipData.docnumber || "";
setCountry(ipFields.nifCountry, ipData.nifCountry || "PT");
ipFields.nif.value = ipData.nif || "";
if (ipData.physicalCard) ipForm.querySelector(`input[name="ip-card"][value="${ipData.physicalCard}"]`).checked = true;
if (ipData.cardPhoto) ipForm.querySelector(`input[name="ip-photo"][value="${ipData.cardPhoto}"]`).checked = true;

// Cartão de Sócio: Sim opens the card's options (the name printed on it, the first and last names to start, and
// whether it has a photo); a photo on Sim opens the picker. The photo is made small and kept in this browser
const ipCardMore = document.querySelector("[data-ip-card-more]");
const ipPhoto = document.querySelector("[data-ip-photo]");
const ipPhotoImg = ipPhoto.querySelector(".ip-photo-img");
const ipPhotoError = document.querySelector("[data-ip-photo-error]");
const ipCardName = $("ipCardName");
ipCardName.value = ipData.cardName || [ipFields.first.value, ipFields.last.value].filter(Boolean).join(" ");
let ipPhotoSrc = null;
try { ipPhotoSrc = localStorage.getItem("lfcCardPhoto"); } catch {}
function showCardPhoto(src) {
  ipPhotoSrc = src;
  ipPhotoImg.src = src;
  ipPhotoImg.hidden = false;
  ipPhoto.querySelector(".ip-photo-person").style.display = "none";
  ipPhoto.classList.remove("is-missing");
}
if (ipPhotoSrc) showCardPhoto(ipPhotoSrc);
function syncCard() {
  const card = ipForm.querySelector('input[name="ip-card"]:checked')?.value;
  const photo = ipForm.querySelector('input[name="ip-photo"]:checked')?.value;
  ipCardMore.hidden = card !== "sim";
  ipPhoto.hidden = photo !== "sim";
  if (ipPhoto.hidden) ipPhoto.classList.remove("is-missing");
}
syncCard();
ipForm.querySelectorAll('input[name="ip-card"], input[name="ip-photo"]').forEach((r) => r.addEventListener("change", syncCard));
ipPhoto.querySelector('input[type="file"]').addEventListener("change", (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  const problem = !/^image\/(png|jpeg)$/.test(file.type) ? "A fotografia tem de estar em formato .png ou .jpg."
    : file.size > 3 * 1024 * 1024 ? "A fotografia não pode ter mais de 3 MB." : "";
  ipPhoto.classList.toggle("is-invalid", !!problem);
  ipPhotoError.textContent = problem;
  ipPhotoError.hidden = !problem;
  if (problem) return;
  // cut to a square in the middle, 300px, so it fits in the browser's storage
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const size = 300;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const side = Math.min(img.width, img.height);
      // (a see-through .png on white, not the black a .jpg would give it)
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      showCardPhoto(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// what's been confirmed already is locked (grey): the name always, and once saved the birth date, gender and address
const ipLocked = !!ipData.saved;
[ipFields.first, ipFields.last].forEach((f) => { f.disabled = !!f.value; });
if (ipLocked) {
  [ipFields.day, ipFields.month, ipFields.year, ipFields.address, ipFields.town].forEach((f) => { f.disabled = !!f.value; });
  if (ipData.gender) ipForm.querySelectorAll('input[name="ip-gender"]').forEach((r) => { r.disabled = true; });
}

// typing helps: digits only in the date (moving on when a box is full), the postcode as 0000-000 in Portugal, the
// NIF digits only, and the address in capitals as on the card
[ipFields.day, ipFields.month, ipFields.year].forEach((f, i, all) => f.addEventListener("input", () => {
  f.value = f.value.replace(/\D/g, "");
  if (f.value.length === f.maxLength && all[i + 1]) all[i + 1].focus();
}));
ipFields.postcode.addEventListener("input", () => {
  if (ipFields.country.value !== "PT") return;
  const d = ipFields.postcode.value.replace(/\D/g, "").slice(0, 7);
  ipFields.postcode.value = d.length > 4 ? `${d.slice(0, 4)}-${d.slice(4)}` : d;
});
ipFields.nif.addEventListener("input", () => { ipFields.nif.value = ipFields.nif.value.replace(/\D/g, ""); });
ipFields.phone.addEventListener("input", () => { ipFields.phone.value = ipFields.phone.value.replace(/[^\d ()-]/g, ""); });
ipFields.phoneCode.addEventListener("change", () => { ipFields.phone.placeholder = examplePhone(ipFields.phoneCode.value); });

// Seguinte: each required field checked (a wrong one turns its label and box red, with its message under it, until
// it's typed in again); all right, the details are kept and a note says the request went through
function birthOk() {
  const d = Number(ipFields.day.value), m = Number(ipFields.month.value), y = Number(ipFields.year.value);
  const date = new Date(y, m - 1, d);
  return ipFields.year.value.length === 4 && date.getDate() === d && date.getMonth() === m - 1 && date < new Date() && y > 1900;
}
const CHECKS = {
  first: () => ipFields.first.value.trim() !== "",
  last: () => ipFields.last.value.trim() !== "",
  birth: birthOk,
  gender: () => !!ipForm.querySelector('input[name="ip-gender"]:checked'),
  postcode: () => (ipFields.country.value === "PT" ? /^\d{4}-\d{3}$/.test(ipFields.postcode.value) : ipFields.postcode.value.trim() !== ""),
  town: () => ipFields.town.value.trim() !== "",
  address: () => ipFields.address.value.trim() !== "",
  city: () => ipFields.city.value.trim() !== "",
  email: () => ipFields.email.value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(ipFields.email.value),
  phone: () => ipFields.phone.value.replace(/\D/g, "").length === 0 || ipFields.phone.value.replace(/\D/g, "").length >= 6,
  docnumber: () => ipFields.docnumber.value.trim() !== "",
  nif: () => ipFields.nif.value === "" || ipFields.nif.value.length === 9,
  // (only asked when the physical card is on Sim, and the photo when that's on Sim too)
  cardname: () => ipCardMore.hidden || ipCardName.value.trim() !== "",
  photo: () => ipCardMore.hidden || ipPhoto.hidden || !!ipPhotoSrc,
};
// what's wrong, under each field (shown while it's red)
const ERRORS = {
  first: "Indique um nome válido.",
  last: "Indique um apelido válido.",
  birth: "Indique uma data de nascimento válida.",
  gender: "Indique o género.",
  postcode: "Indique um Código Postal válido.",
  town: "Indique uma localidade válida.",
  address: "Indique uma morada válida.",
  city: "Indique uma localidade válida.",
  email: "Indique um e-mail válido.",
  phone: "Indique um número de telemóvel válido.",
  docnumber: "Indique um número de documento válido.",
  nif: "Indique um NIF válido.",
  cardname: "Indique o nome do cartão.",
};
Object.entries(ERRORS).forEach(([name, text]) => {
  const error = document.createElement("p");
  error.className = "ip-field-error";
  error.textContent = text;
  ipForm.querySelector(`[data-field="${name}"]`).append(error);
});
ipForm.addEventListener("input", (e) => {
  e.target.closest(".ac-field")?.classList.remove("is-invalid");
});
ipForm.addEventListener("change", (e) => {
  e.target.closest(".ac-field")?.classList.remove("is-invalid");
});
ipForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let firstWrong = null;
  Object.entries(CHECKS).forEach(([name, ok]) => {
    const field = ipForm.querySelector(`[data-field="${name}"]`);
    const wrong = !ok();
    field.classList.toggle("is-invalid", wrong);
    if (wrong && !firstWrong) firstWrong = field;
  });
  // no photo picked: the circle in red, and the message at the card box's bottom right
  ipPhoto.classList.toggle("is-missing", !CHECKS.photo());
  if (firstWrong) {
    firstWrong.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  const value = (name) => ipForm.querySelector(`input[name="${name}"]:checked`)?.value || "";
  const first = ipFields.first.value.trim();
  const last = ipFields.last.value.trim();
  ipSession.personal = {
    saved: true, first, last,
    birth: `${ipFields.day.value.padStart(2, "0")}/${ipFields.month.value.padStart(2, "0")}/${ipFields.year.value}`,
    gender: value("ip-gender"), language: value("ip-lang"), country: ipFields.country.value,
    postcode: ipFields.postcode.value.trim(), town: ipFields.town.value.trim(),
    address: ipFields.address.value.trim().toLocaleUpperCase("pt"), city: ipFields.city.value.trim().toLocaleUpperCase("pt"),
    doc: ipFields.doc.value, docnumber: ipFields.docnumber.value.trim(), nifCountry: ipFields.nifCountry.value,
    nif: ipFields.nif.value, physicalCard: value("ip-card"),
    cardName: ipCardName.value.trim().toLocaleUpperCase("pt"), cardPhoto: value("ip-photo"),
  };
  try {
    if (value("ip-card") === "sim" && value("ip-photo") === "sim") localStorage.setItem("lfcCardPhoto", ipPhotoSrc);
  } catch {}
  // the full name stays as it was (it's locked); the e-mail and phone are the account's own
  ipSession.email = ipFields.email.value.trim();
  const dial = COUNTRIES.find((c) => c.iso === ipFields.phoneCode.value)?.dial || "351";
  const digits = ipFields.phone.value.replace(/\D/g, "");
  ipSession.phone = digits ? `+${dial}${digits}` : "";
  try { localStorage.setItem("lfcSession", JSON.stringify(ipSession)); } catch {}
  // the form gives way to the note that it went through
  document.querySelector(".ip-layout").hidden = true;
  document.querySelector("[data-ip-done]").hidden = false;
  window.scrollTo({ top: 0, behavior: "instant" });
});
