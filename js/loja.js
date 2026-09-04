if (document.querySelector("#shopHeroCarousel")) {
  initCarousel("#shopHeroCarousel", ".shop-hero-prev", ".shop-hero-next", 6500);
}

function setArrowState(prevBtn, nextBtn, current, max) {
  prevBtn.classList.toggle("is-disabled", current <= 0.5);
  nextBtn.classList.toggle("is-disabled", current >= max - 0.5);
}

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
