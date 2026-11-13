// Countries for the account forms (conta-dados-pessoais.html, informacao-pessoal.html): every country and territory
// (ISO code, dialling code, name in English and its own name), their flags, an example mobile number for each, and the
// flag picker that opens the list of countries over a box

// every country (ISO code and dialling code); the names come from the browser, in Portuguese
const COUNTRIES = ("AF93 AL355 DZ213 AD376 AO244 AG1 AR54 AM374 AW297 AU61 AT43 AZ994 BS1 BH973 BD880 BB1 BY375 BE32 BZ501 " +
  "BJ229 BM1 BT975 BO591 BA387 BW267 BR55 BN673 BG359 BF226 BI257 CV238 KH855 CM237 CA1 KY1 CF236 TD235 CL56 CN86 CO57 " +
  "KM269 CG242 CD243 CR506 CI225 HR385 CU53 CW599 CY357 CZ420 DK45 DJ253 DM1 DO1 EC593 EG20 SV503 GQ240 ER291 EE372 SZ268 " +
  "ET251 FO298 FJ679 FI358 FR33 GF594 PF689 GA241 GM220 GE995 DE49 GH233 GI350 GR30 GL299 GD1 GP590 GT502 GG44 GN224 GW245 " +
  "GY592 HT509 HN504 HK852 HU36 IS354 IN91 ID62 IR98 IQ964 IE353 IM44 IL972 IT39 JM1 JP81 JE44 JO962 KZ7 KE254 KI686 XK383 " +
  "KW965 KG996 LA856 LV371 LB961 LS266 LR231 LY218 LI423 LT370 LU352 MO853 MG261 MW265 MY60 MV960 ML223 MT356 MH692 MQ596 " +
  "MR222 MU230 YT262 MX52 FM691 MD373 MC377 MN976 ME382 MA212 MZ258 MM95 NA264 NR674 NP977 NL31 NC687 NZ64 NI505 NE227 " +
  "NG234 KP850 MK389 NO47 OM968 PK92 PW680 PS970 PA507 PG675 PY595 PE51 PH63 PL48 PT351 PR1 QA974 RE262 RO40 RU7 RW250 " +
  "KN1 LC1 VC1 WS685 SM378 ST239 SA966 SN221 RS381 SC248 SL232 SG65 SK421 SI386 SB677 SO252 ZA27 KR82 SS211 ES34 LK94 " +
  "SD249 SR597 SE46 CH41 SY963 TW886 TJ992 TZ255 TH66 TL670 TG228 TO676 TT1 TN216 TR90 TM993 TV688 UG256 UA380 AE971 " +
  "GB44 US1 UY598 UZ998 VU678 VA39 VE58 VN84 VG1 YE967 ZM260 ZW263 " +
  // territories too, so every place a phone number or address can be in is there
  "AI1 AQ672 AS1 AX358 BL590 BQ599 BV47 CC61 CK682 CX61 EH212 FK500 GS500 GU1 HM672 IO246 MF590 MP1 MS1 NF672 NU683 " +
  "PM508 PN64 SH290 SJ47 SX1 TC1 TF262 TK690 UM1 VI1 WF681").split(" ").map((c) => {
  const iso = c.slice(0, 2);
  return { iso, dial: c.slice(2), name: iso };
});
// the names in English (from the browser, a few tidied), and in the list each country's own name in brackets where
// it's different, e.g. "Albania (Shqipëri)"
const EN_NAMES = { CG: "Congo (Republic)", CD: "Congo (DRC)", HK: "Hong Kong", MO: "Macau", MM: "Myanmar",
  PS: "Palestine", VA: "Vatican City", CI: "Côte d'Ivoire", CZ: "Czech Republic", TR: "Turkey" };
