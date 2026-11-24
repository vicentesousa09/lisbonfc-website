// Histórico de encomendas (historico-de-encomendas.html), opened by Ver / Ver Todas on the profile's Encomendas. The
// account's orders in a table, filtered by kind (tabs) and by period or number (Filtros, 3 months to start); each one
// opens into its products, the delivery steps and the payment. The address's #part (#0, #1, ...) opens that order

// what each order holds, until there's a server with the real ones (by order number)
const HE_DETAILS = {
  "6XIT9C1V9T": { kind: "produtos", total: "25,00€", items: [{ qty: 1, name: "Camisola Principal do Lisbon FC 2026-2027", color: "Azul", size: "M", img: "Logos/Loja/camisola-principal-frente.jpg" }] },
  "APP-MF-D5094980826": { kind: "produtos", total: "25,00€", items: [{ qty: 1, name: "Camisola Guarda-Redes do Lisbon FC 2026-2027", color: "Verde", size: "M", img: "Logos/Loja/camisola-guarda-redes-frente.jpg" }] },
};
// the steps' icons: thin outlines, as Benfica's (scale: the bag drawn a little smaller)
const HE_STEPS = [
  { label: "Processado", scale: 0.92, icon: '<path d="M6.5 7h11l.9 15H5.6L6.5 7Z"/><path d="M9.2 7V5.6a2.8 2.8 0 0 1 5.6 0V7"/>' },
  { label: "A Preparar", icon: '<path d="M4 10.5 12 14.5l8-4V18.5l-8 4-8-4Z"/><path d="M12 14.5v8M4 10.5 12 6.5l8 4M4 10.5 1.5 7.5l8-4 2.5 3M20 10.5l2.5-3-8-4-2.5 3"/>' },
  { label: "Preparado", icon: '<path d="M4 7 12 3l8 4v10l-8 4-8-4Z"/><path d="M4 7l8 4 8-4M12 11v10M8 5l8 4v3"/>' },
  { label: "Distribuição", icon: '<path d="M6 7h9v10H6ZM15 10h4l3 3v4h-7"/><circle cx="9" cy="17.5" r="1.7" fill="var(--white)"/><circle cx="18.5" cy="17.5" r="1.7" fill="var(--white)"/><path d="M1.5 9.5h3M0.5 12.5h4M2 15.5h2.5"/>' },
  { label: "Entregue", icon: '<path d="M4 11.5 12 4.5l8 7V20H4Z"/><path d="M10 20v-5h4v5"/>' },
];
// an order's state picks its step (anything else stays on the first)
const HE_STEP_OF = { Processada: 0, "A preparar": 1, Preparada: 2, "Em distribuição": 3, Entregue: 4 };

const heOrders = (account.orders || []).map((o, i) => ({ kind: "produtos", total: "", items: [], ...o, index: i, ...(HE_DETAILS[o.id] || {}) }));
const heCard = (account.cards || [])[0];
const heParseDate = (d) => { const [day, month, year] = d.split("/").map(Number); return new Date(year, month - 1, day); };

function heOrderHtml(o) {
  const step = HE_STEP_OF[o.status] ?? 0;
  const items = o.items.map((it) => `<div class="he-item"><img src="${it.img}" alt=""><div><p class="he-item-name"><span>${it.qty} un.</span><span class="he-item-x">x</span><span>${it.name}</span></p>`
    + `<p class="he-item-info"><span>Cor: ${it.color}</span><span>Tamanho: ${it.size}</span></p></div></div>`).join("");
  const steps = HE_STEPS.map((s, i) => `<li class="${i === step ? "is-current" : ""}"><span class="he-step-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.9" stroke-linejoin="round"><g transform="translate(12 12) scale(${s.scale || 1}) translate(-12 -12)">${s.icon}</g></svg></span><small>${s.label}</small></li>`).join("");
  return `<div class="he-order" data-he-index="${o.index}">`
    + `<button type="button" class="he-row" aria-expanded="false"><strong><svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m1 1.5 5 5 5-5"/></svg>${o.id}</strong><p>${o.date}</p><p>${o.total}</p><p>${o.status}</p></button>`
    + `<div class="he-detail" hidden>`
    + `<div class="he-section he-products"><div class="he-section-head"><p><strong>Produtos</strong> (${o.items.reduce((n, it) => n + it.qty, 0)})</p>`
    + `<a href="#" class="he-invoice" aria-label="Fatura (PDF)"><span>Fatura</span><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1"><path d="M4 1h9l4 4v14H4Z"/><path d="M13 1v4h4"/><path d="M7 15c1.5-2 3-5.5 2.6-7.3-.3-1.2-1.6-.9-1.4.4.3 2.2 3 5.2 5.3 5.6 1.4.2 1.5-1 .4-1.2-2-.3-5.2.8-6.9 2.5Z"/></svg></a></div>${items}</div>`
    + `<div class="he-section he-delivery"><p class="he-section-title"><strong>Entrega</strong></p><ol class="he-steps">${steps}</ol></div>`
    + `<div class="he-section he-payment"><p class="he-section-title"><strong>Pagamento</strong></p>`
    + `${heCard ? `<p>Cartão: xxxx xxxx xxxx ${heCard}</p>` : ""}<p>Valor: ${o.total}</p></div>`
    + `<p class="he-note">*Caso deseje alterar os dados da encomenda, por favor entre em contacto com a nossa linha de apoio 923 525 245 / <a href="mailto:linhalisbonfc@lisbonfc.pt">linhalisbonfc@lisbonfc.pt</a>.</p>`
    + `</div></div>`;
}

