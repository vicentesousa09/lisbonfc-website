// The confirmation page (obrigado.html), opened once a payment is done: the quotas' Finalizar (quotas-faturacao.js)
// or the shop's Pagar (pagamento.js), which keep what was paid in sessionStorage "lfcLastPayment" ({ type: "quotas" or
// "loja", number }). As Benfica's: "Obrigado", the payment and the number it was registered with, and Voltar ao Site.
// Opened with nothing paid, it goes to the home page instead

let qoPaid = null;
try { qoPaid = JSON.parse(sessionStorage.getItem("lfcLastPayment")); } catch {}
if (!qoPaid) location.replace("/");
qoPaid = qoPaid || {};

document.querySelector("[data-qo-number]").textContent = qoPaid.number || "";
// a shop order: its own words, and the shop's two steps in the header (both done) in place of the quotas' three
if (qoPaid.type === "loja") {
  document.querySelector("[data-qo-what]").textContent = "A encomenda foi concluída com sucesso e ficou registada";
  document.querySelector(".qt-steps").innerHTML =
    '<li class="is-done"><span class="qt-step-name"><span class="qt-step-num">1.</span>Envio</span><small>Passo 1 de 2</small></li>'
    + '<li class="is-current"><span class="qt-step-name"><span class="qt-step-num">2.</span>Pagamento</span><small>Passo 2 de 2</small></li>';
}

// back to the top: always there, as on the quotas' steps
const qoTop = document.querySelector(".nt-top");
qoTop.hidden = false;
qoTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