const NATIVE_NAMES = {
  AF: "افغانستان", AL: "Shqipëri", DZ: "الجزائر", AM: "Հայաստան", AT: "Österreich", AZ: "Azərbaycan", BH: "البحرين",
  BD: "বাংলাদেশ", BY: "Беларусь", BE: "België", BJ: "Bénin", BT: "འབྲུག", BA: "Босна и Херцеговина", BR: "Brasil",
  BG: "България", BI: "Uburundi", KH: "កម្ពុជា", CM: "Cameroun", CV: "Cabo Verde", CF: "République centrafricaine",
  TD: "Tchad", CN: "中国", KM: "Comores", CG: "Congo-Brazzaville", CD: "Jamhuri ya Kidemokrasia ya Kongo",
  HR: "Hrvatska", CY: "Κύπρος", CZ: "Česko", DK: "Danmark", DO: "República Dominicana", EG: "مصر",
  GQ: "Guinea Ecuatorial", EE: "Eesti", SZ: "eSwatini", FO: "Føroyar", FI: "Suomi", GF: "Guyane française",
  PF: "Polynésie française", GE: "საქართველო", DE: "Deutschland", GR: "Ελλάδα", GL: "Kalaallit Nunaat", GN: "Guinée",
  GW: "Guiné-Bissau", HK: "香港", HU: "Magyarország", IS: "Ísland", IN: "भारत", IR: "ایران", IQ: "العراق", IL: "ישראל",
  IT: "Italia", JP: "日本", JO: "الأردن", KZ: "Казахстан", KW: "الكويت", KG: "Кыргызстан", LA: "ລາວ", LV: "Latvija",
  LB: "لبنان", LY: "ليبيا", LT: "Lietuva", MO: "澳門", MG: "Madagasikara", MR: "موريتانيا", MX: "México",
  MD: "Republica Moldova", MN: "Монгол", ME: "Crna Gora", MA: "المغرب", MZ: "Moçambique", MM: "မြန်မာ", NP: "नेपाल",
  NL: "Nederland", NC: "Nouvelle-Calédonie", KP: "조선", MK: "Северна Македонија", NO: "Norge", OM: "عُمان",
  PK: "پاکستان", PS: "فلسطين", PA: "Panamá", PE: "Perú", PL: "Polska", QA: "قطر", RE: "La Réunion", RO: "România",
  RU: "Россия", ST: "São Tomé e Príncipe", SA: "المملكة العربية السعودية", SN: "Sénégal", RS: "Србија",
  SK: "Slovensko", SI: "Slovenija", SO: "Soomaaliya", KR: "대한민국", ES: "España", LK: "ශ්‍රී ලංකාව", SD: "السودان",
  SE: "Sverige", CH: "Schweiz", SY: "سوريا", TW: "台灣", TJ: "Тоҷикистон", TH: "ไทย", TN: "تونس", TR: "Türkiye",
  TM: "Türkmenistan", UA: "Україна", AE: "الإمارات العربية المتحدة", UZ: "Oʻzbekiston", VA: "Città del Vaticano",
  VN: "Việt Nam", YE: "اليمن", EH: "الصحراء الغربية", BL: "Saint-Barthélemy", MF: "Saint-Martin",
  PM: "Saint-Pierre-et-Miquelon", WF: "Wallis-et-Futuna", TF: "Terres australes françaises",
};
try {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  COUNTRIES.forEach((c) => { c.name = (names.of(c.iso) || c.iso).replace(" & ", " and "); });
} catch {}
COUNTRIES.forEach((c) => {
  c.name = EN_NAMES[c.iso] || c.name;
  c.label = NATIVE_NAMES[c.iso] ? `${c.name} (${NATIVE_NAMES[c.iso]})` : c.name;
});
COUNTRIES.sort((a, b) => a.name.localeCompare(b.name, "en"));

const flagUrl = (iso) => `https://flagcdn.com/w40/${iso.toLowerCase()}.png`;

