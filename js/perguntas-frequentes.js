// Perguntas Frequentes (perguntas-frequentes.html), as SL Benfica's FAQs:
// - the category boxes: a click shows that category's questions in place of the others, at once, and outlines the box
// - each question opens its answer (sliding down, the question in blue, the chevron turning); a second click closes it.
//   Several can be open at the same time, as on Benfica's
(function () {
  const boxes = document.querySelectorAll(".fq-box");
  const sections = document.querySelectorAll(".fq-section");
  boxes.forEach((box) => box.addEventListener("click", () => {
    boxes.forEach((b) => {
      const on = b === box;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    sections.forEach((s) => { s.hidden = s.dataset.cat !== box.dataset.cat; });
  }));

  document.querySelectorAll(".fq-q").forEach((q) => q.addEventListener("click", () => {
    const item = q.closest(".fq-item");
    const answer = item.querySelector(".fq-a");
    const open = !item.classList.contains("is-open");
    item.classList.toggle("is-open", open);
    q.setAttribute("aria-expanded", String(open));
    // (slides to its own height, so the speed is the same for short and long answers)
    answer.style.maxHeight = open ? answer.scrollHeight + "px" : "0px";
  }));
})();
