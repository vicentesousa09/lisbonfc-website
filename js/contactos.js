// Contactos (apoio/contactos.html), modelled on SL Benfica's contacts page.
// - signed in: the member number, name, e-mail and phone come filled in from the account (as Benfica's)
// - "Ver mais" opens each block on the right (the chevron turns)
// - Enviar: every starred box filled in and the box ticked (an empty one turns red), then the success page
(function () {
  const form = document.querySelector(".ct-form");
  if (!form) return;
  const $ = (id) => document.getElementById(id);

  // the phone's country: the site's flag picker (paises.js, as on the Débito Direto pages): the flag, the code and a
  // triangle; clicked, the short list of countries (Portugal and Spain first)
  const hasCountries = typeof COUNTRIES !== "undefined" && typeof makePicker === "function";
  const phoneCode = $("ctPhoneCode");
  const dialOf = () => (hasCountries && COUNTRIES.find((c) => c.iso === phoneCode.value)?.dial) || "351";
  const setPhoneCountry = (iso) => {
    if (!hasCountries) return;
    if (!COUNTRIES.some((c) => c.iso === iso)) iso = "PT";
    phoneCode.value = iso;
    phoneCode.closest(".ac-tel-code").querySelector(".ac-flag").src = flagUrl(iso);
    document.querySelector("[data-ct-dial]").textContent = "+" + dialOf();
  };
  if (hasCountries) {
    COUNTRIES.forEach((c) => phoneCode.add(new Option(c.label + " (+" + c.dial + ")", c.iso)));
    phoneCode.value = "PT";
    makePicker(phoneCode, phoneCode.closest(".ac-tel-code"), phoneCode.closest(".ac-tel"), true, true);
    phoneCode.addEventListener("change", () => { document.querySelector("[data-ct-dial]").textContent = "+" + dialOf(); });
  }

  let session = null;
  try { session = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
  // (the member number takes digits only)
  $("ctSocio").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/D/g, ""); });

  // not signed in (as Benfica's): no form, just the two links, to make an account or become a member
  if (!session) {
    form.hidden = true;
    document.querySelector(".ct-noform").hidden = false;
  }
  if (session) {
    $("ctSocio").value = session.socio || "";
    // (not a member: no "N.º de Sócio" row, the form starts with the name)
    if (!session.socio) $("ctSocio").closest(".ct-row").hidden = true;
    $("ctName").value = (session.name || "").toLocaleUpperCase("pt");
    $("ctEmail").value = session.email || "";
    // (its country from the code it starts with; the rest as "960 414 665")
    let digits = (session.phone || "").replace(/\D/g, "");
    const from = hasCountries ? COUNTRIES.filter((c) => digits.startsWith(c.dial) && digits.length > c.dial.length + 6)
      .sort((x, y) => y.dial.length - x.dial.length)[0] : null;
    setPhoneCountry(from ? from.iso : "PT");
    if (from) digits = digits.slice(from.dial.length);
    $("ctPhone").value = digits.length === 9 ? digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") : digits;
  }

  // the map: Google's own interactive map (Maps JavaScript API), as on Benfica's: drag it freely, Google's Mapa |
  // Satélite, ecrã inteiro, camera control and the person (dropped on a street, Street View opens in the map), with
  // Benfica's red marker fixed on PlayArena Belém. If the key ever fails (an address it isn't allowed on, the daily cap
  // reached), Google's plain embedded map shows instead, so the box is never empty
  const mapBox = document.getElementById("ctMap");
  if (mapBox) {
    const KEY = "AIzaSyCBQrmNsGJIAHAsYbNtI2jApfdyhPeoehY";
    const AT = { lat: 38.7003007, lng: -9.1959238 };
    const LANG = { pt: "pt-PT", en: "en", es: "es", ru: "ru" }[window.lfcLang] || "pt-PT";
    const canvas = mapBox.querySelector(".ct-map-canvas");
    let fellBack = false;
    const fallback = () => {
      if (fellBack) return;
      fellBack = true;
      canvas.innerHTML = '<iframe title="Mapa: Play Arena Belém" referrerpolicy="no-referrer-when-downgrade" loading="lazy" ' +
        'src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1100!2d-9.1959238!3d38.7003007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1' +
        '!3m3!1m2!1s0xd1ecbcffa7dea97%3A0x1d2f9b95b8b59173!2sPlayArena%20Bel%C3%A9m!5e0!3m2!1s' + LANG + '!2spt!4v1700000000000"></iframe>';
    };
    // (Google calls this when the key is refused)
    window.gm_authFailure = fallback;
    window.lfcInitMap = () => {
      try {
        const map = new google.maps.Map(canvas, {
          center: AT,
          zoom: 17,
          mapTypeControl: true,
          mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR, position: google.maps.ControlPosition.TOP_LEFT },
          fullscreenControl: true,
          streetViewControl: true,
          cameraControl: true,
          zoomControl: false,
          rotateControl: false,
          gestureHandling: "cooperative",
          clickableIcons: true
        });
        // Benfica's red marker (a red drop with a white ring), its tip on the place
        const pin = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 50"><path d="M19 49.2C17.6 46.4 2 31.6 2 18.6a17 17 0 0 1 34 0c0 13-15.6 27.8-17 30.6Z" fill="#014AAD"/><circle cx="19" cy="18.6" r="9" fill="#fff"/><circle cx="19" cy="18.6" r="6.4" fill="#014AAD"/></svg>';
        new google.maps.Marker({
          position: AT,
          map,
          title: "Play Arena Belém",
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(pin),
            scaledSize: new google.maps.Size(44, 58),
            anchor: new google.maps.Point(22, 58)
          }
        });
      } catch (e) { fallback(); }
    };
    const s = document.createElement("script");
    s.src = "https://maps.googleapis.com/maps/api/js?key=" + KEY + "&callback=lfcInitMap&loading=async&language=" + LANG + "&region=PT";
    s.async = true;
    s.onerror = fallback;
    document.head.appendChild(s);
  }

  // "Ver mais": the block slides open (pushing the line under it down) and slides shut again
  document.querySelectorAll(".ct-acc-head").forEach((b) => b.addEventListener("click", () => {
    const body = b.nextElementSibling;
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", String(open));
    b.closest(".ct-acc").classList.toggle("is-open", open);
    if (open) {
      body.hidden = false;
      body.style.height = "0px";
      requestAnimationFrame(() => { body.style.height = body.scrollHeight + "px"; });
    } else {
      body.style.height = body.scrollHeight + "px";
      requestAnimationFrame(() => { body.style.height = "0px"; });
    }
    const done = (e) => {
      if (e.propertyName !== "height") return;
      body.removeEventListener("transitionend", done);
      if (b.getAttribute("aria-expanded") === "true") body.style.height = "";
      else body.hidden = true;
    };
    body.addEventListener("transitionend", done);
  }));

  const required = ["ctName", "ctEmail", "ctPhone", "ctMessage"].map($);
  form.addEventListener("input", (e) => {
    e.target.classList.remove("is-invalid");
    const note = $(e.target.id + "Err");
    if (note) note.hidden = true;
  });
  $("ctConsent").addEventListener("change", () => $("ctConsent").closest(".ct-check").classList.remove("is-invalid"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = required.filter((i) => !i.value.trim() || (i.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value.trim())));
    bad.forEach((i) => i.classList.add("is-invalid"));
    // (a red note under each box that is missing: "* Por favor insira ..."; an e-mail typed wrong says so)
    required.forEach((i) => { $(i.id + "Err").hidden = !bad.includes(i); });
    $("ctEmailErr").textContent = $("ctEmail").value.trim() ? "* Por favor insira um e-mail válido" : "* Por favor insira o e-mail";
    const consent = $("ctConsent").checked;
    $("ctConsent").closest(".ct-check").classList.toggle("is-invalid", !consent);
    // (nothing is clicked into for you: the red boxes and the note show what is missing)
    if (bad.length || !consent) return;
    // everything filled in: straight to the success page (as Benfica's). There's no server yet, so the message isn't
    // sent anywhere; once there is, it gets posted to it here, before going on
    location.href = "apoio/contactos/success";
  });
})();