// an example mobile number for each country (national digits, from libphonenumber), shown in the box as a hint
const PHONE_EXAMPLES = {
  AC:"40123", AD:"312345", AE:"501234567", AF:"701234567", AG:"2684641234", AI:"2642351234", AL:"672123456",
  AM:"77123456", AO:"923123456", AR:"91123456789", AS:"6847331234", AT:"664123456", AU:"412345678", AW:"5601234",
  AX:"412345678", AZ:"401234567", BA:"61123456", BB:"2462501234", BD:"1812345678", BE:"470123456", BF:"70123456",
  BG:"43012345", BH:"36001234", BI:"79561234", BJ:"90011234", BL:"690001234", BM:"4413701234", BN:"7123456",
  BO:"71234567", BQ:"3181234", BR:"11961234567", BS:"2423591234", BT:"17123456", BW:"71123456", BY:"294911911",
  BZ:"6221234", CA:"5062345678", CC:"412345678", CD:"991234567", CF:"70012345", CG:"061234567", CH:"781234567",
  CI:"0123456789", CK:"71234", CL:"221234567", CM:"671234567", CN:"13123456789", CO:"3211234567", CR:"83123456",
  CU:"51234567", CV:"9911234", CW:"95181234", CX:"412345678", CY:"96123456", CZ:"601123456", DE:"15123456789",
  DJ:"77831001", DK:"34412345", DM:"7672251234", DO:"8092345678", DZ:"551234567", EC:"991234567", EE:"51234567",
  EG:"1001234567", EH:"650123456", ER:"7123456", ES:"612345678", ET:"911234567", FI:"412345678", FJ:"7012345",
  FK:"51234", FM:"3501234", FO:"211234", FR:"612345678", GA:"06031234", GB:"7400123456", GD:"4734031234",
  GE:"555123456", GF:"694201234", GG:"7781123456", GH:"231234567", GI:"57123456", GL:"221234", GM:"3012345",
  GN:"601123456", GP:"690001234", GQ:"222123456", GR:"6912345678", GT:"51234567", GU:"6713001234", GW:"955012345",
  GY:"6091234", HK:"51234567", HN:"91234567", HR:"921234567", HT:"34101234", HU:"201234567", ID:"812345678",
  IE:"850123456", IL:"502345678", IM:"7924123456", IN:"8123456789", IO:"3801234", IQ:"7912345678", IR:"9123456789",
  IS:"6111234", IT:"3123456789", JE:"7797712345", JM:"8762101234", JO:"790123456", JP:"9012345678", KE:"712123456",
  KG:"700123456", KH:"91234567", KI:"72001234", KM:"3212345", KN:"8697652917", KP:"1921234567", KR:"1020000000",
  KW:"50012345", KY:"3453231234", KZ:"7710009998", LA:"2023123456", LB:"71123456", LC:"7582845678", LI:"660234567",
  LK:"712345678", LR:"770123456", LS:"50123456", LT:"61234567", LU:"628123456", LV:"21234567", LY:"912345678",
  MA:"650123456", MC:"612345678", MD:"62112345", ME:"67622901", MF:"690001234", MG:"321234567", MH:"2351234",
  MK:"72345678", ML:"65012345", MM:"92123456", MN:"88123456", MO:"66123456", MP:"6702345678", MQ:"696201234",
  MR:"22123456", MS:"6644923456", MT:"96961234", MU:"52512345", MV:"7712345", MW:"991234567", MX:"2221234567",
  MY:"123456789", MZ:"821234567", NA:"811234567", NC:"751234", NE:"93123456", NF:"381234", NG:"8021234567",
  NI:"81234567", NL:"612345678", NO:"40612345", NP:"9841234567", NR:"5551234", NU:"8884012", NZ:"211234567",
  OM:"92123456", PA:"61234567", PE:"912345678", PF:"87123456", PG:"70123456", PH:"9051234567", PK:"3012345678",
  PL:"512345678", PM:"551234", PR:"7872345678", PS:"599123456", PT:"912345678", PW:"6201234", PY:"961456789",
  QA:"33123456", RE:"692123456", RO:"712034567", RS:"601234567", RU:"9123456789", RW:"720123456", SA:"512345678",
  SB:"7421234", SC:"2510123", SD:"911231234", SE:"701234567", SG:"81234567", SH:"51234", SI:"31234567", SJ:"41234567",
  SK:"912123456", SL:"25123456", SM:"66661212", SN:"701234567", SO:"71123456", SR:"7412345", SS:"977123456",
  ST:"9812345", SV:"70123456", SX:"7215205678", SY:"944567890", SZ:"76123456", TA:"8999", TC:"6492311234",
  TD:"63012345", TG:"90112345", TH:"812345678", TJ:"917123456", TK:"7290", TL:"77212345", TM:"66123456", TN:"20123456",
  TO:"7715123", TR:"5012345678", TT:"8682911234", TV:"901234", TW:"912345678", TZ:"621234567", UA:"501234567",
  UG:"712345678", US:"2015550123", UY:"94231234", UZ:"912345678", VA:"3123456789", VC:"7844301234", VE:"4121234567",
  VG:"2843001234", VI:"3406421234", VN:"912345678", VU:"5912345", WF:"821234", WS:"7212345", XK:"43201234",
  YE:"712345678", YT:"639012345", ZA:"711234567", ZM:"955123456", ZW:"712345678",
};
function examplePhone(iso) {
  const digits = PHONE_EXAMPLES[iso];
  if (!digits || !window.libphonenumber) return "";
  try { return libphonenumber.parsePhoneNumber(digits, iso).formatNational(); } catch { return ""; }
}

