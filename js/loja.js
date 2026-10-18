if (document.querySelector("#shopHeroCarousel")) {
  initCarousel("#shopHeroCarousel", ".shop-hero-prev", ".shop-hero-next", 6500);
}

function setArrowState(prevBtn, nextBtn, current, max) {
  prevBtn.classList.toggle("is-disabled", current <= 0.5);
  nextBtn.classList.toggle("is-disabled", current >= max - 0.5);
}

// Lets the user click-and-drag a horizontally scrollable row instead of only
// using the arrow buttons. Behaves like a slide/carousel drag: a small drag
// snaps straight back to the current card, and crossing a threshold snaps
// forward/back exactly one card (never a free-form in-between position).
// `getStep` returns the current card width + gap. `onDragEnd` receives the
// row's settled (snapped) scrollLeft so the caller can resync whatever
// "target" variable its own arrow logic tracks (arrow clicks animate via
// scrollTo rather than trusting scrollLeft mid-animation, so that tracked
// value would otherwise go stale after a drag).
function attachDragScroll(row, getStep, onDragEnd) {
  if (!row) return;
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let moved = false;
  // Only a drag that actually lands on a different card should eat the
  // following click. A plain click always has a few pixels of hand jitter
  // between mousedown and mouseup, which would otherwise wrongly count as a
  // "drag" and make every product/collection un-clickable.
  let suppressClick = false;

  function onDown(e) {
    isDown = true;
    moved = false;
    row.classList.add("is-dragging");
    // CSS scroll-behavior:smooth (used for the arrow buttons) would otherwise
    // animate every single scrollLeft write below, fighting the next one and
    // making the drag feel laggy/stuck. Switch to instant scrolling for the
    // duration of the drag; the final snap below explicitly asks for a
    // smooth animation regardless of this setting.
    row.style.scrollBehavior = "auto";
    startX = e.pageX;
    scrollStart = row.scrollLeft;
    // Note: deliberately NOT calling e.preventDefault() here — doing so also
    // blocks the plain click that should open the product/collection when
    // the user isn't actually dragging. Native image/link ghost-dragging is
    // suppressed via the -webkit-user-drag CSS property instead.
  }
  function onMove(e) {
    if (!isDown) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 3) moved = true;
    row.scrollLeft = scrollStart - dx;
  }
  function onUp() {
    if (!isDown) return;
    isDown = false;
    row.classList.remove("is-dragging");
    row.style.scrollBehavior = "";

    const hardMax = row.scrollWidth - row.clientWidth;
    const step = getStep ? getStep() : 0;
    let target = scrollStart;

    if (moved && step > 0) {
      const dragged = row.scrollLeft - scrollStart;
      // Crossing ~1/5 of a card's width is enough to commit to the next/prev
      // card, rather than requiring a full card-width drag.
      if (Math.abs(dragged) > step * 0.2) {
        target = scrollStart + (dragged > 0 ? step : -step);
      }
    }
    target = Math.min(Math.max(target, 0), hardMax);
    suppressClick = target !== scrollStart;
    row.classList.toggle("at-end", target >= hardMax - 0.5);
    row.scrollTo({ left: target, behavior: "smooth" });
    if (onDragEnd) onDragEnd(target);
  }

  row.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  row.addEventListener("mouseleave", () => {
    if (isDown) onUp();
  });
  // A drag that actually snapped to a different card shouldn't also fire the
  // card's link underneath the cursor.
  row.addEventListener(
    "click",
    (e) => {
      if (suppressClick) {
        suppressClick = false;
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
}

// Generic "peek at end" scroll row, shared by any row of equal-width cards
// with a prev/next arrow pair (used by the Moda product rows).
function initScrollRow(rowId, cardSelector, prevSelector, nextSelector) {
  const row = document.getElementById(rowId);
  if (!row) return;
  const firstCard = row.querySelector(cardSelector);
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);
  if (!firstCard || !prevBtn || !nextBtn) return;

  function step() {
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  }

  let target = row.scrollLeft;
  let preEndScroll = null;

  setArrowState(prevBtn, nextBtn, target, row.scrollWidth - row.clientWidth);

  nextBtn.addEventListener("click", () => {
    const hardMax = row.scrollWidth - row.clientWidth;
    const nextTarget = target + step();
    if (nextTarget >= hardMax - 0.5) {
      if (!row.classList.contains("at-end")) preEndScroll = target;
      target = hardMax;
      row.classList.add("at-end");
    } else {
      target = nextTarget;
      row.classList.remove("at-end");
    }
    setArrowState(prevBtn, nextBtn, target, hardMax);
    row.scrollTo({ left: target, behavior: "smooth" });
  });
  prevBtn.addEventListener("click", () => {
    if (row.classList.contains("at-end") && preEndScroll !== null) {
      target = preEndScroll;
      preEndScroll = null;
    } else {
      target = Math.max(target - step(), 0);
    }
    row.classList.remove("at-end");
    const hardMax = row.scrollWidth - row.clientWidth;
    setArrowState(prevBtn, nextBtn, target, hardMax);
    row.scrollTo({ left: target, behavior: "smooth" });
  });

  attachDragScroll(row, step, (scrollLeft) => {
    target = scrollLeft;
    preEndScroll = null;
    setArrowState(prevBtn, nextBtn, target, row.scrollWidth - row.clientWidth);
  });
}

initScrollRow("tshirtsPolosRow", ".product-card", ".tshirts-polos-prev", ".tshirts-polos-next");
initScrollRow("treinoRow", ".product-card", ".treino-prev", ".treino-next");
initScrollRow("calcoesRow", ".product-card", ".calcoes-prev", ".calcoes-next");

const collectionsRow = document.getElementById("collectionsRow");
if (collectionsRow) {
  const firstCard = collectionsRow.querySelector(".collection-card");
  const collectionsPrevBtn = document.querySelector(".collections-prev");
  const collectionsNextBtn = document.querySelector(".collections-next");

  function cardStep() {
    const gap = parseFloat(getComputedStyle(collectionsRow).columnGap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  }

  // Track the intended scroll target ourselves instead of reading
  // collectionsRow.scrollLeft, which can still be mid-animation (and
  // therefore off a clean card boundary) if the user clicks again before
  // the previous smooth scroll has settled.
  let targetScroll = collectionsRow.scrollLeft;

  // The clean (peeking) position we were at right before the final,
  // shorter-than-a-full-step jump to the true end. Lets "prev" undo exactly
  // that last partial step instead of a full card-step, so the last card
  // goes back to peeking instead of disappearing.
  let preEndScroll = null;

  setArrowState(collectionsPrevBtn, collectionsNextBtn, targetScroll, collectionsRow.scrollWidth - collectionsRow.clientWidth);

  collectionsNextBtn.addEventListener("click", () => {
    const hardMax = collectionsRow.scrollWidth - collectionsRow.clientWidth;
    const nextTarget = targetScroll + cardStep();
    if (nextTarget >= hardMax - 0.5) {
      // Only capture the pre-end position the moment we first reach it;
      // clicking "next" again while already at the end must not overwrite
      // it with the end position itself.
      if (!collectionsRow.classList.contains("at-end")) preEndScroll = targetScroll;
      targetScroll = hardMax;
      collectionsRow.classList.add("at-end");
    } else {
      targetScroll = nextTarget;
      collectionsRow.classList.remove("at-end");
    }
    setArrowState(collectionsPrevBtn, collectionsNextBtn, targetScroll, hardMax);
    collectionsRow.scrollTo({ left: targetScroll, behavior: "smooth" });
  });
  collectionsPrevBtn.addEventListener("click", () => {
    if (collectionsRow.classList.contains("at-end") && preEndScroll !== null) {
      targetScroll = preEndScroll;
      preEndScroll = null;
    } else {
      targetScroll = Math.max(targetScroll - cardStep(), 0);
    }
    collectionsRow.classList.remove("at-end");
    const hardMax = collectionsRow.scrollWidth - collectionsRow.clientWidth;
    setArrowState(collectionsPrevBtn, collectionsNextBtn, targetScroll, hardMax);
    collectionsRow.scrollTo({ left: targetScroll, behavior: "smooth" });
  });

  attachDragScroll(collectionsRow, cardStep, (scrollLeft) => {
    targetScroll = scrollLeft;
    preEndScroll = null;
    setArrowState(collectionsPrevBtn, collectionsNextBtn, targetScroll, collectionsRow.scrollWidth - collectionsRow.clientWidth);
  });
}

const outletRow = document.getElementById("outletRow");
if (outletRow) {
  const outletCards = outletRow.querySelectorAll(".outlet-card");
  const outletPrevBtn = document.querySelector(".outlet-prev");
  const outletNextBtn = document.querySelector(".outlet-next");
  let outletTarget = 0;

  function outletStep() {
    const gap = parseFloat(getComputedStyle(outletRow).columnGap) || 0;
    return outletCards[0].getBoundingClientRect().width + gap;
  }

  setArrowState(outletPrevBtn, outletNextBtn, outletTarget, outletRow.scrollWidth - outletRow.clientWidth);

  outletNextBtn.addEventListener("click", () => {
    const hardMax = outletRow.scrollWidth - outletRow.clientWidth;
    outletTarget = Math.min(outletTarget + outletStep(), hardMax);
    setArrowState(outletPrevBtn, outletNextBtn, outletTarget, hardMax);
    outletRow.scrollTo({ left: outletTarget, behavior: "smooth" });
  });
  outletPrevBtn.addEventListener("click", () => {
    outletTarget = Math.max(outletTarget - outletStep(), 0);
    const hardMax = outletRow.scrollWidth - outletRow.clientWidth;
    setArrowState(outletPrevBtn, outletNextBtn, outletTarget, hardMax);
    outletRow.scrollTo({ left: outletTarget, behavior: "smooth" });
  });

  attachDragScroll(outletRow, outletStep, (scrollLeft) => {
    outletTarget = scrollLeft;
    setArrowState(outletPrevBtn, outletNextBtn, outletTarget, outletRow.scrollWidth - outletRow.clientWidth);
  });
}

const categoryRow = document.getElementById("categoryRow");
if (categoryRow) {
  const firstCategoryCard = categoryRow.querySelector(".category-card");
  const categoryPrevBtn = document.querySelector(".category-prev");
  const categoryNextBtn = document.querySelector(".category-next");

  function categoryStep() {
    const gap = parseFloat(getComputedStyle(categoryRow).columnGap) || 0;
    return firstCategoryCard.getBoundingClientRect().width + gap;
  }

  let categoryTargetScroll = categoryRow.scrollLeft;
  let categoryPreEndScroll = null;

  setArrowState(categoryPrevBtn, categoryNextBtn, categoryTargetScroll, categoryRow.scrollWidth - categoryRow.clientWidth);

  categoryNextBtn.addEventListener("click", () => {
    const hardMax = categoryRow.scrollWidth - categoryRow.clientWidth;
    const nextTarget = categoryTargetScroll + categoryStep();
    if (nextTarget >= hardMax - 0.5) {
      if (!categoryRow.classList.contains("at-end")) categoryPreEndScroll = categoryTargetScroll;
      categoryTargetScroll = hardMax;
      categoryRow.classList.add("at-end");
    } else {
      categoryTargetScroll = nextTarget;
      categoryRow.classList.remove("at-end");
    }
    setArrowState(categoryPrevBtn, categoryNextBtn, categoryTargetScroll, hardMax);
    categoryRow.scrollTo({ left: categoryTargetScroll, behavior: "smooth" });
  });
  categoryPrevBtn.addEventListener("click", () => {
    if (categoryRow.classList.contains("at-end") && categoryPreEndScroll !== null) {
      categoryTargetScroll = categoryPreEndScroll;
      categoryPreEndScroll = null;
    } else {
      categoryTargetScroll = Math.max(categoryTargetScroll - categoryStep(), 0);
    }
    categoryRow.classList.remove("at-end");
    const hardMax = categoryRow.scrollWidth - categoryRow.clientWidth;
    setArrowState(categoryPrevBtn, categoryNextBtn, categoryTargetScroll, hardMax);
    categoryRow.scrollTo({ left: categoryTargetScroll, behavior: "smooth" });
  });

  attachDragScroll(categoryRow, categoryStep, (scrollLeft) => {
    categoryTargetScroll = scrollLeft;
    categoryPreEndScroll = null;
    setArrowState(categoryPrevBtn, categoryNextBtn, categoryTargetScroll, categoryRow.scrollWidth - categoryRow.clientWidth);
  });
}

const outletTimers = document.querySelectorAll("[data-outlet-timer]");
if (outletTimers.length) {
  const saleEnd = new Date();
  saleEnd.setDate(saleEnd.getDate() + 18);

  function updateOutletTimers() {
    const diff = saleEnd - new Date();
    if (diff <= 0) {
      outletTimers.forEach((el) => (el.textContent = "0 dias 00:00:00"));
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = String(Math.floor((diff / 3600000) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
    const text = `${days} dias ${hours}:${minutes}:${seconds}`;
    outletTimers.forEach((el) => (el.textContent = text));
  }

  updateOutletTimers();
  setInterval(updateOutletTimers, 1000);
}
