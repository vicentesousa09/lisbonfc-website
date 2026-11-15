// Lisbon FC TV's live page (lisbon-fc-tv-direto.html) is only for signed-in accounts. Without one, the page is left at
// once for the account page (conta.html: sign in or register), which brings the person back here once signed in
// (sessionStorage "lfcAfterLogin", read by conta-palavra-passe.js and conta-confirmar.js)
(function () {
  let signedIn = false;
  try { signedIn = localStorage.getItem("lfcSession") !== null; } catch {}
  if (signedIn) return;
  try { sessionStorage.setItem("lfcAfterLogin", location.pathname.replace(/^\//, "") + location.search); } catch {}
  location.replace("conta.html");
})();
