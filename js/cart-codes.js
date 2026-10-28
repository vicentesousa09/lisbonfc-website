// Promo code and gift voucher boxes (.cart-code), shared by the cart page (carrinho.html) and the payment step
// (pagamento.html); each page also has the reCAPTCHA popup markup (#captchaModal)

// A code is only checked after a reCAPTCHA. Google's public test key for now: it always passes and shows a
// "testing only" note; swap in the club's own site key (and verify the token on a server) before going live
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
// no real promo codes or gift vouchers yet, so every code is refused
const VALID_CODES = [];

const captchaModal = document.getElementById("captchaModal");
let captchaWidget = null;
let captchaForm = null;

// the reCAPTCHA script is only fetched the first time someone tries a code
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

function openCaptcha(form) {
  captchaForm = form;
  captchaModal.hidden = false;
  loadCaptcha().then(() => {
    if (captchaWidget === null) {
      captchaWidget = grecaptcha.render("captchaWidget", { sitekey: RECAPTCHA_SITE_KEY, callback: captchaPassed });
    } else {
      grecaptcha.reset(captchaWidget);
    }
  });
}
function closeCaptcha() {
  captchaModal.hidden = true;
  captchaForm = null;
}
function captchaPassed() {
  const form = captchaForm;
  // a short pause so the tick is seen before the popup goes
  setTimeout(() => {
    closeCaptcha();
    if (form) checkCode(form);
  }, 400);
}
captchaModal.addEventListener("click", (e) => {
  if (e.target === captchaModal) closeCaptcha();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !captchaModal.hidden) closeCaptcha();
});

// a refused code turns the box, its title and "Código inválido" under it red (.is-invalid in style.css)
// once a code has been checked, "Adicionar" is hidden (and switched off) until the code is changed
function checkCode(form) {
  const code = form.querySelector("input").value.trim().toUpperCase();
  form.classList.toggle("is-invalid", !VALID_CODES.includes(code));
  form.classList.add("is-checked");
  form.querySelector("button").disabled = true;
}

document.querySelectorAll(".cart-code").forEach((form) => {
  const input = form.querySelector("input");
  const button = form.querySelector("button");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim() !== "") openCaptcha(form);
  });
  // "Adicionar" only works once something is typed; typing again clears the error
  input.addEventListener("input", () => {
    form.classList.remove("is-invalid", "is-checked");
    button.disabled = input.value.trim() === "";
  });
});
