// Gestão de Moradas (gestao-de-moradas.html), opened by Adicionar / Gerir on the profile's Dados Pessoais. Grey boxes
// two by two: the profile's address and the saved ones (Alterar opens Informação Pessoal), a form for a new one while
// there's none saved, and "Adicionar mais" for another. Each address can be the billing and/or delivery one (only one
// of each: ticking it here takes it from the others; none: the profile's). Kept in the session until there's a server

const saveAccount = () => { try { localStorage.setItem("lfcSession", JSON.stringify(account)); } catch {} };
account.addresses = account.addresses || [];
account.billing = account.billing || "perfil";
account.delivery = account.delivery || "perfil";
// a billing or delivery address that's gone: back to the profile's
if (account.billing !== "perfil" && !account.addresses.some((a) => a.id === account.billing)) account.billing = "perfil";
if (account.delivery !== "perfil" && !account.addresses.some((a) => a.id === account.delivery)) account.delivery = "perfil";

const gmEsc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const gmCountry = (iso) => COUNTRIES.find((c) => c.iso === iso)?.name || "";

// the profile's address, from Informação Pessoal (the names from the account's to start)
function profileAddress() {
  const p = account.personal || {};
  const words = (account.name || "").trim().split(/\s+/).filter(Boolean);
  return {
    id: "perfil", title: "Morada Perfil / Sócio",
    first: p.first || words[0] || "", last: p.last || (words.length > 1 ? words[words.length - 1] : ""),
    postcode: p.postcode || "", address: p.address || "", city: p.city || p.town || "", country: p.country || "PT",
  };
}

// a saved address, as Benfica's: its title, the billing / delivery ticks, then name, surname, postcode, address,
// town and country, and Alterar
const GM_TICK = '<svg viewBox="0 0 26 26" fill="none" stroke="var(--blue)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7.5 13.2 3.6 3.6 7.4-8"/></svg>';
function viewHtml(a) {
  const pc = a.postcode.replace("-", " - ");
  const tick = (on, label) => `<li class="${on ? "is-on" : ""}">${on ? GM_TICK : ""}${label}</li>`;
  const row = (label, value) => `<div><dt>${label}</dt><dd>${gmEsc(value)}</dd></div>`;
  return `<div class="gm-card gm-view" data-id="${a.id}">`
    + `<p class="gm-card-title">${gmEsc(a.title)}</p>`
    + `<ul class="gm-checks">${tick(account.billing === a.id, "Morada de Faturação")}${tick(account.delivery === a.id, "Morada de Entrega")}</ul>`
    + `<dl class="gm-details">${row("Nome", a.first)}${row("Apelido", a.last)}${row("Código Postal", pc)}${row("Morada", a.address)}${row("Localidade", a.city)}${row("País", gmCountry(a.country))}</dl>`
    + `<div class="gm-buttons gm-buttons--end"><a href="informacao-pessoal.html" class="gm-btn gm-btn--dark">Alterar</a></div></div>`;
}

// the form, for a new address (a: nothing) or one being changed
function formHtml(a) {
  a = a || { id: "", title: "", first: "", last: "", postcode: "", town: "", address: "", city: "", country: "PT" };
  const [pc1, pc2] = a.country === "PT" ? a.postcode.split("-").concat("") : [a.postcode, ""];
  return `<form class="gm-card gm-edit" data-id="${a.id}" novalidate>`
    + `<input class="gm-input" name="title" maxlength="40" placeholder="Insere o título da tua morada" value="${gmEsc(a.title)}" aria-label="Título da morada">`
    + `<div class="gm-checks">`
    + `<label class="gm-check"><input type="checkbox" name="billing"${a.id && account.billing === a.id ? " checked" : ""}><span>Morada de Faturação</span></label>`
    + `<label class="gm-check"><input type="checkbox" name="delivery"${a.id && account.delivery === a.id ? " checked" : ""}><span>Morada de Entrega</span></label></div>`
    + `<div class="gm-pair"><input class="gm-input" name="first" maxlength="50" autocomplete="given-name" placeholder="Nome" value="${gmEsc(a.first)}" aria-label="Nome">`
    + `<input class="gm-input" name="last" maxlength="50" autocomplete="family-name" placeholder="Apelido" value="${gmEsc(a.last)}" aria-label="Apelido"></div>`
    + `<div class="gm-pc${a.country === "PT" ? "" : " is-free"}"><input class="gm-input" name="pc1" inputmode="numeric" maxlength="${a.country === "PT" ? 4 : 10}" placeholder="0000" value="${gmEsc(pc1)}" aria-label="Código postal">`
    + `<span class="gm-pc-sep">-</span><input class="gm-input" name="pc2" inputmode="numeric" maxlength="3" placeholder="000" value="${gmEsc(pc2)}" aria-label="Código postal (fim)"></div>`
    + `<input class="gm-input" name="town" maxlength="60" placeholder="Insere a tua localidade" value="${gmEsc(a.town)}" aria-label="Localidade">`
    + `<input class="gm-input" name="address" maxlength="120" autocomplete="street-address" placeholder="Insere a tua morada" value="${gmEsc(a.address)}" aria-label="Morada">`
    + `<input class="gm-input gm-input--half" name="city" maxlength="60" placeholder="LOCALIDADE" value="${gmEsc(a.city)}" aria-label="Localidade">`
    + `<div class="ac-select gm-country"><button type="button" class="ac-flag-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Escolher país"><img class="ac-flag" src="${flagUrl(a.country)}" alt=""><svg class="ac-caret" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m1 1.5 4 3 4-3"/></svg></button>`
    + `<span class="ac-select-text">${gmCountry(a.country)}</span><select name="country" hidden></select></div>`
    + `<p class="gm-error" hidden>Indique todos os campos assinalados.</p>`
    + `<div class="gm-buttons"><button type="button" class="gm-btn" data-gm-cancel>Cancelar</button><button type="submit" class="gm-btn gm-btn--dark">Guardar</button></div></form>`;
}
const GM_ADD = '<button type="button" class="gm-card gm-add" data-gm-add><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="50" cy="50" r="49"/><path d="M50 30v40M30 50h40"/></svg><span>Adicionar mais</span></button>';

