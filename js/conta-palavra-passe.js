// Conta Lisbon FC, step 2 (conta-palavra-passe.html): "Iniciar Sessão" stays grey until a password is typed,
// the eye shows or hides it, and the password is checked

const pass = document.getElementById("acPass");
const submit = document.querySelector(".ac-pass-form .ac-btn");
pass.addEventListener("input", () => { submit.disabled = pass.value === ""; });

const eye = document.querySelector(".ac-eye");
eye.addEventListener("click", () => {
  const show = pass.type === "password";
  pass.type = show ? "text" : "password";
  eye.setAttribute("aria-label", show ? "Esconder palavra-passe" : "Mostrar palavra-passe");
  eye.classList.toggle("is-on", show);
});

// One demo account until there is a real server: sócio nº 4 or its e-mail, with its password. Only SHA-256 hashes are
// kept here, but this is NOT real security (anyone can read this file); real sign-in has to be checked on a server
const DEMO_IDS = [
  "ff15f500295b5a879081ecac3d8c5affd3f24626673de44db96e77e48847d199",
  "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
];
const DEMO_PASS = "469b55d18eb71272ec8f01d9be3946f0ed573267c713d4c453c6e4792c64aac7";
async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const form = document.querySelector(".ac-pass-form");
const error = form.querySelector(".ac-error");
// typing again clears the red
pass.addEventListener("input", () => {
  form.classList.remove("is-invalid");
  error.hidden = true;
});

// right: the loader plays and the session is kept, then the home page opens; wrong: the box goes red with the message
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!pass.value) return;
  let id = "";
  try { id = sessionStorage.getItem("acLoginId") || ""; } catch {}
  const ok = DEMO_IDS.includes(await sha256(id)) && (await sha256(pass.value)) === DEMO_PASS;
  if (!ok) {
    form.classList.add("is-invalid");
    error.hidden = false;
    return;
  }
  showLoader();
  setTimeout(() => {
    try {
      // (the demo account: its name, for the initials in the header, its contacts, saved card and orders for the profile,
      // and member since 2025, as on its card)
      localStorage.setItem("lfcSession", JSON.stringify({
        socio: "4", name: "Vicente Sousa", email: "vicentebsousa@gmail.com", phone: "+351960414665", cards: ["1836"],
        orders: [
          { id: "6XIT9C1V9T", date: "19/09/2026", status: "Processada" },
          { id: "APP-MF-D5094980826", date: "07/08/2026", status: "Processada" },
        ],
        since: new Date(2025, 0, 1).getTime(),
      }));
      sessionStorage.removeItem("acLoginId");
    } catch {}
    location.href = "/";
  }, 1600);
});
