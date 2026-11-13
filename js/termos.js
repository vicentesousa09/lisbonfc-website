// Termos e Condições: each numbered section opens and closes from its title (several can be open at once), and a link
// straight to one (e.g. termos-vendas.html#seccao-9) opens it. Opening, the section grows smoothly from nothing to its
// full height, pushing the line under it down (its clauses fade in, in style.css); closing, it shrinks back
const reduceTermsMotion = matchMedia("(prefers-reduced-motion: reduce)");
document.querySelectorAll(".terms-acc-head").forEach((head) => {
  head.addEventListener("click", () => setTermsSection(head, head.getAttribute("aria-expanded") !== "true"));
});
function setTermsSection(head, open, smooth = true) {
  const body = document.getElementById(head.getAttribute("aria-controls"));
  const section = head.closest(".terms-acc");
  head.setAttribute("aria-expanded", String(open));
  clearTimeout(body.timer);
  if (!smooth || reduceTermsMotion.matches) {
    section.classList.toggle("is-open", open);
    body.hidden = !open;
    body.style.height = "";
    return;
  }
  // from its current height to the new one, then back to its natural height (or hidden); the section is shown (still
  // see-through) before it's marked open, so its text can fade in
  const from = open && body.hidden ? 0 : body.offsetHeight;
  body.hidden = false;
  void body.offsetHeight;
  section.classList.toggle("is-open", open);
  body.style.height = "auto";
  const to = open ? body.offsetHeight : 0;
  body.style.height = `${from}px`;
  void body.offsetHeight;
  body.style.height = `${to}px`;
  body.timer = setTimeout(() => {
    body.style.height = "";
    body.hidden = !open;
  }, 420);
}
function openTermsFromHash() {
  const section = location.hash && document.getElementById(location.hash.slice(1));
  if (!section || !section.classList.contains("terms-acc")) return;
  setTermsSection(section.querySelector(".terms-acc-head"), true, false);
  section.scrollIntoView();
}
openTermsFromHash();
window.addEventListener("hashchange", openTermsFromHash);
// Scrolling down from the banner, the sections slide up into place together as they come into view; scrolling back up
// until they're out of sight below, they slide back down, ready to come up again (no movement for someone who'd rather
// have less, or when the page opens straight on a section)
const termsSections = document.querySelector(".terms-sections");
if (termsSections && !reduceTermsMotion.matches && !location.hash && "IntersectionObserver" in window) {
  termsSections.classList.add("is-waiting");
  new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) termsSections.classList.remove("is-waiting");
    // (only once they're gone below the screen, not when scrolled past them at the bottom)
    else if (entry.boundingClientRect.top > 0) termsSections.classList.add("is-waiting");
  }, { rootMargin: "0px 0px -80px 0px" }).observe(termsSections);
}
// The version note at the very bottom slides up on its own, a moment after it comes into view, and back down when
// scrolled away below again
const versionNote = document.querySelector(".terms-version-note");
if (versionNote && !reduceTermsMotion.matches && "IntersectionObserver" in window) {
  versionNote.classList.add("is-waiting");
  new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) versionNote.classList.remove("is-waiting");
    else if (entry.boundingClientRect.top > 0) versionNote.classList.add("is-waiting");
  }, { rootMargin: "0px 0px -40px 0px" }).observe(versionNote);
}
