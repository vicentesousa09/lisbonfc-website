// Adesão (becoming a member), step 1 "Dados Pessoais" (adesao-dados-pessoais.html), opened by Aderir on the profile
// (an account that isn't a member yet). As Benfica's: the photo, full name and birth date; the postcode, its town and
// the country; the address (picked from the account's, or typed) and its town; the e-mail and phone; the NIF and gender;
// the identity document's type and number; the consent box. The account's details fill it in to start (the header's
// script sends someone signed out to the sign-in page). Continuar checks everything (a wrong box and its asterisk red,
// until it's changed), keeps the details and goes on to step 2, Família (adesao-familia.html)

let adAccount = null;
try { adAccount = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
adAccount = adAccount || {};
const adData = adAccount.personal || {};
let adKept = null;
try { adKept = JSON.parse(sessionStorage.getItem("lfcAdesao")); } catch {}

const $ = (id) => document.getElementById(id);
const ad = {
  name: $("adName"), day: $("adDay"), month: $("adMonth"), year: $("adYear"),
  postcode1: $("adPostcode1"), postcode2: $("adPostcode2"), city: $("adCity"), country: $("adCountry"),
  addressPick: $("adAddressPick"), address: $("adAddress"), door: $("adDoor"), town: $("adTown"),
  email: $("adEmail"), phoneCode: $("adPhoneCode"), phone: $("adPhone"), nif: $("adNif"),
  docType: $("adDocType"), doc: $("adDoc"), consent: $("adConsent"),
};
const adForm = document.querySelector(".ad-form");
const adGender = () => adForm.querySelector('input[name="adGender"]:checked')?.value || "";

// The dropdowns (the month, the country, the address and the document's type): the box opens its list under it (a
// click on an option chooses it, as do the arrows and Enter; Esc or a click outside closes it; on the country's, typing
// a letter jumps to the countries starting with it). The hidden select keeps the value; show(li) puts the choice in the box
const adDrops = [];
function adDropdown(box, select, show) {
  const btn = box.querySelector(".ddp-period-btn");
  const list = box.querySelector(".ddp-period-list");
  const items = () => [...list.children].filter((li) => li.dataset.value !== undefined);
  let active = -1;
  const mark = (i) => {
    active = i;
    items().forEach((li, j) => li.classList.toggle("is-active", j === i));
    if (i >= 0) list.scrollTop = Math.max(0, Math.min(list.scrollTop, items()[i].offsetTop), items()[i].offsetTop + items()[i].offsetHeight - list.clientHeight);
  };
  const open = (on) => {
    if (on) adDrops.forEach((d) => d !== drop && d.open(false));
    list.hidden = !on;
    btn.setAttribute("aria-expanded", String(on));
    const at = items().findIndex((li) => li.dataset.value === select.value);
    if (on && at >= 0) list.scrollTop = items()[at].offsetTop - 4;
    mark(-1);
  };
  const choose = (li) => {
    select.value = li.dataset.value;
    show(li);
    btn.classList.add("is-chosen");
    items().forEach((x) => x.setAttribute("aria-selected", String(x === li)));
    select.dispatchEvent(new Event("change", { bubbles: true }));
    open(false);
    btn.focus();
  };
  btn.addEventListener("click", () => open(list.hidden));
  list.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li && li.dataset.value !== undefined) choose(li); });
  btn.addEventListener("keydown", (e) => {
    if (/^[a-z]$/i.test(e.key) && box.classList.contains("ddp-country")) {
      if (list.hidden) open(true);
      const at = items().findIndex((li) => li.dataset.value.startsWith(e.key.toUpperCase()));
      if (at >= 0) { mark(at); list.scrollTop = items()[at].offsetTop; }
      return;
    }
    if (list.hidden) {
      if (e.key === "ArrowDown") { e.preventDefault(); open(true); }
      return;
    }
    if (e.key === "ArrowDown" && active < 0) mark(Math.max(0, items().findIndex((li) => li.dataset.value === select.value)));
    else if (e.key === "ArrowDown") mark(Math.min(active + 1, items().length - 1));
    else if (e.key === "ArrowUp") mark(Math.max(active - 1, 0));
    else if (e.key === "Enter" && active >= 0) choose(items()[active]);
    else if (e.key === "Escape" || e.key === "Tab") { open(false); return; }
    else return;
    e.preventDefault();
  });
  // (filling in from the account: the choice shown without opening the list)
  const set = (value) => {
    const li = items().find((x) => x.dataset.value === String(value));
    if (!li) return;
    select.value = li.dataset.value;
    show(li);
    btn.classList.add("is-chosen");
  };
  const drop = { box, open, set };
  adDrops.push(drop);
  return drop;
}
document.addEventListener("click", (e) => adDrops.forEach((d) => { if (!d.box.contains(e.target)) d.open(false); }));

