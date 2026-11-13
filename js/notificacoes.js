// Notificações (notificacoes.html), opened by "Gerir Notificações" on the profile's Preferências. With the browser's
// notifications blocked it only says so; otherwise a Não/Sim for notifications and one per subject

// The subjects, in groups (Lisbon FC's: no tickets, partners or other sports). Every choice starts on Sim and is kept
// in this browser (lfcNotifications) until there's a server
const NT_GROUPS = [
  { title: "Futebol", items: ["Equipa Principal"] },
  { title: "Match Center", items: ["Comentários", "Fim de primeira parte", "Fim de segunda parte", "Golos", "11 inicial", "Início de jogo", "Substituição"] },
  { title: "Comercial", items: ["Sócios", "Produtos Oficiais"] },
  { title: "Clube", items: ["Institucional"] },
];
let ntPrefs = {};
try { ntPrefs = JSON.parse(localStorage.getItem("lfcNotifications")) || {}; } catch {}
if (typeof ntPrefs !== "object" || ntPrefs === null) ntPrefs = {};
const saveNtPrefs = () => { try { localStorage.setItem("lfcNotifications", JSON.stringify(ntPrefs)); } catch {} };

const ntRow = (label, name, on) => `<div class="nt-row"><p>${label}</p>`
  + `<label class="pf-radio"><input type="radio" name="${name}" value="nao" data-label="${label}"${on ? "" : " checked"}><span>Não</span></label>`
  + `<label class="pf-radio"><input type="radio" name="${name}" value="sim" data-label="${label}"${on ? " checked" : ""}><span>Sim</span></label></div>`;
const ntGroups = document.querySelector("[data-nt-groups]");
let ntIndex = 0;
ntGroups.innerHTML = NT_GROUPS.map((g) => `<div class="nt-group"><p class="nt-group-title">${g.title}</p>`
  + g.items.map((label) => ntRow(label, `nt-${ntIndex++}`, ntPrefs[label] !== false)).join("") + `</div>`).join("");
ntGroups.addEventListener("change", (e) => {
  ntPrefs[e.target.dataset.label] = e.target.value === "sim";
  saveNtPrefs();
});

// which version shows: blocked by the browser, or the choices (the subjects stay whatever the answer to the question)
const ntBlocked = document.querySelector("[data-nt-blocked]");
const ntOn = document.querySelector("[data-nt-on]");
const ntAll = document.querySelectorAll('input[name="nt-all"]');
function showNotifications() {
  const blocked = !("Notification" in window) || Notification.permission === "denied";
  ntBlocked.hidden = !blocked;
  ntOn.hidden = blocked;
  const on = ntPrefs.all !== false;
  ntAll.forEach((r) => { r.checked = r.value === (on ? "sim" : "nao"); });
}
showNotifications();
// Sim asks the browser for permission the first time; refused, the page turns to the blocked version
ntAll.forEach((r) => r.addEventListener("change", async () => {
  ntPrefs.all = r.value === "sim";
  saveNtPrefs();
  if (ntPrefs.all && Notification.permission === "default") await Notification.requestPermission();
  showNotifications();
}));
