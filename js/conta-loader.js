// The account pages' own loading: the page darkens and a yellow square holds the crest in grey, turning blue in a smooth sweep
const loader = document.createElement("div");
loader.className = "ac-loader";
loader.hidden = true;
loader.setAttribute("role", "status");
loader.setAttribute("aria-label", "A carregar");
loader.innerHTML = `<div class="ac-loader-box"><img class="ac-loader-base" src="Logos/Logo_crest_loader.png" alt=""><img class="ac-loader-fill" src="Logos/Logo_crest_loader.png" alt=""></div>`;
document.body.append(loader);
function showLoader() {
  loader.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => loader.classList.add("is-on")));
}
function hideLoader() {
  loader.classList.remove("is-on");
  setTimeout(() => { loader.hidden = true; }, 250);
}
