// Adesão (becoming a member), step 4 "Confirmação" (adesao-confirmacao.html), after Continuar on step 3
// (adesao-quotas.html). As Benfica's: "Valor a Pagar" with the inscription (the new member's name and its price), the
// periodicity and the payment method chosen on step 3, and the total. Anterior goes back to step 3; Adicionar puts the
// inscription in the cart (once) and opens it; Pagar puts it in the cart and goes on to the checkout

let acKept = null;
try { acKept = JSON.parse(sessionStorage.getItem("lfcAdesao")); } catch {}
// the earlier steps not done: back to the first, or to the quotas when only they are missing
if (!acKept) location.replace("adesao-dados-pessoais.html");
else if (!acKept.period || !acKept.method) location.replace("adesao-quotas.html");
acKept = acKept || {};

const AC_PRICE = "10,00€";
const AC_PERIODS = { mensal: "Mensal", bimestral: "Bimestral", trimestral: "Trimestral", semestral: "Semestral", anual: "Anual" };
const AC_METHODS = { "debito-direto": "Débito Direto", "cobranca-postal": "Cobrança Postal" };

document.querySelector("[data-acf-name]").textContent = acKept.name || "";
document.querySelector("[data-acf-price]").textContent = AC_PRICE;
document.querySelector("[data-acf-period]").textContent = AC_PERIODS[acKept.period] || "";
document.querySelector("[data-acf-method]").textContent = AC_METHODS[acKept.method] || "";
document.querySelector("[data-acf-total]").textContent = AC_PRICE;

// the inscription in the cart, only once (with no sizes to choose)
function acToCart() {
  if (getCartItems().some((item) => item.id === "adesao")) return;
  addToCart(1, { id: "adesao", title: "Inscrição de Sócio", img: "Logos/CartaoSocio_Inclinado.png", pvp: AC_PRICE, sizes: [] });
}
document.querySelector("[data-acf-add]").addEventListener("click", () => { acToCart(); location.href = "carrinho.html"; });
document.querySelector("[data-acf-pay]").addEventListener("click", () => { acToCart(); location.href = "checkout.html"; });

// back to the top: shown once the page has scrolled down
const acTop = document.querySelector(".nt-top");
const acShowTop = () => { acTop.hidden = window.scrollY < 300; };
window.addEventListener("scroll", acShowTop, { passive: true });
acShowTop();
acTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
