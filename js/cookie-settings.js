// Gerir Cookies: the privacy preferences popup (modelled on SL Benfica's). It opens from the footer's
// "Definições de Cookies" (any [data-cookie-settings]) and from the profile's "Gerir Cookies" button.
// perfil.html has the popup in its HTML; on every other page this script adds the same markup (js/i18n.js translates
// it as it's added). Each category opens with its +; the switches start on (or as last saved) and are kept in this
// browser ("lfcCookies") by "Confirmar as minhas escolhas"; "Aceitar apenas cookies necessários" turns them all off.
(function () {
  const ITEM_TEXTS = [
    ["Cookies estritamente necessários", null, "Estes cookies são necessários para que o website funcione e não podem ser desligados nos nossos sistemas. Normalmente, eles só são configurados em resposta a ações levadas a cabo por si e que correspondem a uma solicitação de serviços, tais como definir as suas preferências de privacidade, iniciar sessão <br class='ck-br'>ou preencher formulários. Pode configurar o seu navegador para bloquear ou <br class='ck-br'>alertá-lo(a) sobre esses cookies, mas algumas partes do website não <br class='ck-br'>funcionarão. Estes cookies não armazenam qualquer informação pessoal identificável."],
    ["Cookies de funcionalidade", "funcionalidade", "Estes cookies permitem que o site forneça uma funcionalidade e personalização melhoradas. Podem ser estabelecidos por nós ou por fornecedores externos cujos serviços adicionámos às nossas páginas. Se não permitir estes cookies algumas destas funcionalidades, ou mesmo todas, podem não atuar corretamente."],
    ["Cookies de desempenho", "desempenho", "Estes cookies permitem-nos contar visitas e fontes de tráfego, para que possamos medir e melhorar o desempenho do nosso website. Eles ajudam-nos a saber quais são as páginas mais e menos populares e a ver como os visitantes se movimentam pelo website. Todas as informações recolhidas por estes cookies são agregadas e, por conseguinte, anónimas. Se não permitir estes cookies, não saberemos quando visitou o nosso site."],
    ["Cookies de publicidade", "publicidade", "Estes cookies podem ser estabelecidos através do nosso site pelos nossos parceiros de publicidade. Podem ser usados por essas empresas para construir um perfil sobre os seus interesses e mostrar-lhe anúncios relevantes em outros websites. Eles não armazenam diretamente informações pessoais, mas são baseados na identificação exclusiva do seu navegador e dispositivo de internet. Se não permitir estes cookies, terá menos publicidade direcionada."]
  ];
  const MARKUP =
    '<div class="ck-modal" role="dialog" aria-modal="true" aria-labelledby="ckTitle">' +
      '<div class="ck-head">' +
        '<img src="Logos/Logo.png" alt="Lisbon FC" class="ck-logo">' +
        '<button type="button" class="ck-close" aria-label="Fechar"><svg viewBox="0 0 12 12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m1.5 1.5 9 9M10.5 1.5l-9 9"/></svg></button>' +
      "</div>" +
      '<div class="ck-body">' +
        '<h2 class="ck-title" id="ckTitle">Centro de preferências de privacidade</h2>' +
        '<p class="ck-text">Quando visita um website, este pode armazenar ou recolher informações no seu navegador, principalmente na forma de cookies. Esta informação pode ser sobre si, as suas preferências ou o seu dispositivo e é utilizada principalmente para fazer o website funcionar conforme o esperado. A informação normalmente não o identifica diretamente, mas pode dar-lhe uma experiência web mais personalizada. Uma vez que respeitamos o seu direito à privacidade, pode optar por não permitir alguns tipos de cookies. Clique nos cabeçalhos das diferentes categorias para saber mais e alterar as nossas configurações predefinidas. No entanto, o bloqueio de alguns tipos de cookies pode afetar a sua experiência no website e os serviços que podemos oferecer.</p>' +
        '<a href="politica-de-privacidade.html" class="ck-more">Mais informação</a>' +
        '<button type="button" class="ck-btn ck-allow" data-ck-allow hidden>Permitir todos</button>' +
        '<h3 class="ck-title ck-title--sub">Gerir preferências de cookies</h3>' +
        '<div class="ck-list">' +
        ITEM_TEXTS.map(([name, key, text]) =>
          '<div class="ck-item">' +
            '<div class="ck-item-head">' +
              '<button type="button" class="ck-toggle-info" aria-expanded="false">' + name + "</button>" +
              (key ? '<input type="checkbox" class="ck-switch" data-ck="' + key + '" aria-label="' + name + '" checked>' : '<span class="ck-always">Sempre ativos</span>') +
            "</div>" +
            '<div class="ck-item-text" hidden><p>' + text + '</p><p class="ck-item-sub">Cookies de terceiros</p></div>' +
          "</div>").join("") +
        "</div>" +
      "</div>" +
      '<div class="ck-foot">' +
        '<button type="button" class="ck-btn" data-ck-only-needed>Aceitar apenas cookies necessários</button>' +
        '<button type="button" class="ck-btn" data-ck-confirm>Confirmar as minhas escolhas</button>' +
      "</div>" +
      '<p class="ck-powered"><a href="https://www.onetrust.com/products/cookie-consent/" target="_blank" rel="noopener">Powered by <svg viewBox="0 0 24 16" aria-hidden="true"><path d="M8 1A7 7 0 0 0 8 15ZM16 1a7 7 0 0 1 0 14Z"/><rect x="10" y="1" width="4" height="14" rx="1"/></svg><b>OneTrust</b></a></p>' +
    "</div>";

  let ckOverlay = null, ckSwitches = [], ckAllowAll = null, ckFade;

  function setup() {
    ckOverlay = document.querySelector(".ck-overlay");
    if (!ckOverlay) {
      ckOverlay = document.createElement("div");
      ckOverlay.className = "ck-overlay";
      ckOverlay.hidden = true;
      ckOverlay.innerHTML = MARKUP;
      document.body.appendChild(ckOverlay);
    }
    ckSwitches = ckOverlay.querySelectorAll(".ck-switch");
    ckAllowAll = ckOverlay.querySelector("[data-ck-allow]");
    ckOverlay.querySelector(".ck-close").addEventListener("click", closeCookies);
    // a click on the dark page around it closes it too, as does Esc
    ckOverlay.addEventListener("click", (e) => { if (e.target === ckOverlay) closeCookies(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !ckOverlay.hidden) closeCookies(); });
    ckOverlay.querySelectorAll(".ck-toggle-info").forEach((b) => b.addEventListener("click", () => {
      const open = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", String(open));
      b.closest(".ck-item").querySelector(".ck-item-text").hidden = !open;
    }));
    ckOverlay.querySelector("[data-ck-only-needed]").addEventListener("click", () => {
      ckSwitches.forEach((s) => { s.checked = false; });
      saveCookies();
    });
    ckOverlay.querySelector("[data-ck-confirm]").addEventListener("click", saveCookies);
    // "Permitir todos" only shows while a switch is off; it turns them all on, saves and closes
    ckSwitches.forEach((s) => s.addEventListener("change", syncAllowAll));
    ckAllowAll.addEventListener("click", () => {
      ckSwitches.forEach((s) => { s.checked = true; });
      saveCookies();
    });
  }

  function syncAllowAll() { ckAllowAll.hidden = [...ckSwitches].every((s) => s.checked); }

  function openCookies(e) {
    if (e) e.preventDefault();
    if (!ckOverlay) setup();
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem("lfcCookies")) || {}; } catch {}
    ckSwitches.forEach((s) => { s.checked = saved[s.dataset.ck] !== false; });
    syncAllowAll();
    clearTimeout(ckFade);
    ckOverlay.classList.remove("is-closing");
    // the page behind goes back to its top, so it's there when the popup closes
    window.scrollTo({ top: 0, behavior: "instant" });
    ckOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    ckOverlay.querySelector(".ck-body").scrollTop = 0;
  }
  // it fades out first, then hides
  function closeCookies() {
    if (ckOverlay.hidden || ckOverlay.classList.contains("is-closing")) return;
    ckOverlay.classList.add("is-closing");
    ckFade = setTimeout(() => {
      ckOverlay.hidden = true;
      ckOverlay.classList.remove("is-closing");
      document.body.style.overflow = "";
    }, 500);
  }
  function saveCookies() {
    const choice = {};
    ckSwitches.forEach((s) => { choice[s.dataset.ck] = s.checked; });
    try { localStorage.setItem("lfcCookies", JSON.stringify(choice)); } catch {}
    closeCookies();
  }

  window.lfcCookieSettings = openCookies;
  document.addEventListener("click", (e) => {
    if (e.target.closest && e.target.closest("[data-cookie-settings], .pf-cs-cookies-btn")) openCookies(e);
  });
})();
