// Smooth open/close animation for <details> elements using the Web Animations API.
// Two flavors: in-flow accordions (filter groups) and absolutely-positioned
// popups (the sort dropdown), since the popup's own box doesn't affect the
// <details> element's layout height. The arrow is rotated on the same
// timeline as the content so both move together.

const DURATION = 550;
const EASING = "ease";

function animateAccordion(details) {
  const summary = details.querySelector(":scope > summary");
  const content = details.querySelector(":scope > :not(summary)");
  const arrow = summary.querySelector("svg");
  let heightAnim = null;
  let isClosing = false;
  let isExpanding = false;

  summary.addEventListener("mouseenter", () => summary.classList.add("is-hovered"));
  summary.addEventListener("mouseleave", () => summary.classList.remove("is-hovered"));

  summary.addEventListener("click", (e) => {
    e.preventDefault();
    summary.blur();
    summary.classList.add("is-active");
    if (arrow) arrow.style.color = "var(--blue)";
    details.style.overflow = "hidden";
    if (isClosing || !details.open) {
      openPanel();
    } else if (isExpanding || details.open) {
      shrinkPanel();
    }
  });

  function shrinkPanel() {
    isClosing = true;
    const startHeight = `${details.offsetHeight}px`;
    const endHeight = `${summary.offsetHeight}px`;
    run(startHeight, endHeight, [1, 0], false);
  }

  function openPanel() {
    details.style.height = `${details.offsetHeight}px`;
    details.open = true;
    window.requestAnimationFrame(expandPanel);
  }

  function expandPanel() {
    isExpanding = true;
    const startHeight = `${summary.offsetHeight}px`;
    const endHeight = `${details.scrollHeight}px`;
    run(startHeight, endHeight, [0, 1], true);
  }

  function run(startHeight, endHeight, opacity, opening) {
    if (heightAnim) heightAnim.cancel();
    heightAnim = details.animate(
      { height: [startHeight, endHeight] },
      { duration: DURATION, easing: EASING, fill: "forwards" }
    );
    if (content) {
      content.animate(
        { opacity },
        { duration: DURATION, easing: EASING, fill: "forwards" }
      );
    }
    if (arrow) {
      arrow.animate(
        { transform: opening ? ["rotate(0deg)", "rotate(180deg)"] : ["rotate(180deg)", "rotate(0deg)"] },
        { duration: DURATION, easing: EASING, fill: "forwards" }
      );
    }
    heightAnim.onfinish = () => onFinish(opening);
    heightAnim.oncancel = () => {
      isClosing = false;
      isExpanding = false;
    };
  }

  function onFinish(opening) {
    details.open = opening;
    heightAnim = null;
    isClosing = false;
    isExpanding = false;
    details.style.height = "";
    details.style.overflow = "";
  }
}

function animatePopup(details, contentSelector) {
  const summary = details.querySelector(":scope > summary");
  const content = details.querySelector(contentSelector);
  const arrow = summary.querySelector("svg");
  let animation = null;
  let isClosing = false;
  let isExpanding = false;

  summary.addEventListener("click", (e) => {
    e.preventDefault();
    content.style.overflow = "hidden";
    if (isClosing || !details.open) {
      openPanel();
    } else if (isExpanding || details.open) {
      shrinkPanel();
    }
  });

  function shrinkPanel() {
    isClosing = true;
    const startHeight = `${content.offsetHeight}px`;
    run(startHeight, "0px", [1, 0], false);
  }

  function openPanel() {
    details.open = true;
    content.style.height = "0px";
    content.style.opacity = "0";
    window.requestAnimationFrame(expandPanel);
  }

  function expandPanel() {
    isExpanding = true;
    const endHeight = `${content.scrollHeight}px`;
    run("0px", endHeight, [0, 1], true);
  }

  function run(start, end, opacity, opening) {
    if (animation) animation.cancel();
    animation = content.animate(
      { height: [start, end], opacity },
      { duration: DURATION, easing: EASING, fill: "forwards" }
    );
    if (arrow) {
      arrow.animate(
        { transform: opening ? ["rotate(0deg)", "rotate(180deg)"] : ["rotate(180deg)", "rotate(0deg)"] },
        { duration: DURATION, easing: EASING, fill: "forwards" }
      );
    }
    animation.onfinish = () => onFinish(opening);
    animation.oncancel = () => {
      isClosing = false;
      isExpanding = false;
    };
  }

  function onFinish(opening) {
    if (!opening) details.open = false;
    animation = null;
    isClosing = false;
    isExpanding = false;
    content.style.height = "";
    content.style.overflow = "";
    content.style.opacity = "";
  }
}

document.querySelectorAll("details.filter-group").forEach(animateAccordion);
document
  .querySelectorAll("details.sort-dropdown")
  .forEach((el) => animatePopup(el, ".sort-menu"));