const adMonthDrop = adDropdown(document.querySelector(".ad-month"), ad.month, (li) => {
  document.querySelector("[data-ad-month-text]").textContent = li.textContent;
});
const adDocTypeDrop = adDropdown(document.querySelector('[data-field="doctype"]'), ad.docType, (li) => {
  document.querySelector("[data-ad-doctype-text]").textContent = li.textContent;
});

// the countries (paises.js): the phone's list (the flag picker, the code shown after the flag) and the country's, by its
// two letters with its flag beside, Portugal first
COUNTRIES.forEach((c) => {
  ad.phoneCode.add(new Option(`${c.label} (+${c.dial})`, c.iso));
  ad.country.add(new Option(c.iso, c.iso));
});
makePicker(ad.phoneCode, ad.phoneCode.closest(".ac-tel-code"), ad.phoneCode.closest(".ac-tel"), true, true);
const adDial = () => COUNTRIES.find((c) => c.iso === ad.phoneCode.value)?.dial || "351";
function adSetPhoneCountry(iso) {
  if (!COUNTRIES.some((c) => c.iso === iso)) iso = "PT";
  ad.phoneCode.value = iso;
  ad.phoneCode.closest(".ac-tel-code").querySelector(".ac-flag").src = flagUrl(iso);
  document.querySelector("[data-ad-dial]").textContent = `+${adDial()}`;
}
ad.phoneCode.addEventListener("change", () => {
  document.querySelector("[data-ad-dial]").textContent = `+${adDial()}`;
  ad.phone.dispatchEvent(new Event("input"));
});
const adCountryList = document.querySelector(".ddp-country-list");
adCountryList.replaceChildren(...[...ad.country.options].sort((x, y) => (x.value === "PT" ? -1 : y.value === "PT" ? 1 : x.value.localeCompare(y.value))).map((o) => {
  const li = document.createElement("li");
  li.setAttribute("role", "option");
  li.dataset.value = o.value;
  li.innerHTML = `<span>${o.value}</span><img src="${flagUrl(o.value)}" alt="" loading="lazy">`;
  return li;
}));
const adFlag = document.querySelector("[data-ad-flag]");
const adCountryDrop = adDropdown(document.querySelector('[data-field="country"]'), ad.country, (li) => {
  document.querySelector("[data-ad-country-text]").textContent = li.dataset.value;
  adFlag.src = flagUrl(li.dataset.value);
});

// the address's list: the account's own address and those saved in "Gestão de moradas", each as its street, postcode
// and town; picking one also fills in the address's town (none saved: a grey line saying so)
const adUp = (s) => (s || "").trim().toLocaleUpperCase("pt");
const adAddresses = [];
if (adData.address) adAddresses.push({ address: adData.address, postcode: adData.postcode, town: adData.town || adData.city });
(adAccount.addresses || []).forEach((a) => {
  if (a.address && !adAddresses.some((x) => adUp(x.address) === adUp(a.address))) adAddresses.push({ address: a.address, postcode: a.postcode, town: a.city || a.town });
});
const adAddressList = document.querySelector("[data-ad-address-list]");
if (adAddresses.length) {
  adAddresses.forEach((a, i) => {
    ad.addressPick.add(new Option(adUp(a.address), String(i)));
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.dataset.value = String(i);
    li.textContent = [adUp(a.address), a.postcode, adUp(a.town)].filter(Boolean).join(", ");
    adAddressList.append(li);
  });
} else {
  adAddressList.innerHTML = '<li class="ad-empty" aria-disabled="true">Sem moradas guardadas</li>';
}
adDropdown(document.querySelector('[data-field="address"]'), ad.addressPick, (li) => {
  const a = adAddresses[Number(li.dataset.value)];
  document.querySelector("[data-ad-address-text]").textContent = adUp(a.address);
  if (a.town && !ad.town.value.trim()) { ad.town.value = adUp(a.town); }
});