// a form's country picker, and its postcode in two parts in Portugal (one free box elsewhere)
function setUpForm(form) {
  const select = form.querySelector("select");
  COUNTRIES.forEach((c) => select.add(new Option(c.label, c.iso)));
  const box = form.querySelector(".gm-country");
  select.value = form.dataset.country || "PT";
  makePicker(select, box, box, false);
  const pc = form.querySelector(".gm-pc");
  const [pc1, pc2] = [form.elements.pc1, form.elements.pc2];
  select.addEventListener("change", () => {
    const pt = select.value === "PT";
    pc.classList.toggle("is-free", !pt);
    pc1.maxLength = pt ? 4 : 10;
    pc1.value = pc2.value = "";
  });
  [pc1, pc2].forEach((f) => f.addEventListener("input", () => {
    if (select.value !== "PT") return;
    f.value = f.value.replace(/\D/g, "");
    if (f === pc1 && f.value.length === 4) pc2.focus();
  }));
  form.addEventListener("input", (e) => {
    e.target.classList.remove("is-invalid");
    form.querySelector(".gm-error").hidden = true;
  });
}

// the boxes: the profile's (if it has an address), the saved ones, a new form while none is saved (and any others
// opened with "Adicionar mais"), then "Adicionar mais"
const gmList = document.querySelector("[data-gm-list]");
let gmNewForms = account.addresses.length ? 0 : 1;
function render() {
  const saved = account.addresses.map(viewHtml);
  // (the profile's only once it has an address, filled in in Informação Pessoal: none yet, just the form and "Adicionar mais")
  const own = profileAddress().address ? [viewHtml(profileAddress())] : [];
  gmList.innerHTML = [...own, ...saved,...Array(gmNewForms).fill(formHtml()), GM_ADD].join("");
  gmList.querySelectorAll("form").forEach((form) => {
    const a = account.addresses.find((x) => x.id === form.dataset.id);
    form.dataset.country = a ? a.country : "PT";
    setUpForm(form);
  });
}
render();

gmList.addEventListener("click", (e) => {
  if (e.target.closest("[data-gm-add]")) {
    gmNewForms += 1;
    render();
    [...gmList.querySelectorAll('form.gm-edit[data-id=""]')].pop()?.elements.title.focus();
  } else if (e.target.closest("[data-gm-cancel]")) {
    const form = e.target.closest("form");
    // gone (the only one, with nothing saved yet: just emptied)
    if (account.addresses.length || gmNewForms > 1) gmNewForms -= 1;
    render();
  }
});

// Guardar: every box filled in (the postcode as 0000-000 in Portugal); the ticks take billing / delivery from the
// others (unticking the one that had it gives it back to the profile's)
gmList.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const el = form.elements;
  const pt = el.country.value === "PT";
  const wrong = ["title", "first", "last", "town", "address", "city"].filter((n) => el[n].value.trim() === "");
  if (pt ? !/^\d{4}$/.test(el.pc1.value) : el.pc1.value.trim() === "") wrong.push("pc1");
  if (pt && !/^\d{3}$/.test(el.pc2.value)) wrong.push("pc2");
  wrong.forEach((n) => el[n].classList.add("is-invalid"));
  if (wrong.length) {
    form.querySelector(".gm-error").hidden = false;
    return;
  }
  const id = form.dataset.id || `m${Date.now()}`;
  const address = {
    id, title: el.title.value.trim(), first: el.first.value.trim(), last: el.last.value.trim(),
    postcode: pt ? `${el.pc1.value}-${el.pc2.value}` : el.pc1.value.trim(), town: el.town.value.trim(),
    address: el.address.value.trim().toLocaleUpperCase("pt"), city: el.city.value.trim().toLocaleUpperCase("pt"),
    country: el.country.value,
  };
  const i = account.addresses.findIndex((a) => a.id === id);
  if (i >= 0) account.addresses[i] = address;
  else {
    account.addresses.push(address);
    gmNewForms = Math.max(gmNewForms - 1, 0);
  }
  ["billing", "delivery"].forEach((kind) => {
    if (el[kind].checked) account[kind] = id;
    else if (account[kind] === id) account[kind] = "perfil";
  });
  saveAccount();
  render();
});
