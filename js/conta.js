// Conta Lisbon FC: the notice closes, the two tabs switch, and each form goes from its first field to the next step
// (the yellow crest loader plays in between); every button stays grey until its field has something in it

document.querySelector(".ac-notice-close").addEventListener("click", () => {
  document.getElementById("acNotice").hidden = true;
});

const tabs = document.querySelectorAll(".ac-tab");
const panels = document.querySelectorAll(".ac-panel");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.toggle("is-active", t === tab);
      t.setAttribute("aria-selected", String(t === tab));
    });
    panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === tab.dataset.tab));
    updateSide();
  });
});

// what each first field accepts: a member number (Iniciar Sessão only), an e-mail or a phone number
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isPhone = (v) => /^(\+?351)?9\d{8}$/.test(v.replace(/\s/g, "")) || /^\+\d{8,15}$/.test(v.replace(/\s/g, ""));
const isMember = (v) => /^\d{1,8}$/.test(v);
const isValid = (panel, v) => isEmail(v) || isPhone(v) || (panel === "login" && isMember(v));

// Before the first step goes on, a reCAPTCHA. Google's public test key for now (as in cart-codes.js): it always passes
// and shows a "testing only" note; swap in the club's own site key (and verify the token on a server) before going live
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
// the reCAPTCHA script is only fetched the first time someone presses the button
let captchaScript = null;
function loadCaptcha() {
  if (!captchaScript) {
    captchaScript = new Promise((resolve) => {
      window.onCaptchaLoad = resolve;
      const s = document.createElement("script");
      s.src = "https://www.google.com/recaptcha/api.js?onload=onCaptchaLoad&render=explicit&hl=pt-PT";
      s.async = true;
      document.head.appendChild(s);
    });
  }
  return captchaScript;
}

// the right column: the account perks, or (Criar Conta with a code sent) just the "code sent" note
const sentNote = document.querySelector(".ac-sent-note");
const perks = document.querySelector(".ac-side-perks");
function updateSide() {
  const sent = document.querySelector('.ac-panel.is-active[data-panel="register"] .ac-step.is-active[data-step="2"]') !== null;
  sentNote.hidden = !sent;
  perks.hidden = sent;
}

// "registo aqui" in the error opens the Criar Conta tab
document.querySelectorAll("[data-go]").forEach((b) => {
  b.addEventListener("click", () => document.querySelector(`.ac-tab[data-tab="${b.dataset.go}"]`).click());
});

panels.forEach((form) => {
  const steps = form.querySelectorAll(".ac-step");
  const current = () => form.querySelector(".ac-step.is-active");

  const showStep = (n) => {
    steps.forEach((s) => s.classList.toggle("is-active", s.dataset.step === String(n)));
    const input = current().querySelector(".ac-input:not(:disabled)");
    if (input) input.focus();
  };

  // each step's button lights up once its field is filled
  steps.forEach((step) => {
    const input = step.querySelector(".ac-input:not(:disabled)");
    const btn = step.querySelector(".ac-btn");
    input.addEventListener("input", () => {
      btn.disabled = input.value.trim() === "";
      // typing again clears the red
      step.classList.remove("is-invalid");
      const error = step.querySelector(".ac-error");
      if (error) error.hidden = true;
    });
  });

  // the first click shows the reCAPTCHA above the button; once it's ticked, the form carries on by itself
  const captchaBox = form.querySelector(".ac-captcha");
  let captchaWidget = null;
  let captchaPassed = false;
  const askCaptcha = () => {
    captchaBox.hidden = false;
    loadCaptcha().then(() => {
      if (captchaWidget !== null) return;
      captchaWidget = grecaptcha.render(captchaBox.firstElementChild, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: () => {
          captchaPassed = true;
          // a short pause so the tick is seen before moving on
          setTimeout(() => form.requestSubmit(), 400);
        },
        "expired-callback": () => { captchaPassed = false; },
      });
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const step = current();
    const input = step.querySelector(".ac-input:not(:disabled)");
    if (!input.value.trim()) return;
    // Criar Conta, code step: no codes are really sent yet, so any code goes on to choosing the password
    if (step.dataset.step === "2" && form.dataset.panel === "register") {
      showLoader();
      setTimeout(() => {
        try { sessionStorage.setItem("acRegId", form.querySelector("[data-who]").value); } catch {}
        location.href = "conta-criar-palavra-passe.html";
      }, 1600);
      return;
    }
    if (step.dataset.step !== "1") return;
    if (!captchaPassed) {
      askCaptcha();
      return;
    }
    // not a valid number/e-mail/phone: the box and its label turn red, with the message under the box
    if (!isValid(form.dataset.panel, input.value.trim())) {
      step.classList.add("is-invalid");
      step.querySelector(".ac-error").hidden = false;
      return;
    }
    // first step: the page darkens under the yellow crest loader, then Iniciar Sessão opens the password page,
    // Criar Conta its code step
    showLoader();
    setTimeout(() => {
      if (form.dataset.panel === "login") {
        // the password page checks the password against this (kept for the tab only, never in the address)
        try { sessionStorage.setItem("acLoginId", input.value.trim().toLowerCase()); } catch {}
        location.href = "conta-palavra-passe.html";
        return;
      }
      hideLoader();
      step.classList.remove("is-active");
      // Criar Conta: the e-mail/phone goes greyed into step 2, and the right column shows only the "code sent" note
      const sentTo = input.value.trim();
      const byPhone = !isEmail(sentTo);
      form.querySelectorAll("[data-who]").forEach((el) => { el.value = sentTo; });
      form.querySelector("[data-channel]").textContent = byPhone ? "SMS" : "E-MAIL";
      document.querySelector("[data-sent-to]").textContent = byPhone ? "telemóvel" : "e-mail";
      showStep(2);
      updateSide();
    }, 1600);
  });

  // "Enviar Novo Código por E-MAIL/SMS": a short "Código reenviado" in its place, then back
  const resend = form.querySelector("[data-resend]");
  if (resend) {
    resend.addEventListener("click", () => {
      const html = resend.innerHTML;
      resend.textContent = "Código reenviado";
      resend.disabled = true;
      setTimeout(() => { resend.innerHTML = html; resend.disabled = false; }, 2500);
    });
  }

  const eye = form.querySelector(".ac-eye");
  if (eye) {
    eye.addEventListener("click", () => {
      const pass = eye.previousElementSibling;
      const show = pass.type === "password";
      pass.type = show ? "text" : "password";
      eye.setAttribute("aria-label", show ? "Esconder palavra-passe" : "Mostrar palavra-passe");
      eye.classList.toggle("is-on", show);
    });
  }
});

// coming back from the password page with the browser's back button: start clean, not on the loader
window.addEventListener("pageshow", (e) => {
  if (e.persisted) location.reload();
});

// (from "Inscreve-te agora." on the contacts page: the Criar Conta tab open)
if (location.hash === "#registo") document.querySelector('.ac-tab[data-tab="register"]')?.click();