// "Não encontro a minha morada": the list and the link make way for the address typed in, with the door and floor
// beside the address's town
let adTyped = false;
document.querySelector("[data-ad-notfound]").addEventListener("click", () => {
  adTyped = true;
  document.querySelector("[data-ad-pick]").hidden = true;
  document.querySelector("[data-ad-typed]").hidden = false;
  document.querySelector("[data-ad-door]").hidden = false;
  document.querySelector("[data-ad-town-row]").classList.add("is-typed");
  ad.address.focus();
});

// typing helps: the day, year, postcode, NIF and phone digits only (the phone in threes for Portugal; on to the
// postcode's second box when the first is full); the postcode's town follows the account's while the postcode is its
const adDigits = (input, max) => input.addEventListener("input", () => { input.value = input.value.replace(/\D/g, "").slice(0, max); });
adDigits(ad.day, 2);
adDigits(ad.year, 4);
adDigits(ad.nif, 9);
adDigits(ad.postcode2, 3);
ad.postcode1.addEventListener("input", () => {
  ad.postcode1.value = ad.postcode1.value.replace(/\D/g, "").slice(0, 4);
  if (ad.postcode1.value.length === 4) ad.postcode2.focus();
});
const adFillCity = () => {
  const pc = `${ad.postcode1.value}-${ad.postcode2.value}`;
  const known = adAddresses.find((a) => a.postcode === pc);
  ad.city.value = known ? adUp(known.town) : (pc === adData.postcode ? adUp(adData.city || adData.town) : "");
};
[ad.postcode1, ad.postcode2].forEach((i) => i.addEventListener("input", adFillCity));
ad.phone.addEventListener("input", () => {
  const pt = ad.phoneCode.value === "PT";
  const d = ad.phone.value.replace(/\D/g, "").slice(0, pt ? 9 : 15);
  ad.phone.value = pt ? d.replace(/(\d{3})(?=\d)/g, "$1 ") : d;
});

// filling in from the account (or what was typed here before, coming back from the next step)
const adStart = adKept || {};
ad.name.value = adStart.name ?? (adAccount.name || "");
const [bd, bm, by] = (adStart.birth || adData.birth || "").split("/");
ad.day.value = bd ? String(Number(bd)) : "";
ad.year.value = by || "";
if (bm) adMonthDrop.set(Number(bm));
[ad.postcode1.value, ad.postcode2.value] = (adStart.postcode || adData.postcode || "").split("-").concat("", "");
adCountryDrop.set(COUNTRIES.some((c) => c.iso === (adStart.country || adData.country)) ? (adStart.country || adData.country) : "PT");
adFillCity();
ad.town.value = adUp(adStart.town || adData.town || adData.city);
ad.email.value = adStart.email ?? (adAccount.email || "");
let adPhoneDigits = (adStart.phone || adAccount.phone || "").replace(/\D/g, "");
const adPhoneCountry = COUNTRIES.filter((c) => adPhoneDigits.startsWith(c.dial)).sort((x, y) => y.dial.length - x.dial.length)[0];
adSetPhoneCountry(adPhoneCountry ? (adPhoneCountry.dial !== "351" ? adPhoneCountry.iso : "PT") : "PT");
if (adPhoneCountry) adPhoneDigits = adPhoneDigits.slice(adPhoneCountry.dial.length);
ad.phone.value = adPhoneDigits;
ad.phone.dispatchEvent(new Event("input"));
ad.nif.value = adStart.nif ?? (adData.nif || "");
if (adStart.gender) adForm.querySelector(`input[name="adGender"][value="${adStart.gender}"]`).checked = true;
if (adStart.docType) adDocTypeDrop.set(adStart.docType);
ad.doc.value = adStart.doc ?? (adData.docnumber || "");

