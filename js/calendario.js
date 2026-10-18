const calendarioFilters = document.querySelectorAll(".calendario-filter");
const calendarioRows = document.querySelectorAll(".calendario-row");
const calendarioEmpty = document.getElementById("calendarioEmpty");
const calendarioList = document.getElementById("calendarioList");
const calendarioLoading = document.getElementById("calendarioLoading");
const calendarioSection = document.querySelector(".calendario-section");

let activeStatusFilter = "proximo";
const initialFilter = document.querySelector(".calendario-filter.active");
if (initialFilter) activeStatusFilter = initialFilter.dataset.filter;

function applyCalendarioFilters() {
  const competicaoChecked = new Set(
    [...document.querySelectorAll(".calendario-filtros-panel input[data-competicao]:checked")].map((i) => i.dataset.competicao)
  );
  const epocaChecked = new Set(
    [...document.querySelectorAll(".calendario-filtros-panel input[data-epoca]:checked")].map((i) => i.dataset.epoca)
  );

  let visibleCount = 0;
  calendarioRows.forEach((row) => {
    const statusOk = activeStatusFilter === "todos" || row.dataset.status === activeStatusFilter;
    const seasonOk = !row.dataset.season || epocaChecked.has(row.dataset.season);
    const compOk = !row.dataset.competicao || competicaoChecked.has(row.dataset.competicao);
    const show = statusOk && seasonOk && compOk;
    row.style.display = show ? "" : "none";
    if (show) visibleCount += 1;
  });
  if (calendarioEmpty) calendarioEmpty.classList.toggle("is-visible", visibleCount === 0);
  if (calendarioSection) calendarioSection.classList.toggle("calendario-section--empty", visibleCount === 0);
}

calendarioFilters.forEach((btn) => {
  btn.addEventListener("click", () => {
    calendarioFilters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeStatusFilter = btn.dataset.filter;
    applyCalendarioFilters();
  });
});

applyCalendarioFilters();

const filtrosToggle = document.getElementById("filtrosToggle");
const filtrosPanel = document.getElementById("filtrosPanel");

function closeFiltrosPanel() {
  filtrosToggle.classList.remove("is-open");
  filtrosToggle.setAttribute("aria-expanded", "false");
  filtrosPanel.classList.remove("is-open", "show-shadow");
}

if (filtrosToggle && filtrosPanel) {
  filtrosToggle.addEventListener("click", () => {
    const isOpen = filtrosToggle.classList.toggle("is-open");
    filtrosToggle.setAttribute("aria-expanded", String(isOpen));
    filtrosPanel.classList.remove("show-shadow");
    filtrosPanel.classList.toggle("is-open", isOpen);
  });

  filtrosPanel.addEventListener("transitionend", (e) => {
    if (e.propertyName === "max-height" && filtrosPanel.classList.contains("is-open")) {
      filtrosPanel.classList.add("show-shadow");
    }
  });
}

const filtrosApply = document.querySelector(".calendario-filtros-apply");
if (filtrosApply) {
  filtrosApply.addEventListener("click", () => {
    closeFiltrosPanel();
    calendarioList.hidden = true;
    calendarioLoading.hidden = false;
    setTimeout(() => {
      applyCalendarioFilters();
      calendarioLoading.hidden = true;
      calendarioList.hidden = false;
    }, 2300);
  });
}
