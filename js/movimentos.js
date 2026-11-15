// Saldos e Movimentos (movimentos.html), opened by Ver Movimentos on the profile's Saldo Disponível. As Benfica's: the
// notifications, a box for a period (the last 12 months and each season back to the member's first, round with the arrows)
// showing the member card, what was earned in it (its parts under Ganhaste), what's left on the card, the family
// buttons and the overdue quotas; then a search and the filters over the table of movements. Until there's a server
// the movements are a few made-up purchases at the club's shops, dated back from today

let smProfile = null;
try { smProfile = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
// not signed in: the sign-in page instead
if (!smProfile) location.replace("conta.html");
smProfile = smProfile || {};

// the card: number, the year since and the name (and the photo, when one was picked on the profile)
const smSince = new Date(smProfile.since || Date.now());
document.querySelector("[data-sm-member]").textContent = smProfile.socio || "-";
document.querySelector("[data-sm-since]").textContent = smSince.getFullYear();
document.querySelector("[data-sm-name]").textContent = (smProfile.name || "").toLocaleUpperCase("pt");
try {
  const photo = localStorage.getItem("lfcAvatar");
  const img = document.querySelector(".sm-card .pf-card-photo img");
  if (photo) { img.src = photo; img.hidden = false; }
} catch {}

// the movements: each a direct discount on a purchase (no balance moved yet, so those are "-"); type is direto,
// cartao (a discount loaded on the card) or outros; original is the purchase's price before the discount, operation
// what it was (empty for now, as on Benfica's)
const smToday = new Date();
const smDaysAgo = (n) => new Date(smToday.getFullYear(), smToday.getMonth(), smToday.getDate() - n);
const SM_MOVES = [
  { date: smDaysAgo(18), origin: "Loja Oficial", category: "Merchandising", type: "direto", discount: 1.11, original: 22.2, operation: "" },
  { date: smDaysAgo(75), origin: "Loja Online", category: "Equipamentos", type: "direto", discount: 3.5, original: 70, operation: "" },
  { date: smDaysAgo(160), origin: "Loja Oficial", category: "Acessórios", type: "direto", discount: 2.67, original: 53.4, operation: "" },
  { date: smDaysAgo(420), origin: "Loja Online", category: "Equipamentos", type: "direto", discount: 4.2, original: 84, operation: "" },
];
const smEuro = (v) => `${v.toFixed(2).replace(".", ",")}€`;
const smDate = (d) => d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
const smEsc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// the periods: the last 12 months, then each season (July to June) from the last full one back to the member's first.
// They go round: the right arrow from the last 12 months shows the last season, the left one the member's first
const smSeasonStart = (d) => (d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1);
const smLastSeason = smSeasonStart(smToday) - 1;
const smPeriods = [{ name: "Últimos 12 meses", from: smDaysAgo(365), to: smToday }];
for (let y = smLastSeason; y >= Math.min(smSeasonStart(smSince), smLastSeason); y--) {
  smPeriods.push({ name: `Época ${y}/${y + 1}`, from: new Date(y, 6, 1), to: new Date(y + 1, 5, 30, 23, 59, 59) });
}
let smPeriod = 0;

// the search, and the filters: what's picked in the panel only counts once Filtrar is pressed (smApplied)
const smSearch = document.querySelector("[data-sm-search]");
// the categories: the club's own (Lisbon FC) and those of the movements, in alphabetical order
const smCats = [...new Set(["Lisbon FC", ...SM_MOVES.map((m) => m.category)])].sort((a, b) => a.localeCompare(b, "pt"));
// the panel's lists (Categoria, Tipo de movimento): a button showing the pick over a list of options, opened under
// it; the pick kept in the button's data-value. With an empty label (Categoria's Todos, not one of its options),
// picking the chosen option again goes back to it
const smDrops = [];
function smDrop(btn, list, options, emptyLabel) {
  list.innerHTML = options.map(([value, label]) => `<li role="option" aria-selected="${value === btn.dataset.value}"><button type="button" class="sm-fp-option" data-value="${smEsc(value)}">${smEsc(label)}</button></li>`).join("");
  const open = (on) => { list.hidden = !on; btn.setAttribute("aria-expanded", String(on)); };
  btn.addEventListener("click", () => { smDrops.forEach((d) => d !== open && d(false)); open(list.hidden); });
  list.addEventListener("click", (e) => {
    const opt = e.target.closest(".sm-fp-option");
    if (!opt) return;
    const value = emptyLabel && opt.dataset.value === btn.dataset.value ? "" : opt.dataset.value;
    btn.dataset.value = value;
    btn.textContent = value ? opt.textContent : emptyLabel;
    list.querySelectorAll(".sm-fp-option").forEach((o) => o.parentElement.setAttribute("aria-selected", String(!!value && o.dataset.value === value)));
    open(false);
  });
  smDrops.push(open);
}
const smCloseDrops = () => smDrops.forEach((d) => d(false));
const smCategory = document.querySelector("[data-sm-category]");
smDrop(smCategory, document.querySelector("[data-sm-category-list]"), smCats.map((c) => [c, c]), "Todos");
const smType = document.querySelector("[data-sm-type]");
smDrop(smType, document.querySelector("[data-sm-type-list]"), [["direto,cartao", "Desconto Direto / Em Cartão"], ["direto", "Desconto Direto"], ["cartao", "Em cartão"]]);
let smApplied = null;

const smRows = document.querySelector("[data-sm-rows]");
const smEmpty = document.querySelector("[data-sm-empty]");
function smRender() {
  const p = smPeriods[smPeriod];
  document.querySelector("[data-sm-period]").textContent = p.name;
  const inPeriod = SM_MOVES.filter((m) => m.date >= p.from && m.date <= p.to);
  // the box: what was earned in the period, and what's left on the card (nothing moved to the balance yet)
  const earned = inPeriod.reduce((t, m) => t + m.discount, 0);
  document.querySelector("[data-sm-earned]").textContent = smEuro(earned);
  document.querySelector("[data-sm-earned-discount]").textContent = smEuro(earned);
  document.querySelector("[data-sm-earned-card]").textContent = smEuro(0);
  document.querySelector("[data-sm-earned-other]").textContent = smEuro(0);
  document.querySelector("[data-sm-left]").textContent = smEuro(0);
  // the table: the period's movements matching the search and the applied filters, newest first
  const q = smSearch.value.trim().toLocaleLowerCase("pt");
  const a = smApplied;
  const shown = inPeriod
    .filter((m) => !q || `${m.origin} ${m.category}`.toLocaleLowerCase("pt").includes(q))
    .filter((m) => !a || ((!a.from || m.date >= a.from) && (!a.to || m.date < a.to)
      && (!a.category || m.category === a.category)
      && (a.min == null || m.discount >= a.min) && (a.max == null || m.discount <= a.max)
      && (!a.types.length || a.types.includes(m.type))))
    .sort((a, b) => b.date - a.date);
  // each movement, and under it its details (shown by its (i)): the category, the operation, the price before and
  // after the discount, and, while quotas are overdue, the notice with Regularizar
  const feesDue = !document.querySelector("[data-sm-fees]").hidden;
  smRows.innerHTML = shown.map((m, i) => `<tr class="sm-move">
    <td class="sm-td-date">${smDate(m.date)}</td>
    <td>${smEsc(m.origin)}</td>
    <td>${smEsc(m.category)}</td>
    <td class="sm-td-discount">+${smEuro(m.discount)}</td>
    <td class="sm-td-balance">-</td>
    <td>-</td>
    <td class="sm-td-info"><button type="button" class="sm-info" aria-expanded="false" aria-controls="smInfo${i}" aria-label="Detalhes do movimento"><svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="15" cy="15" r="13.5"/><path d="M15 13v9" stroke-width="1.5"/><circle cx="15" cy="9" r="1" fill="currentColor" stroke="none"/></svg></button></td>
  </tr>
  <tr class="sm-detail" id="smInfo${i}" hidden><td colspan="7"><div class="sm-detail-inner">
    <p><b>Categoria</b> ${smEsc(m.category)}</p>
    <p><b>Operação</b> ${smEsc(m.operation)}</p>
    <p><b>Valor Original</b> ${smEuro(m.original)}</p>
    <p><b>Valor Pago</b> ${smEuro(m.original - m.discount)}</p>
    ${feesDue ? '<p class="sm-detail-fees">Quotas de sócio em atraso</p><a href="quotas.html" class="sm-fees-btn sm-detail-btn">Regularizar</a>' : ""}
  </div></td></tr>`).join("");
  smEmpty.hidden = shown.length > 0;
}
smRender();

// the arrows: round the periods, the right one forward (the last season, then older ones), the left one back
const smStep = (by) => { smPeriod = (smPeriod + by + smPeriods.length) % smPeriods.length; smRender(); };
document.querySelector("[data-sm-older]").addEventListener("click", () => smStep(-1));
document.querySelector("[data-sm-newer]").addEventListener("click", () => smStep(1));

// Ganhaste: its parts open under it
const smEarnedToggle = document.querySelector(".sm-sum-toggle");
smEarnedToggle.addEventListener("click", () => {
  const open = smEarnedToggle.getAttribute("aria-expanded") !== "true";
  smEarnedToggle.setAttribute("aria-expanded", String(open));
  document.getElementById("smEarned").hidden = !open;
});

// the search filters as it's typed; the filters open in a panel under the bar
smSearch.addEventListener("input", smRender);
const smFiltersBtn = document.querySelector(".sm-filters-btn");
const smFiltersPanel = document.getElementById("smFilters");
// opening shows it at once (the CSS grows it down); closing squashes it back up first, then hides it
let smFiltersTimer = 0;
function smFiltersOpen(open) {
  smFiltersBtn.setAttribute("aria-expanded", String(open));
  const p = smFiltersPanel;
  if (open) { p.classList.remove("is-closing"); p.hidden = false; return; }
  if (p.hidden || p.classList.contains("is-closing")) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { p.hidden = true; return; }
  p.classList.add("is-closing");
  // hidden once the squash is over (0.35s in the CSS), unless it was opened again meanwhile
  clearTimeout(smFiltersTimer);
  smFiltersTimer = setTimeout(() => {
    if (p.classList.contains("is-closing")) { p.classList.remove("is-closing"); p.hidden = true; }
  }, 350);
}
smFiltersBtn.addEventListener("click", () => smFiltersOpen(smFiltersBtn.getAttribute("aria-expanded") !== "true"));

// Período: a month at a time; a first click picks the start, a second the end (the earlier of the two first), a
// third starts again; clicking the start on its own takes it off. The days between are filled as one band, both its
// ends rounded
const SM_MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const smCalDays = document.querySelector("[data-sm-cal-days]");
let smCalMonth = new Date(smToday.getFullYear(), smToday.getMonth(), 1);
// picked to start with: from the same day a month ago (or the month's last day, when shorter) to today
const smMonthAgo = new Date(smToday.getFullYear(), smToday.getMonth() - 1, Math.min(smToday.getDate(), new Date(smToday.getFullYear(), smToday.getMonth(), 0).getDate()));
let smPickFrom = smMonthAgo, smPickTo = new Date(smToday.getFullYear(), smToday.getMonth(), smToday.getDate());
const smSameDay = (x, y) => x && y && x.getTime() === y.getTime();
function smCalRender() {
  const y = smCalMonth.getFullYear(), mo = smCalMonth.getMonth();
  document.querySelector("[data-sm-cal-month]").textContent = `${SM_MONTHS[mo]} ${y}`;
  const lead = (smCalMonth.getDay() + 6) % 7;
  const count = new Date(y, mo + 1, 0).getDate();
  const last = smPickTo || smPickFrom;
  let html = "<span></span>".repeat(lead);
  for (let d = 1; d <= count; d++) {
    const day = new Date(y, mo, d);
    const picked = smPickFrom && day >= smPickFrom && day <= last;
    const cls = ["sm-cal-day", (lead + d - 1) % 7 >= 5 && "is-weekend", picked && "is-picked", picked && smSameDay(day, smPickFrom) && "is-start", picked && smSameDay(day, last) && "is-end"].filter(Boolean).join(" ");
    html += `<button type="button" class="${cls}" data-day="${d}" aria-pressed="${!!picked}" aria-label="${d} de ${SM_MONTHS[mo]} de ${y}">${String(d).padStart(2, "0")}</button>`;
  }
  smCalDays.innerHTML = html;
}
smCalDays.addEventListener("click", (e) => {
  const btn = e.target.closest(".sm-cal-day");
  if (!btn) return;
  const day = new Date(smCalMonth.getFullYear(), smCalMonth.getMonth(), +btn.dataset.day);
  if (smPickFrom && !smPickTo && smSameDay(day, smPickFrom)) smPickFrom = null;
  else if (!smPickFrom || smPickTo) { smPickFrom = day; smPickTo = null; }
  else if (day < smPickFrom) { smPickTo = smPickFrom; smPickFrom = day; }
  else smPickTo = day;
  smCalRender();
});
const smCalStep = (by) => { smCalMonth = new Date(smCalMonth.getFullYear(), smCalMonth.getMonth() + by, 1); smCalRender(); };
document.querySelector("[data-sm-cal-prev]").addEventListener("click", () => smCalStep(-1));
document.querySelector("[data-sm-cal-next]").addEventListener("click", () => smCalStep(1));
smCalRender();

// Filtrar: takes what's picked (the period, the category, the value from/to and the type) to the table, and closes
const smMoney = (v) => { const n = parseFloat(v.replace(/[€s]/g, "").replace(",", ".")); return Number.isFinite(n) ? n : null; };
document.querySelector("[data-sm-apply]").addEventListener("click", () => {
  const last = smPickTo || smPickFrom;
  smApplied = {
    from: smPickFrom,
    to: last && new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
    category: smCategory.dataset.value,
    min: smMoney(document.querySelector("[data-sm-min]").value),
    max: smMoney(document.querySelector("[data-sm-max]").value),
    types: smType.dataset.value.split(",").filter(Boolean),
  };
  smFiltersOpen(false);
  smRender();
});

// the (i) of a movement: opens its details in a row under it, the movement's row growing into it; again, closes them
smRows.addEventListener("click", (e) => {
  const btn = e.target.closest(".sm-info");
  if (!btn) return;
  const open = btn.getAttribute("aria-expanded") !== "true";
  btn.setAttribute("aria-expanded", String(open));
  btn.closest("tr").classList.toggle("is-open", open);
  document.getElementById(btn.getAttribute("aria-controls")).hidden = !open;
});
document.addEventListener("click", (e) => {
  // (by the path, as a day clicked in the calendar is redrawn, so no longer in the page)
  if (!e.composedPath().some((el) => el.classList?.contains("sm-filters"))) smFiltersOpen(false);
  if (!e.target.closest(".sm-fp-drop")) smCloseDrops();
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  smCloseDrops();
  smFiltersOpen(false);
});
