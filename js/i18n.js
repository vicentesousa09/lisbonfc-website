// The site's languages: Português (the pages as written, pt-PT), English, Español and Русский.
// Loaded in every page's <head>, before anything is drawn. The chosen language is kept in localStorage ("lfcLang");
// for any but Portuguese its dictionary (js/i18n/<lang>.js: the Portuguese text -> the translation) is loaded right
// away, and every text, placeholder, aria-label, title and alt on the page is swapped as the page is read, and again
// whenever a script adds or changes something (a MutationObserver), so nothing shows in Portuguese first.
// The globe (any [aria-label="Idioma"], or the footer's "PT") opens a small block against the right edge, like the
// account popup, that slides in from the right: "Escolhe o idioma", a line, and the four languages; choosing one keeps it and reloads the page in it. The footer's PT / EN / ES / RU
// boxes choose directly.
(function () {
  const LANGS = {
    pt: { name: "Português", html: "pt-PT", code: "PT" },
    en: { name: "English", html: "en", code: "EN" },
    es: { name: "Español", html: "es", code: "ES" },
    ru: { name: "Русский", html: "ru", code: "RU" },
  };
  let lang = "pt";
  try { lang = localStorage.getItem("lfcLang") || "pt"; } catch {}
  if (!LANGS[lang]) lang = "pt";

  // The language also lives in the address, right after the site: /pt-pt/, /en-us/, /es-es/, /ru-ru/ (e.g. /en-us/loja.html).
  // An address with it picks that language; one without it gets the current language's added (without reloading).
  // (The server serves the same page with or without it: /en-us/loja.html is loja.html.)
  const PREFIX = { pt: "pt-pt", en: "en-us", es: "es-es", ru: "ru-ru" };
  const prefixRe = /^\/(pt-pt|en-us|es-es|ru-ru)(?=\/|$)/i;
  const pathMatch = location.pathname.match(prefixRe);
  const barePath = location.pathname.replace(prefixRe, "") || "/";
  window.lfcPath = barePath; // the page's path without the language part
  if (/^https?:$/.test(location.protocol)) {
    if (pathMatch) {
      lang = Object.keys(PREFIX).find((k) => PREFIX[k] === pathMatch[1].toLowerCase()) || lang;
      try { localStorage.setItem("lfcLang", lang); } catch {}
    } else {
      history.replaceState(history.state, "", "/" + PREFIX[lang] + barePath + location.search + location.hash);
    }
  }
  window.lfcLang = lang;
  document.documentElement.lang = LANGS[lang].html;

  let dict = null;
  let patterns = [];
  const norm = (s) => s.replace(/\s+/g, " ").trim();

  // a text in the chosen language (the spaces around it kept), or null when there's no translation for it
  function tr(s) {
    if (!dict || !s) return null;
    const key = norm(s);
    if (!key || !/[A-Za-zÀ-ÿ]/.test(key)) return null;
    let t = Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : null;
    if (t == null) {
      for (const [re, rep] of patterns) {
        const m = key.match(re);
        if (!m) continue;
        const r = typeof rep === "function" ? rep(m, (x) => trText(x)) : key.replace(re, rep);
        // (a pattern that changed nothing lets the next ones try)
        if (r !== key) { t = r; break; }
      }
    }
    if (t == null || t === key) return null;
    return s.match(/^\s*/)[0] + t + s.match(/\s*$/)[0];
  }
  const trText = (x) => { const t = tr(x); return t == null ? x : norm(t); };
  window.lfcT = (s) => trText(s); // for scripts that want a text in the chosen language

  const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE"]);
  const ATTRS = ["placeholder", "aria-label", "title", "alt", "data-tooltip"];
  const written = new WeakMap(); // text node -> what we wrote in it (so our own writes aren't translated again)
  function skipped(el) {
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      if (SKIP.has(e.tagName) || e.getAttribute("translate") === "no" || e.isContentEditable) return true;
    }
    return false;
  }
  // (a sentence's opening article that the language has no word for, as Russian's for "A <b>nova camisola</b> ...",
  // is translated to nothing: the text that follows it then takes the capital letter)
  let capNext = false;
  function doText(node) {
    if (written.get(node) === node.data) return;
    const p = node.parentElement;
    if (!p || skipped(p)) return;
    let t = tr(node.data);
    if (t == null) { if (node.data.trim()) capNext = false; return; }
    if (capNext && t.trim()) {
      t = t.replace(/^(\s*)(\S)/, (m, ws, c) => ws + c.toLocaleUpperCase());
      capNext = false;
    } else if (!t.trim() && !node.previousSibling) capNext = true;
    written.set(node, t);
    node.data = t;
  }
  function doAttrs(el) {
    if (el.getAttribute("translate") === "no") return;
    // (the globe is found by its Portuguese label, so it's marked before that is translated)
    if (el.getAttribute("aria-label") === "Idioma") el.setAttribute("data-lang-open", "");
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (!v) continue;
      const t = tr(v);
      if (t == null) continue;
      // (the Portuguese label is kept in data-pt-label, as scripts and styles find some buttons by it)
      if (a === "aria-label" && !el.hasAttribute("data-pt-label")) el.setAttribute("data-pt-label", v);
      el.setAttribute(a, t.trim());
    }
    if (el.tagName === "INPUT" && /^(button|submit|reset)$/i.test(el.type) && el.value) {
      const t = tr(el.value);
      if (t != null) el.value = t.trim();
    }
    if (el.tagName === "META" && /^(description|og:title|og:description)$/.test(el.getAttribute("name") || el.getAttribute("property") || "")) {
      const t = tr(el.getAttribute("content") || "");
      if (t != null) el.setAttribute("content", t.trim());
    }
  }
  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) {
      if (skipped(root)) return;
      doAttrs(root);
    }
    const it = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    for (let n = it.nextNode(); n; n = it.nextNode()) {
      if (n.nodeType === 3) doText(n);
      else doAttrs(n);
    }
  }
  function doTitle() {
    const t = tr(document.title);
    if (t != null) document.title = t.trim();
  }

  // the dictionary file calls this: translate what's there, then everything added or changed later
  window.lfcI18nLoad = function (d, p) {
    dict = d || {};
    patterns = p || [];
    walk(document.documentElement);
    doTitle();
    new MutationObserver((list) => {
      for (const m of list) {
        if (m.type === "childList") {
          m.addedNodes.forEach(walk);
          if (m.target.nodeName === "TITLE") doTitle();
        } else if (m.type === "characterData") {
          if (m.target.parentNode && m.target.parentNode.nodeName === "TITLE") doTitle();
          else doText(m.target);
        } else if (m.type === "attributes") {
          doAttrs(m.target);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...ATTRS, "value", "content"] });
  };

  if (lang !== "pt") {
    const base = (document.currentScript && document.currentScript.src || "").replace(/i18n\.js(\?.*)?$/, "");
    document.write(`<script src="${base}i18n/${lang}.js"><\/script>`);
  }

  // ---- choosing the language ----
  function setLang(l) {
    if (!LANGS[l] || l === lang) return;
    try { localStorage.setItem("lfcLang", l); } catch {}
    if (/^https?:$/.test(location.protocol)) location.href = "/" + PREFIX[l] + barePath + location.search + location.hash;
    else location.reload();
  }
  window.lfcSetLang = setLang;

  let pop = null, openFor = null;
  function buildPop() {
    pop = document.createElement("div");
    pop.className = "lang-pop";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", "Escolhe o idioma");
    pop.hidden = true;
    pop.innerHTML = `<p class="lang-pop-title">Escolhe o idioma</p><ul class="lang-pop-list" role="list">${Object.entries(LANGS)
      .map(([k, v]) => `<li><button type="button" class="lang-pop-opt${k === lang ? " is-current" : ""}" data-lang="${k}" lang="${v.html}" translate="no"${k === lang ? ' aria-current="true"' : ""}>${v.name}</button></li>`)
      .join("")}</ul>`;
    pop.addEventListener("click", (e) => {
      const b = e.target.closest("[data-lang]");
      if (!b) return;
      if (b.dataset.lang === lang) closePop();
      else setLang(b.dataset.lang);
    });
    document.body.append(pop);
  }
  // against the right edge of the screen, like the account popup: from the line under the header's top row for the
  // header's globe, or just over the footer's box
  function place() {
    if (!openFor) return;
    const inHeader = openFor.closest("header, .site-header, .nh-header, .header-compact, .qt-header");
    if (inHeader && typeof window.headerTopRowBottom === "function") pop.style.top = `${window.headerTopRowBottom()}px`;
    else {
      const r = openFor.getBoundingClientRect();
      pop.style.top = r.bottom + pop.offsetHeight <= window.innerHeight ? `${r.bottom}px` : `${r.top - pop.offsetHeight}px`;
    }
  }
  function openPop(trigger) {
    if (!pop) buildPop();
    openFor = trigger;
    pop.hidden = false;
    place();
    trigger.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => pop.classList.add("is-open"));

  }
  function closePop() {
    if (!pop || pop.hidden) return;
    pop.classList.remove("is-open");
    openFor?.setAttribute("aria-expanded", "false");
    openFor = null;
    setTimeout(() => { if (!openFor) pop.hidden = true; }, 350);
  }

  document.addEventListener("click", (e) => {
    const direct = e.target.closest(".nf-langs a");
    if (direct) {
      e.preventDefault();
      setLang((direct.dataset.lang || direct.textContent).trim().toLowerCase());
      return;
    }
    const trigger = e.target.closest("[data-lang-open]");
    if (trigger) {
      e.preventDefault();
      if (openFor === trigger) closePop();
      else openPop(trigger);
      return;
    }
    if (pop && !pop.contains(e.target)) closePop();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && openFor) { const t = openFor; closePop(); t.focus(); }
  });
  window.addEventListener("resize", place);
  // it belongs to the globe, so scrolling the page closes it (as the account popup)
  window.addEventListener("scroll", () => { if (openFor) closePop(); }, { passive: true });

  // the triggers: the globe, the account header's language box and the footer's; the boxes show the language
  function markTriggers() {
    // the documents to download (Documentos/<name>-v1.pdf) have a copy in each language: <name>-v1-EN.pdf, -ES, -RU
    if (lang !== "pt") {
      document.querySelectorAll('a[href^="Documentos/"][href$=".pdf"]').forEach((a) => {
        const href = a.getAttribute("href");
        if (!/-(EN|ES|RU)\.pdf$/.test(href)) a.setAttribute("href", href.replace(/\.pdf$/, `-${LANGS[lang].code}.pdf`));
      });
    }
    document.querySelectorAll('[aria-label="Idioma"], [data-lang-open], .nh-lang, .footer-lang').forEach((el) => {
      el.setAttribute("data-lang-open", "");
      el.setAttribute("aria-haspopup", "dialog");
      el.setAttribute("aria-expanded", "false");
      if (el.matches(".nh-lang, .footer-lang")) { el.textContent = LANGS[lang].code; el.setAttribute("translate", "no"); }
    });
    document.querySelectorAll(".nf-langs").forEach((box) => {
      if (![...box.querySelectorAll("a")].some((a) => (a.dataset.lang || a.textContent.trim().toLowerCase()) === "ru")) {
        const ru = document.createElement("a");
        ru.href = "#";
        ru.textContent = "RU";
        box.append(ru);
      }
      box.setAttribute("translate", "no");
      box.querySelectorAll("a").forEach((a) => {
        const l = a.textContent.trim().toLowerCase();
        a.dataset.lang = l;
        a.classList.toggle("is-active", l === lang);
        a.setAttribute("lang", LANGS[l]?.html || l);
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", markTriggers);
  else markTriggers();
})();
