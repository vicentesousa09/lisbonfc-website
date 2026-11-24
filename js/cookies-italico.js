// Cookie policy: inside each section, the words "website(s)" and "browser(s)" are set in italics (and the same words in
// the chosen language). Run once the page is translated (js/i18n.js), so the dictionary still sees whole sentences.
(function () {
  const WORDS = {
    pt: /\b(websites?|browsers?)\b/gi,
    en: /\b(websites?|browsers?)\b/gi,
    es: /\b(sitios? web|navegador(?:es)?)\b/gi,
    ru: /(веб-сайт[а-яё]*|браузер[а-яё]*)/gi
  };
  // (words left upright: "a maioria dos browsers" and "a generalidade dos browsers" in section 4)
  const KEEP = {
    pt: /(maioria|generalidade) dos $/i,
    en: /most (modern )?$/i,
    es: /mayoría de los $/i,
    ru: /большинств[оа] (современных )?$/i
  };
  function run() {
    const re = WORDS[window.lfcLang] || WORDS.pt;
    const keep = KEEP[window.lfcLang] || KEEP.pt;
    document.querySelectorAll(".terms-acc-inner").forEach((box) => {
      const nodes = [];
      const it = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
      for (let n = it.nextNode(); n; n = it.nextNode()) {
        if (!n.parentElement.closest("a, em, i")) nodes.push(n);
      }
      nodes.forEach((n) => {
        re.lastIndex = 0;
        if (!re.test(n.data)) return;
        re.lastIndex = 0;
        const frag = document.createDocumentFragment();
        let last = 0;
        for (const m of n.data.matchAll(re)) {
          if (keep.test(n.data.slice(0, m.index))) continue;
          frag.append(n.data.slice(last, m.index));
          const em = document.createElement("em");
          em.textContent = m[0];
          frag.append(em);
          last = m.index + m[0].length;
        }
        frag.append(n.data.slice(last));
        n.replaceWith(frag);
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