// the filters: kind (tab), period in months (0: all) and part of the order number
const heList = document.querySelector("[data-he-orders]");
const heNone = document.querySelector("[data-he-none]");
const heFiltersForm = document.getElementById("heFilters");
const heFiltersBtn = document.querySelector(".he-filters-btn");
let heKind = "todos";
function heRender(openIndex) {
  const months = Number(heFiltersForm.querySelector('input[name="he-period"]:checked').value);
  const search = heFiltersForm.querySelector(".he-filters-input").value.trim().toLowerCase();
  const from = new Date();
  from.setMonth(from.getMonth() - months);
  const shown = heOrders.filter((o) => (heKind === "todos" || o.kind === heKind)
    && (!months || heParseDate(o.date) >= from) && o.id.toLowerCase().includes(search));
  heList.innerHTML = shown.map(heOrderHtml).join("");
  heNone.hidden = shown.length > 0;
  if (openIndex !== undefined) {
    const order = heList.querySelector(`[data-he-index="${openIndex}"]`);
    if (order) {
      heToggle(order, true);
      order.scrollIntoView({ block: "start" });
    }
  }
}
function heToggle(order, open) {
  order.classList.toggle("is-open", open);
  order.querySelector(".he-row").setAttribute("aria-expanded", String(open));
  order.querySelector(".he-detail").hidden = !open;
}
heList.addEventListener("click", (e) => {
  const row = e.target.closest(".he-row");
  if (row) heToggle(row.parentElement, !row.parentElement.classList.contains("is-open"));
  // (no invoices to download until there's a server)
  if (e.target.closest(".he-invoice")) e.preventDefault();
});
document.querySelectorAll(".he-tab").forEach((tab) => tab.addEventListener("click", () => {
  document.querySelectorAll(".he-tab").forEach((t) => t.classList.toggle("is-active", t === tab));
  heKind = tab.dataset.heKind;
  heRender();
}));
function setFiltersOpen(open) {
  // (its top line stops where Filtros starts)
  heFiltersForm.style.setProperty("--he-filters-btn", `${heFiltersBtn.offsetWidth + 0.8}px`);
  heFiltersForm.classList.toggle("is-open", open);
  heFiltersBtn.setAttribute("aria-expanded", String(open));
}
heFiltersBtn.addEventListener("click", () => setFiltersOpen(!heFiltersForm.classList.contains("is-open")));
// Pesquisar: shows the orders for the chosen period and number, and folds the panel away
heFiltersForm.addEventListener("submit", (e) => {
  e.preventDefault();
  heRender();
  setFiltersOpen(false);
});

// opened at an order (#0, #1, ...): that one opens, with the period widened to all if it's older than 3 months
function heOpenFromHash() {
  const index = Number(location.hash.slice(1));
  if (location.hash.length < 2 || !Number.isInteger(index) || !heOrders[index]) return heRender();
  const months = Number(heFiltersForm.querySelector('input[name="he-period"]:checked').value);
  const from = new Date();
  from.setMonth(from.getMonth() - months);
  if (months && heParseDate(heOrders[index].date) < from) heFiltersForm.querySelector('input[name="he-period"][value="0"]').checked = true;
  heRender(index);
}
heOpenFromHash();
window.addEventListener("hashchange", heOpenFromHash);
