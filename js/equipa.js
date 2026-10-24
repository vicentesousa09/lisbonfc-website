const playersFilters = document.querySelectorAll(".players-filter");
const playerCards = document.querySelectorAll(".player-card");

playersFilters.forEach((btn) => {
  btn.addEventListener("click", () => {
    playersFilters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    playerCards.forEach((card) => {
      const show = filter === "todos" || card.dataset.position === filter;
      card.style.display = show ? "" : "none";
    });
  });
});

// Open with a filter already selected from the URL hash, e.g. equipa.html#tecnica (used by the menu)
const initialFilter = document.querySelector(`.players-filter[data-filter="${location.hash.slice(1)}"]`);
if (initialFilter) initialFilter.click();