// the photo: the camera (or the circle) picks one, made small (240px) and shown in the circle; it becomes the
// account's photo too, as on the profile
const adPhotoImg = document.querySelector("[data-ad-photo]");
const adShowPhoto = (src) => { adPhotoImg.src = src; adPhotoImg.hidden = false; };
try { const saved = localStorage.getItem("lfcAvatar"); if (saved) adShowPhoto(saved); } catch {}
const adPhotoInput = document.querySelector(".ad-photo-camera input");
document.querySelector(".ad-photo-inner").addEventListener("click", () => adPhotoInput.click());
adPhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const size = 240;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const side = Math.min(img.width, img.height);
      canvas.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      // (a .jpg stays a .jpg; any other picture is kept as a .png, so its see-through parts stay see-through and the
      // circle's own background shows behind them, not black)
      const src = file.type === "image/jpeg" ? canvas.toDataURL("image/jpeg", 0.85) : canvas.toDataURL("image/png");
      adShowPhoto(src);
      try { localStorage.setItem("lfcAvatar", src); } catch {}
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// the checks: a real date (and someone already born), a full Portuguese postcode (or any, abroad), an address picked
// or typed, a valid e-mail, phone and NIF (9 digits), the gender, the document and the consent
const adChecks = {
  name: () => ad.name.value.trim().split(/\s+/).length >= 2,
  birth: () => {
    const d = Number(ad.day.value), m = Number(ad.month.value), y = Number(ad.year.value);
    const date = new Date(y, m - 1, d);
    return y >= 1900 && date.getMonth() === m - 1 && date.getDate() === d && date <= new Date();
  },
  postcode: () => (ad.country.value === "PT" ? /^\d{4}$/.test(ad.postcode1.value) && /^\d{3}$/.test(ad.postcode2.value) : (ad.postcode1.value + ad.postcode2.value).trim() !== ""),
  country: () => ad.country.value !== "",
  address: () => adTyped || ad.addressPick.value !== "",
  "address-typed": () => !adTyped || ad.address.value.trim() !== "",
  town: () => ad.town.value.trim() !== "",
  email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ad.email.value.trim()),
  phone: () => (ad.phoneCode.value === "PT" ? /^9\d{8}$/ : /^\d{4,15}$/).test(ad.phone.value.replace(/\D/g, "")),
  nif: () => /^\d{9}$/.test(ad.nif.value),
  gender: () => adGender() !== "",
  doctype: () => ad.docType.value !== "",
  doc: () => ad.doc.value.trim() !== "",
  consent: () => ad.consent.checked,
};
adForm.addEventListener("input", (e) => e.target.closest("[data-field]")?.classList.remove("is-invalid"));
adForm.addEventListener("change", (e) => e.target.closest("[data-field]")?.classList.remove("is-invalid"));
adForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const wrong = Object.keys(adChecks).filter((k) => !adChecks[k]());
  Object.keys(adChecks).forEach((k) => adForm.querySelector(`[data-field="${k}"]`).classList.toggle("is-invalid", wrong.includes(k)));
  if (wrong.length) {
    const first = adForm.querySelector(`[data-field="${wrong[0]}"]`);
    first.scrollIntoView({ block: "center", behavior: "smooth" });
    first.querySelector("input:not([type=radio]):not([type=checkbox]), button")?.focus({ preventScroll: true });
    return;
  }
  // kept for the next steps (Família, Quotas, Confirmação)
  const picked = adAddresses[Number(ad.addressPick.value)];
  const details = {
    name: ad.name.value.trim(),
    birth: `${ad.day.value.padStart(2, "0")}/${ad.month.value.padStart(2, "0")}/${ad.year.value}`,
    postcode: `${ad.postcode1.value}-${ad.postcode2.value}`, country: ad.country.value,
    address: adTyped ? `${ad.address.value.trim()} ${ad.door.value.trim()}`.trim() : picked.address,
    town: ad.town.value.trim(), email: ad.email.value.trim(), phone: `+${adDial()}${ad.phone.value.replace(/\D/g, "")}`,
    nif: ad.nif.value, gender: adGender(), docType: ad.docType.value, doc: ad.doc.value.trim(),
  };
  try { sessionStorage.setItem("lfcAdesao", JSON.stringify(details)); } catch {}
  // on to step 2, Família
  location.href = "adesao-familia.html";
});

// (the labels of the boxes filled in from the account start up on their outline, without moving there)
requestAnimationFrame(() => requestAnimationFrame(() => adForm.classList.remove("is-loading")));

// back to the top: shown once the page has scrolled down
const adTop = document.querySelector(".nt-top");
const adShowTop = () => { adTop.hidden = window.scrollY < 300; };
window.addEventListener("scroll", adShowTop, { passive: true });
adShowTop();
adTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
