// Pagamento de Quotas (quotas.html), opened by Pagar Quotas on the profile. Step 1, as Benfica's: the member number
// and ID document, filled in from the account when signed in; Seguinte checks them (and, signed in, that they're the
// account's own) before the quotas step

let qtSession = null;
try { qtSession = JSON.parse(localStorage.getItem("lfcSession")); } catch {}
const qtMember = document.getElementById("qtMember");
const qtDoc = document.getElementById("qtDoc");
if (qtSession) {
  qtMember.value = qtSession.socio || "";
  qtDoc.value = qtSession.personal?.docnumber || "";
}

// the member number takes digits only; typing in a box clears its message
qtMember.addEventListener("input", () => { qtMember.value = qtMember.value.replace(/\D/g, ""); });
const qtForm = document.querySelector(".qt-form");
qtForm.addEventListener("input", (e) => e.target.closest(".qt-field")?.classList.remove("is-invalid"));

// Seguinte: both filled in (and, signed in, matching the account's); a wrong one shows its message under the box
qtForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const member = qtMember.value.trim();
  const doc = qtDoc.value.trim();
  const ownDoc = qtSession?.personal?.docnumber;
  const wrong = {
    member: !member || (qtSession?.socio && member !== String(qtSession.socio)),
    doc: !doc || (ownDoc && doc.toLowerCase() !== ownDoc.toLowerCase()),
  };
  Object.entries(wrong).forEach(([name, bad]) => qtForm.querySelector(`[data-field="${name}"]`).classList.toggle("is-invalid", !!bad));
  if (wrong.member || wrong.doc) return;
  try { sessionStorage.setItem("lfcQuotasMember", member); } catch {}
  openCaptcha();
});

// the reCAPTCHA (Google's test key until the site has its own: it always lets through), big in the middle of the
// screen; ticked, the quotas step opens. A click on the veil around it or Esc closes it
const QT_CAPTCHA_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const qtCaptcha = document.querySelector("[data-qt-captcha]");
let qtCaptchaId = null;
function openCaptcha() {
  qtCaptcha.hidden = false;
  document.body.style.overflow = "hidden";
  if (!window.grecaptcha?.render) return;
  if (qtCaptchaId === null) {
    qtCaptchaId = grecaptcha.render("qtRecaptcha", {
      sitekey: QT_CAPTCHA_KEY,
      callback: () => setTimeout(() => { location.href = "quotas-valores.html"; }, 400),
    });
  } else grecaptcha.reset(qtCaptchaId);
}
function closeCaptcha() {
  qtCaptcha.hidden = true;
  document.body.style.overflow = "";
}
// (the reCAPTCHA script arrived after Seguinte: it's drawn now)
window.qtCaptchaReady = () => { if (!qtCaptcha.hidden) openCaptcha(); };
qtCaptcha.addEventListener("click", (e) => { if (e.target === qtCaptcha) closeCaptcha(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !qtCaptcha.hidden) closeCaptcha(); });

// back to the top: always there on this short page, as on Benfica's
const qtTop = document.querySelector(".nt-top");
qtTop.hidden = false;
qtTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
