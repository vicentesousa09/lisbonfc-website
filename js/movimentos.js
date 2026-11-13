// Saldos e Movimentos (movimentos.html), opened by Ver Movimentos on the profile's Saldo Disponível. As Benfica's: the
// notifications, a box for a period (the last 12 months, then each year back to the member's first, with the arrows)
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

// the movements: each a direct discount on a purchase (no balance moved yet, so those are "-")
const smToday = new Date();
const smDaysAgo = (n) => new Date(smToday.getFullYear(), smToday.getMonth(), smToday.getDate() - n);
const SM_MOVES = [
  { date: smDaysAgo(18), origin: "Loja Oficial", category: "Merchandising", discount: 1.11, info: "Desconto direto de 5% numa compra na Loja Oficial." },
  { date: smDaysAgo(75), origin: "Loja Online", category: "Equipamentos", discount: 3.5, info: "Desconto direto de 5% numa compra na Loja Online." },
  { date: smDaysAgo(160), origin: "Loja Oficial", category: "Acessórios", discount: 2.67, info: "Desconto direto de 5% numa compra na Loja Oficial." },
  { date: smDaysAgo(420), origin: "Loja Online", category: "Equipamentos", discount: 4.2, info: "Desconto direto de 5% numa compra na Loja Online." },
];
const smEuro = (v) => `${v.toFixed(2).replace(".", ",")}€`;
const smDate = (d) => d.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
const smEsc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// the periods: the last 12 months first, then each year from this one back to the member's first
const smPeriods = [{ name: "Últimos 12 meses", from: smDaysAgo(365), to: smToday }];
for (let y = smToday.getFullYear(); y >= Math.min(smSince.getFullYear(), smToday.getFullYear() - 1); y--) {
  smPeriods.push({ name: String(y), from: new Date(y, 0, 1), to: new Date(y, 11, 31, 23, 59) });
}
let smPeriod = 0;

// the search, and the categories ticked in the filters (none ticked: all)
const smSearch = document.querySelector("[data-sm-search]");
const smCats = [...new Set(SM_MOVES.map((m) => m.category))].sort((a, b) => a.localeCompare(b, "pt"));
const smCatBox = document.querySelector("[data-sm-categories]");
smCatBox.innerHTML = smCats.map((c) => `<label class="sm-filter"><input type="checkbox" value="${smEsc(c)}"><span>${smEsc(c)}</span></label>`).join("");

const smRows = document.querySelector("[data-sm-rows]");
const smEmpty = document.querySelector("[data-sm-empty]");
function smRender() {
  const p = smPeriods[smPeriod];
  document.querySelector("[data-sm-period]").textContent = p.name;
  document.querySelector("[data-sm-older]").disabled = smPeriod === smPeriods.length - 1;
  document.querySelector("[data-sm-newer]").disabled = smPeriod === 0;
  const inPeriod = SM_MOVES.filter((m) => m.date >= p.from && m.date <= p.to);
  // the box: what was earned in the period, and what's left on the card (nothing moved to the balance yet)
  const earned = inPeriod.reduce((t, m) => t + m.discount, 0);
  document.querySelector("[data-sm-earned]").textContent = smEuro(earned);
  document.querySelector("[data-sm-earned-discount]").textContent = smEuro(earned);
  document.querySelector("[data-sm-earned-balance]").textContent = smEuro(0);
  document.querySelector("[data-sm-left]").textContent = smEuro(0);
  // the table: the period's movements matching the search and the ticked categories, newest first
  const q = smSearch.value.trim().toLocaleLowerCase("pt");
  const ticked = [...smCatBox.querySelectorAll("input:checked")].map((i) => i.value);
  const shown = inPeriod
    .filter((m) => !q || `${m.origin} ${m.category}`.toLocaleLowerCase("pt").includes(q))
    .filter((m) => !ticked.length || ticked.includes(m.category))
    .sort((a, b) => b.date - a.date);
  smRows.innerHTML = shown.map((m, i) => `<tr>
    <td class="sm-td-date">${smDate(m.date)}</td>
    <td>${smEsc(m.origin)}</td>
    <td>${smEsc(m.category)}</td>
    <td class="sm-td-discount">+${smEuro(m.discount)}</td>
    <td class="sm-td-balance">-</td>
    <td>-</td>
    <td class="sm-td-info"><button type="button" class="sm-info" aria-expanded="false" aria-controls="smInfo${i}" aria-label="Detalhes do movimento"><svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="15" cy="15" r="13.5"/><path d="M15 13v9" stroke-width="1.5"/><circle cx="15" cy="9" r="1" fill="currentColor" stroke="none"/></svg></button><p class="sm-info-pop" id="smInfo${i}" hidden>${smEsc(m.info)}</p></td>
  </tr>`).join("");
  smEmpty.hidden = shown.length > 0;
}
smRender();

// the arrows: back to older periods, forward to newer ones
document.querySelector("[data-sm-older]").addEventListener("click", () => { smPeriod = Math.min(smPeriod + 1, smPeriods.length - 1); smRender(); });
document.querySelector("[data-sm-newer]").addEventListener("click", () => { smPeriod = Math.max(smPeriod - 1, 0); smRender(); });

// Ganhaste: its parts open under it
const smEarnedToggle = document.querySelector(".sm-sum-toggle");
smEarnedToggle.addEventListener("click", () => {
  const open = smEarnedToggle.getAttribute("aria-expanded") !== "true";
  smEarnedToggle.setAttribute("aria-expanded", String(open));
  document.getElementById("smEarned").hidden = !open;
});

// the search filters as it's typed; the filters open under their button, and Limpar unticks them all
smSearch.addEventListener("input", smRender);
smCatBox.addEventListener("change", smRender);
const smFiltersBtn = document.querySelector(".sm-filters-btn");
const smFiltersPanel = document.getElementById("smFilters");
const smFiltersOpen = (open) => { smFiltersPanel.hidden = !open; smFiltersBtn.setAttribute("aria-expanded", String(open)); };
smFiltersBtn.addEventListener("click", () => smFiltersOpen(smFiltersPanel.hidden));
document.querySelector("[data-sm-clear]").addEventListener("click", () => {
  smCatBox.querySelectorAll("input").forEach((i) => { i.checked = false; });
  smRender();
});

// the (i) of a movement: its details in a small box under it (one at a time); a click outside closes them
function smCloseInfo(except) {
  smRows.querySelectorAll(".sm-info").forEach((b) => {
    if (b === except) return;
    b.setAttribute("aria-expanded", "false");
    b.nextElementSibling.hidden = true;
  });
}
smRows.addEventListener("click", (e) => {
  const btn = e.target.closest(".sm-info");
  if (!btn) return;
  smCloseInfo(btn);
  const open = btn.getAttribute("aria-expanded") !== "true";
  btn.setAttribute("aria-expanded", String(open));
  btn.nextElementSibling.hidden = !open;
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".sm-td-info")) smCloseInfo(null);
  if (!e.target.closest(".sm-filters")) smFiltersOpen(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  smCloseInfo(null);
  smFiltersOpen(false);
});
