// Adesão (becoming a member), step 2 "Família" (adesao-familia.html), after Continuar on step 1
// (adesao-dados-pessoais.html). As Benfica's: "Criar Família" and a table headed "Nome" with the new member (the profile icon
// and the name typed on step 1); someone under 18 can't create a family, so the note says so.
// Anterior goes back to step 1 (its details kept); Continuar goes on to step 3, Quotas

let afStep1 = null;
try { afStep1 = JSON.parse(sessionStorage.getItem("lfcAdesao")); } catch {}
// step 1 not done: back to it
if (!afStep1) location.replace("adesao-dados-pessoais.html");
afStep1 = afStep1 || {};

// the new member: the name in capitals (the picture is always the profile icon, Logos/blank-profile-lfc.png)
document.querySelector("[data-af-name]").textContent = (afStep1.name || "").toLocaleUpperCase("pt");

// under 18 (by the birth date of step 1): the note that a family needs someone older
const [d, m, y] = (afStep1.birth || "").split("/").map(Number);
if (y) {
  const now = new Date();
  const age = now.getFullYear() - y - (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d) ? 1 : 0);
  document.querySelector("[data-af-minor]").hidden = age >= 18;
}

// Continuar: the family (only the new member for now) kept with the details, for the next step, Quotas
const afForm = document.querySelector(".af-form");
afForm.addEventListener("submit", (e) => {
  e.preventDefault();
  try { sessionStorage.setItem("lfcAdesao", JSON.stringify({ ...afStep1, family: [] })); } catch {}
  // on to step 3, Quotas
  location.href = "adesao-quotas.html";
});

// back to the top: shown once the page has scrolled down
const afTop = document.querySelector(".nt-top");
const afShowTop = () => { afTop.hidden = window.scrollY < 300; };
window.addEventListener("scroll", afShowTop, { passive: true });
afShowTop();
afTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
