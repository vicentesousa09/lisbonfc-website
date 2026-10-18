const lightbox = document.getElementById("noticiaLightbox");
const lightboxImg = document.getElementById("noticiaLightboxImg");
const lightboxClose = document.getElementById("noticiaLightboxClose");
const lightboxGallery = document.getElementById("noticiaLightboxGallery");
const lightboxPause = document.getElementById("noticiaLightboxPause");
const lightboxPrev = document.getElementById("noticiaLightboxPrev");
const lightboxNext = document.getElementById("noticiaLightboxNext");
const lightboxProgress = document.getElementById("noticiaLightboxProgress");
const lightboxProgressFill = document.getElementById("noticiaLightboxProgressFill");
const lightboxThumbs = document.getElementById("noticiaLightboxThumbs");
const lightboxCounter = document.getElementById("noticiaLightboxCounter");
const lightboxToolbar = document.getElementById("noticiaLightboxToolbar");
const lightboxTopFade = document.getElementById("noticiaLightboxTopFade");
const lightboxCaption = document.getElementById("noticiaLightboxCaption");

const LIGHTBOX_INTERVAL_MS = 4500;
let lightboxImages = [];
let lightboxCaptions = [];
let lightboxIndex = 0;
let lightboxTimer = null;
let lightboxPaused = false;

function showLightboxImage() {
  lightboxImg.src = lightboxImages[lightboxIndex];
  lightboxCaption.textContent = lightboxCaptions[lightboxIndex] || "";
  updateLightboxProgress();
  updateLightboxThumbs();
  updateLightboxCounter();
}

function updateLightboxCounter() {
  lightboxCounter.innerHTML = lightboxImages.length > 1
    ? `<strong>${lightboxIndex + 1}</strong>/${lightboxImages.length}`
    : "";
}

function buildLightboxThumbs() {
  lightboxThumbs.innerHTML = "";
  lightboxImages.forEach((src, i) => {
    const thumb = document.createElement("div");
    thumb.className = "noticia-lightbox-thumb";
    thumb.style.backgroundImage = `url('${src}')`;
    thumb.addEventListener("click", (e) => {
      e.stopPropagation();
      lightboxIndex = i;
      showLightboxImage();
      if (!lightboxPaused) startLightboxRotation();
    });
    lightboxThumbs.appendChild(thumb);
  });
}

function updateLightboxThumbs() {
  [...lightboxThumbs.children].forEach((thumb, i) => {
    thumb.classList.toggle("is-active", i === lightboxIndex);
  });
}

function toggleLightboxThumbs() {
  lightboxThumbs.classList.toggle("is-open");
}

function updateLightboxProgress() {
  lightboxProgress.hidden = lightboxImages.length <= 1;
  const pct = ((lightboxIndex + 1) / lightboxImages.length) * 100;
  lightboxProgressFill.style.width = pct + "%";
}

function startLightboxRotation() {
  stopLightboxRotation();
  if (lightboxImages.length > 1) {
    lightboxTimer = setInterval(() => {
      lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      showLightboxImage();
    }, LIGHTBOX_INTERVAL_MS);
  }
}

function stopLightboxRotation() {
  if (lightboxTimer) {
    clearInterval(lightboxTimer);
    lightboxTimer = null;
  }
}

function showLightboxProgressBar() {
  lightboxProgress.classList.add("is-visible");
  lightboxToolbar.classList.add("is-visible");
  lightboxCounter.classList.add("is-visible");
  lightboxTopFade.classList.add("is-visible");
}

function hideLightboxProgressBar() {
  lightboxProgress.classList.remove("is-visible");
  lightboxToolbar.classList.remove("is-visible");
  lightboxCounter.classList.remove("is-visible");
  lightboxTopFade.classList.remove("is-visible");
}

function setLightboxPauseIcon(paused) {
  lightboxPause.classList.toggle("is-paused", paused);
  lightboxPause.setAttribute("aria-label", paused ? "Retomar" : "Pausar");
}

function toggleLightboxPause() {
  lightboxPaused = !lightboxPaused;
  if (lightboxPaused) {
    stopLightboxRotation();
  } else {
    startLightboxRotation();
  }
  setLightboxPauseIcon(lightboxPaused);
}

function openLightbox(images, startIndex, captions = []) {
  lightboxImages = images;
  lightboxCaptions = captions;
  lightboxIndex = startIndex;
  lightboxPaused = false;
  setLightboxPauseIcon(false);
  buildLightboxThumbs();
  lightboxThumbs.classList.remove("is-open");
  showLightboxImage();
  lightbox.hidden = false;
  startLightboxRotation();
  showLightboxProgressBar();
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (document.fullscreenElement) document.exitFullscreen();
  lightbox.hidden = true;
  lightboxImg.src = "";
  lightboxThumbs.classList.remove("is-open");
  stopLightboxRotation();
  document.body.style.overflow = "";
}

function toggleLightboxFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else if (lightbox.requestFullscreen) {
    lightbox.requestFullscreen().catch(() => {});
  }
}

function showPrevImage() {
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  showLightboxImage();
  if (!lightboxPaused) startLightboxRotation();
}

function showNextImage() {
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  showLightboxImage();
  if (!lightboxPaused) startLightboxRotation();
}

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxGallery) lightboxGallery.addEventListener("click", (e) => { e.stopPropagation(); toggleLightboxThumbs(); });
if (lightboxPause) lightboxPause.addEventListener("click", (e) => { e.stopPropagation(); toggleLightboxPause(); });
if (lightboxPrev) lightboxPrev.addEventListener("click", (e) => { e.stopPropagation(); showPrevImage(); });
if (lightboxNext) lightboxNext.addEventListener("click", (e) => { e.stopPropagation(); showNextImage(); });
if (lightboxImg) lightboxImg.addEventListener("click", (e) => { e.stopPropagation(); toggleLightboxFullscreen(); });
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener("mousemove", showLightboxProgressBar);
  lightbox.addEventListener("mouseleave", hideLightboxProgressBar);
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
});
