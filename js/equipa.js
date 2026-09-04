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
