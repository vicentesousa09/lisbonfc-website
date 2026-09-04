const bioText = document.getElementById("playerBioText");
const bioToggle = document.getElementById("playerBioToggle");

// Size the collapsed biography to show exactly the first paragraph plus a
// small peek of the second, regardless of how long each player's first
// paragraph is (measured live rather than guessed with a fixed height).
function fitBioCollapsedHeight() {
  if (!bioText) return;
  const firstP = bioText.querySelector("p:first-child");
  if (!firstP) return;
  const marginBottom = parseFloat(getComputedStyle(firstP).marginBottom) || 0;
  const peek = 50;
  bioText.style.maxHeight = firstP.offsetHeight + marginBottom + peek + "px";
}

if (bioToggle && bioText) {
  const fitCollapsed = () => {
    if (!bioText.classList.contains("expanded")) fitBioCollapsedHeight();
  };
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitCollapsed);
  } else {
    fitCollapsed();
  }
  window.addEventListener("resize", fitCollapsed);

  bioToggle.addEventListener("click", () => {
    const expanded = bioText.classList.toggle("expanded");
    if (expanded) {
      bioText.style.maxHeight = "";
    } else {
      fitBioCollapsedHeight();
    }
    bioToggle.querySelector(".player-bio-toggle-label").textContent = expanded ? "Ver menos" : "Ver mais";
    bioToggle.querySelector(".player-bio-toggle-icon").textContent = expanded ? "−" : "+";
  });
}

// Scale the big background jersey number so its glyph ink exactly fills
// the hero box height, top to bottom. SVG's own getBBox() on <text>
// includes font ascent/descent padding, not the true visual ink bounds,
// so measure the real ink extents with Canvas measureText() instead.
function fitHeroNumber() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  document.querySelectorAll(".player-hero-number svg").forEach((svg) => {
    const text = svg.querySelector("text");
    if (!text) return;
    const str = text.textContent;
    const style = getComputedStyle(text);
    const refSize = 200;
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${refSize}px ${style.fontFamily}`;
    const m = ctx.measureText(str);
    const left = -m.actualBoundingBoxLeft;
    const right = m.actualBoundingBoxRight;
    const top = -m.actualBoundingBoxAscent;
    const bottom = m.actualBoundingBoxDescent;
    const width = right - left;
    const height = bottom - top;
    if (width > 0 && height > 0) {
      // The SVG's own coordinate space is what the viewBox measures in,
      // so the rendered glyph must use the same font-size (in user units)
      // as the canvas reference measurement above, or the two won't match.
      text.setAttribute("font-size", String(refSize));
      text.setAttribute("x", "0");
      text.setAttribute("y", "0");
      svg.setAttribute("viewBox", `${left} ${top} ${width} ${height}`);
    }
  });
}

if (document.querySelector(".player-hero-number svg")) {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitHeroNumber);
  } else {
    fitHeroNumber();
  }
  window.addEventListener("resize", fitHeroNumber);
}

// Related news row: arrow buttons + click-and-drag scrolling
const relatedRow = document.getElementById("playerRelatedRow");
const relatedPrev = document.querySelector(".player-related-prev");
const relatedNext = document.querySelector(".player-related-next");

const relatedProgressBar = document.getElementById("playerRelatedProgressBar");

if (relatedRow && relatedPrev && relatedNext) {
  const cardStep = () => {
    const card = relatedRow.querySelector(".news-card");
    const gap = parseFloat(getComputedStyle(relatedRow).gap) || 0;
    return card ? card.getBoundingClientRect().width + gap : 260;
  };

  function updateRelatedArrows() {
    const maxScroll = relatedRow.scrollWidth - relatedRow.clientWidth - 1;
    relatedPrev.classList.toggle("is-disabled", relatedRow.scrollLeft <= 0);
    relatedNext.classList.toggle("is-disabled", relatedRow.scrollLeft >= maxScroll);

    if (relatedProgressBar) {
      const visibleRatio = relatedRow.clientWidth / relatedRow.scrollWidth;
      const widthPct = Math.min(100, visibleRatio * 100 * 0.3);
      const scrollableWidth = relatedRow.scrollWidth - relatedRow.clientWidth;
      const scrolledRatio = scrollableWidth > 0 ? relatedRow.scrollLeft / scrollableWidth : 0;
      const leftPct = scrolledRatio * (100 - widthPct);
      relatedProgressBar.style.width = `calc(${widthPct}% + 8px)`;
      relatedProgressBar.style.left = `calc(${leftPct}% - 4px)`;
    }
  }

  relatedPrev.addEventListener("click", () => {
    relatedRow.scrollBy({ left: -cardStep() });
  });
  relatedNext.addEventListener("click", () => {
    relatedRow.scrollBy({ left: cardStep() });
  });
  relatedRow.addEventListener("scroll", updateRelatedArrows);
  window.addEventListener("resize", updateRelatedArrows);
  updateRelatedArrows();

  // Click-and-drag scrolling (mouse only; touch/trackpad already scroll natively)
  let isDragging = false;
  let dragMoved = false;
  let startX = 0;
  let startScroll = 0;

  relatedRow.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragMoved = false;
    relatedRow.classList.add("is-dragging");
    startX = e.pageX;
    startScroll = relatedRow.scrollLeft;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const delta = e.pageX - startX;
    if (Math.abs(delta) > 4) dragMoved = true;
    relatedRow.scrollLeft = startScroll - delta;
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    relatedRow.classList.remove("is-dragging");
  });

  // Prevent the drag from triggering a click-through to a card link
  relatedRow.addEventListener(
    "click",
    (e) => {
      if (dragMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
}