// each flag opens a list over its box with every flag and country (Portugal first, under a line, then A-Z);
// it works with the mouse or the keyboard (arrows, Enter, Esc, or a letter to jump), and closes on a click outside
// short: only the codes, as on the quotas Débito Direto phone (Portugal and Spain, under a line, then the rest A-Z)
const PICK_ORDER = [COUNTRIES.find((c) => c.iso === "PT"), ...COUNTRIES.filter((c) => c.iso !== "PT")];
const SHORT_TOP = ["PT", "ES"];
const SHORT_ORDER = [...SHORT_TOP.map((iso) => COUNTRIES.find((c) => c.iso === iso)),
  ...COUNTRIES.filter((c) => !SHORT_TOP.includes(c.iso)).sort((a, b) => a.iso.localeCompare(b.iso))];
function makePicker(select, box, listParent, withDial, short = false) {
  const btn = box.querySelector(".ac-flag-btn");
  const text = box.querySelector(".ac-select-text");
  const list = document.createElement("ul");
  list.className = "ac-countries";
  list.setAttribute("role", "listbox");
  list.tabIndex = -1;
  list.hidden = true;
  (short ? SHORT_ORDER : PICK_ORDER).forEach((c, i) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.dataset.iso = c.iso;
    if (i === (short ? SHORT_TOP.length - 1 : 0)) li.classList.add("is-first");
    if (short) {
      li.innerHTML = `<img class="ac-flag" src="${flagUrl(c.iso)}" alt="" loading="lazy"><span>${c.iso}</span>` +
        (withDial ? `<span class="ac-dial">+${c.dial}</span>` : "");
      li.setAttribute("aria-label", c.name);
      list.appendChild(li);
      return;
    }
    li.innerHTML = `<img class="ac-flag" src="${flagUrl(c.iso)}" alt="" loading="lazy"><span>${c.name}${NATIVE_NAMES[c.iso] ? ` (<bdi>${NATIVE_NAMES[c.iso]}</bdi>)` : ""}</span>` +
      (withDial ? `<span class="ac-dial">+${c.dial}</span>` : "");
    list.appendChild(li);
  });
  listParent.appendChild(list);
  const items = [...list.children];
  let active = null;

  const setActive = (li) => {
    if (active) active.classList.remove("is-active");
    active = li;
    if (li) { li.classList.add("is-active"); li.scrollIntoView({ block: "nearest" }); }
  };
  const open = () => {
    if (select.disabled) return;
    list.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    items.forEach((li) => li.setAttribute("aria-selected", String(li.dataset.iso === select.value)));
    setActive(items.find((li) => li.dataset.iso === select.value));
    list.focus();
  };
  const close = () => {
    list.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  };
  const choose = (li) => {
    select.value = li.dataset.iso;
    btn.querySelector(".ac-flag").src = flagUrl(select.value);
    if (text) text.textContent = COUNTRIES.find((c) => c.iso === select.value).name;
    select.dispatchEvent(new Event("change"));
    close();
    btn.focus();
  };

  btn.disabled = select.disabled;
  btn.addEventListener("click", (e) => { e.stopPropagation(); list.hidden ? open() : close(); });
  list.addEventListener("click", (e) => {
    e.stopPropagation();
    const li = e.target.closest("li");
    if (li) choose(li);
  });
  list.addEventListener("mousemove", (e) => {
    const li = e.target.closest("li");
    if (li && li !== active) setActive(li);
  });
  list.addEventListener("keydown", (e) => {
    const i = items.indexOf(active);
    if (e.key === "ArrowDown") setActive(items[Math.min(i + 1, items.length - 1)]);
    else if (e.key === "ArrowUp") setActive(items[Math.max(i - 1, 0)]);
    else if (e.key === "Enter" && active) choose(active);
    else if (e.key === "Escape" || e.key === "Tab") { close(); if (e.key === "Escape") btn.focus(); return; }
    else if (/^\p{L}$/u.test(e.key)) {
      // a letter: the next country starting with it (Portugal at the top aside)
      const k = e.key.toLowerCase();
      const starts = (li) => li.textContent.normalize("NFD").toLowerCase().startsWith(k);
      setActive(items.slice(Math.max(i, 0) + 1).find(starts) || items.slice(1).find(starts) || active);
    } else return;
    e.preventDefault();
  });
  document.addEventListener("click", (e) => { if (!list.hidden && !box.contains(e.target) && !list.contains(e.target)) close(); });
}
