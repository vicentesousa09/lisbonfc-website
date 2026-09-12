const ICONS = {
  tshirt: '<path d="M9 3 5 5.2V9l2-.7V21h8V8.3l2 .7V5.2L14 3a2.2 2.2 0 0 1-4 0Z"/>',
  jacket:
    '<path d="M9 3 4.6 5.4 4 18.6 7.4 17.6 7.4 9 9 8.3V21h6V8.3l1.6.7V17.6l3.4 1L20 5.4 15 3a2.2 2.2 0 0 1-6 0Z"/><line x1="12" y1="7" x2="12" y2="21"/>',
  sock: '<path d="M9 3h6v9.5c0 .8.4 1.5 1 2l2.3 1.7c.7.5 1.2 1.3 1.2 2.2V19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V3Z"/><line x1="9" y1="7.5" x2="15" y2="7.5"/>',
  shorts: '<path d="M4 4h16v6l-1.4 10.5h-4l-.9-8.5-.9 8.5h-4L4 10V4Z"/>',
  cap: '<path d="M4 15a8 8 0 0 1 16 0Z"/><rect x="2" y="14.2" width="15" height="2.6" rx="1.3"/><circle cx="12" cy="7.3" r="1"/>',
  scarf:
    '<path d="M2 10c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-1 5-.3"/><path d="M2 13.5c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-1 5-.3"/><line x1="2" y1="10" x2="2" y2="13.5"/><line x1="22" y1="9.7" x2="22" y2="13.2"/>',
  bag: '<rect x="6" y="8" width="12" height="13" rx="3"/><rect x="8.5" y="13" width="7" height="5" rx="1.5"/><path d="M8.5 8a3.5 3.5 0 0 1 7 0"/><line x1="9" y1="4" x2="9" y2="8.5"/><line x1="15" y1="4" x2="15" y2="8.5"/>',
};

const params = new URLSearchParams(window.location.search);
const nome = params.get("nome") || "Produto do Lisbon FC";
const icone = params.get("icone") || "tshirt";
const foto = params.get("foto") || "";
const socio = params.get("socio") || "";
const adepto = params.get("adepto") || "";
const carteira = params.get("carteira") || "";
const pvp = params.get("pvp") || "";

document.title = `${nome} | Loja | Lisbon FC`;
document.getElementById("genericName").textContent = nome;
document.getElementById("genericSocio").textContent = socio || "—";
document.getElementById("genericAdepto").textContent = adepto || "—";
document.getElementById("genericPvp").textContent = pvp || "—";

const carteiraRow = document.getElementById("genericCarteiraRow");
if (carteira) {
  document.getElementById("genericCarteira").textContent = carteira;
} else if (carteiraRow) {
  carteiraRow.hidden = true;
}

if (foto) {
  document.getElementById("genericIcon").hidden = true;
  const img = document.getElementById("genericPhoto");
  img.src = foto;
  img.alt = nome;
  img.hidden = false;
} else {
  document.getElementById("genericIcon").innerHTML = ICONS[icone] || ICONS.tshirt;
}
