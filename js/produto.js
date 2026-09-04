// Variant selection (Principal / Guarda-Redes)
const pdpVariantBtns = document.querySelectorAll(".pdp-variant-btn");
const pdpTitle = document.getElementById("pdpTitle");
const pdpImgs = {
  1: document.getElementById("pdpImg1"),
  2: document.getElementById("pdpImg2"),
  3: document.getElementById("pdpImg3"),
  4: document.getElementById("pdpImg4"),
};
let pdpCurrentProduto = "principal";
pdpVariantBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    pdpVariantBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    pdpCurrentProduto = btn.dataset.produto || "principal";
    if (pdpTitle) pdpTitle.textContent = btn.dataset.title;
    [1, 2, 3, 4].forEach((n) => {
      if (pdpImgs[n]) pdpImgs[n].src = btn.dataset[`img${n}`];
    });
  });
});

// Pre-select a variant when arriving via a link like ?variante=guarda-redes
const pdpRequestedVariant = new URLSearchParams(window.location.search).get("variante");
if (pdpRequestedVariant) {
  const pdpRequestedBtn = document.querySelector(`.pdp-variant-btn[data-produto="${pdpRequestedVariant}"]`);
  if (pdpRequestedBtn) pdpRequestedBtn.click();
}

// Size selection
const pdpSizeBtns = document.querySelectorAll(".pdp-size-btn");
const pdpSizeError = document.getElementById("pdpSizeError");
const pdpPersonalizeLink = document.getElementById("pdpPersonalizeLink");
let pdpSelectedSize = null;

function pdpSetPersonalizeSize(size) {
  if (!pdpPersonalizeLink) return;
  const url = new URL(pdpPersonalizeLink.href, window.location.href);
  url.searchParams.set("tamanho", size);
  pdpPersonalizeLink.href = url.pathname + url.search;
}

function pdpShowSizeError() {
  pdpSizeBtns.forEach((b) => b.classList.add("is-error"));
  if (pdpSizeError) pdpSizeError.classList.add("is-visible");
  const pdpSizeOptions = document.getElementById("pdpSizeOptions");
  if (pdpSizeOptions) pdpSizeOptions.scrollIntoView({ behavior: "smooth", block: "center" });
}

function pdpClearSizeError() {
  pdpSizeBtns.forEach((b) => b.classList.remove("is-error"));
  if (pdpSizeError) pdpSizeError.classList.remove("is-visible");
}

pdpSizeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    pdpSizeBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    pdpSelectedSize = btn.textContent.trim();
    pdpClearSizeError();
    pdpSetPersonalizeSize(pdpSelectedSize);
  });
});

if (pdpPersonalizeLink) {
  pdpPersonalizeLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (!pdpSelectedSize) {
      pdpShowSizeError();
    } else if (window.pdpOpenPersonalize) {
      window.pdpOpenPersonalize();
    }
  });
}

// Adicionar / Comprar Já should require a selected size first
document.querySelectorAll(".pdp-add, .pdp-buy").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (!pdpSelectedSize) {
      e.preventDefault();
      pdpShowSizeError();
    }
  });
});

// Wishlist toggle (sticky bar)
const pdpStickyWishlistBtn = document.getElementById("pdpStickyWishlistBtn");
if (pdpStickyWishlistBtn) {
  pdpStickyWishlistBtn.addEventListener("click", () => {
    pdpStickyWishlistBtn.classList.toggle("is-active");
  });
}

// Quantity steppers (kept in sync between the inline row and the sticky bar)
let pdpQty = 1;
const pdpQtyValue = document.getElementById("pdpQtyValue");
const pdpStickyQtyValue = document.getElementById("pdpStickyQtyValue");
document.querySelectorAll(".pdp-qty-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const delta = parseInt(btn.dataset.qty, 10);
    pdpQty = Math.max(1, pdpQty + delta);
    if (pdpQtyValue) pdpQtyValue.textContent = pdpQty;
    if (pdpStickyQtyValue) pdpStickyQtyValue.textContent = pdpQty;
  });
});

// Mini cart toast, shown when "Adicionar" is pressed with a size selected
const pdpCartToast = document.getElementById("pdpCartToast");
const pdpCartBackdrop = document.getElementById("pdpCartBackdrop");
const pdpCartToastClose = document.getElementById("pdpCartToastClose");
const pdpCartToastImg = document.getElementById("pdpCartToastImg");
const pdpCartToastTitle = document.getElementById("pdpCartToastTitle");
const pdpCartToastMeta = document.getElementById("pdpCartToastMeta");
const pdpCartToastPriceBlock = pdpCartToast ? pdpCartToast.querySelector(".pdp-cart-toast-info .product-price") : null;
const pdpCartToastBody = pdpCartToast ? pdpCartToast.querySelector(".pdp-cart-toast-body") : null;
let pdpCartToastTimer = null;

function pdpCloseCartToast() {
  clearTimeout(pdpCartToastTimer);
  if (pdpCartToast) pdpCartToast.classList.remove("is-open");
  if (pdpCartBackdrop) pdpCartBackdrop.classList.remove("is-open");
}

function pdpOpenCartToast({ title, img, meta, showPrice, showImage = true, showTitle = true, showMeta = true }) {
  if (!pdpCartToast) return;
  if (pdpCartToastTitle) {
    pdpCartToastTitle.textContent = title || "";
    pdpCartToastTitle.hidden = !showTitle;
  }
  if (pdpCartToastImg) {
    if (img) pdpCartToastImg.src = img;
    pdpCartToastImg.hidden = !showImage;
  }
  if (pdpCartToastMeta) {
    pdpCartToastMeta.textContent = meta || "";
    pdpCartToastMeta.hidden = !showMeta;
  }
  if (pdpCartToastPriceBlock) pdpCartToastPriceBlock.hidden = !showPrice;
  if (pdpCartToastBody) pdpCartToastBody.hidden = !(showImage || showTitle || showMeta || showPrice);
  pdpCartToast.classList.toggle("is-compact", !(showImage || showTitle || showMeta || showPrice));
  pdpCartToast.classList.add("is-open");
  if (pdpCartBackdrop) pdpCartBackdrop.classList.add("is-open");
  clearTimeout(pdpCartToastTimer);
  pdpCartToastTimer = setTimeout(pdpCloseCartToast, 6000);
}

function pdpShowCartToast() {
  pdpOpenCartToast({
    title: pdpTitle ? pdpTitle.textContent : "",
    img: pdpImgs[1] ? pdpImgs[1].src : "",
    meta: `${pdpQty}x / ${pdpSelectedSize}`,
    showPrice: true,
  });
}

if (pdpCartToastClose) pdpCartToastClose.addEventListener("click", pdpCloseCartToast);

document.querySelectorAll(".pdp-add").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (pdpSelectedSize) pdpShowCartToast();
  });
});

// Bundle ("Completa a tua compra") add-to-cart modal
const bundleModal = document.getElementById("bundleModal");
const bundleModalBackdrop = document.getElementById("bundleModalBackdrop");
const bundleModalClose = document.getElementById("bundleModalClose");
const bundleModalItems = document.getElementById("bundleModalItems");

function closeBundleModal() {
  if (bundleModal) bundleModal.classList.remove("is-open");
  if (bundleModalBackdrop) bundleModalBackdrop.classList.remove("is-open");
}

function openBundleModal(includeMeias) {
  if (!bundleModal) return;
  const meiasItem = bundleModalItems.querySelector('[data-item="meias"]');
  if (meiasItem) meiasItem.hidden = !includeMeias;
  bundleModal.classList.toggle("bundle-modal--triple", includeMeias);
  bundleModal.classList.add("is-open");
  if (bundleModalBackdrop) bundleModalBackdrop.classList.add("is-open");
}

document.querySelectorAll(".bundle-box").forEach((box) => {
  const addBtn = box.querySelector(".bundle-add-btn");
  if (!addBtn) return;
  addBtn.addEventListener("click", () => {
    openBundleModal(box.classList.contains("bundle-box--second"));
  });
});

if (bundleModalClose) bundleModalClose.addEventListener("click", closeBundleModal);

function bundleClearItemError(item) {
  item.querySelectorAll(".bundle-modal-size-btn").forEach((b) => b.classList.remove("is-error"));
  const error = item.querySelector(".bundle-modal-size-error");
  if (error) error.classList.remove("is-visible");
  const sizes = item.querySelector(".bundle-modal-sizes");
  if (sizes) sizes.classList.remove("has-error");
}

function bundleShowItemError(item) {
  item.querySelectorAll(".bundle-modal-size-btn").forEach((b) => b.classList.add("is-error"));
  const error = item.querySelector(".bundle-modal-size-error");
  if (error) error.classList.add("is-visible");
  const sizes = item.querySelector(".bundle-modal-sizes");
  if (sizes) sizes.classList.add("has-error");
}

if (bundleModalItems) {
  bundleModalItems.querySelectorAll(".bundle-modal-item").forEach((item) => {
    const sizeBtns = item.querySelectorAll(".bundle-modal-size-btn");
    sizeBtns.forEach((sizeBtn) => {
      sizeBtn.addEventListener("click", () => {
        sizeBtns.forEach((b) => b.classList.remove("is-active"));
        sizeBtn.classList.add("is-active");
        bundleClearItemError(item);
      });
    });
  });
}

const bundleModalBuyAll = document.querySelector(".bundle-modal-buyall");
if (bundleModalBuyAll) {
  bundleModalBuyAll.addEventListener("click", (e) => {
    e.preventDefault();
    let firstInvalidItem = null;
    bundleModalItems.querySelectorAll(".bundle-modal-item").forEach((item) => {
      if (item.hidden) return;
      const sizeBtn = item.querySelector(".bundle-modal-size-btn.is-active");
      if (sizeBtn) {
        bundleClearItemError(item);
      } else {
        bundleShowItemError(item);
        if (!firstInvalidItem) firstInvalidItem = item;
      }
    });
    if (firstInvalidItem) {
      firstInvalidItem.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      return;
    }
    closeBundleModal();
    pdpOpenCartToast({
      showPrice: false,
      showImage: false,
      showTitle: false,
      showMeta: false,
    });
  });
}

// Accordion tabs
const pdpTabToggles = document.querySelectorAll(".pdp-tab-toggle");
pdpTabToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const panel = document.querySelector(`.pdp-tab-panel[data-panel="${toggle.dataset.tab}"]`);
    const isOpen = toggle.classList.contains("is-open");
    toggle.classList.toggle("is-open", !isOpen);
    if (panel) panel.classList.toggle("is-open", !isOpen);
  });
});

// Full details section: filter-style tabs (only one panel visible at a time)
const pdpDetailsTabBtns = document.querySelectorAll(".pdp-details-tabbtn");
pdpDetailsTabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    pdpDetailsTabBtns.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    document.querySelectorAll(".pdp-details-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === btn.dataset.tab);
    });
    const detailsGrid = document.querySelector(".pdp-details-grid");
    if (detailsGrid) detailsGrid.classList.toggle("pdp-details-grid--sheet", btn.dataset.tab === "tamanhos-full" || btn.dataset.tab === "entregas-full");
  });
});

// "Mais informações" / "Ver mais" links that should also open a specific full-details tab
document.querySelectorAll(".pdp-more-link[data-open-tab]").forEach((link) => {
  link.addEventListener("click", () => {
    const targetBtn = document.querySelector(`.pdp-details-tabbtn[data-tab="${link.dataset.openTab}"]`);
    if (targetBtn) targetBtn.click();
  });
});

// Sticky buy bar, shown once the inline buy row scrolls out of view
const pdpBuyRow = document.getElementById("pdpBuyRow");
const pdpStickyBar = document.getElementById("pdpStickyBar");
const pdpDescriptionEnd = document.querySelector(".pdp-details-section");
if (pdpBuyRow && pdpStickyBar) {
  const pdpHeaderEl = document.querySelector(".site-header");
  const pdpHeaderHeight = pdpHeaderEl ? pdpHeaderEl.offsetHeight : 0;
  let pdpStickyBarTicking = false;

  function pdpUpdateStickyBar() {
    pdpStickyBarTicking = false;
    const pastBuyRow = pdpBuyRow.getBoundingClientRect().bottom <= pdpHeaderHeight;
    const reachedDescriptionEnd = pdpDescriptionEnd ? pdpDescriptionEnd.getBoundingClientRect().bottom <= pdpHeaderHeight + 460 : false;
    pdpStickyBar.classList.toggle("is-visible", pastBuyRow && !reachedDescriptionEnd);
  }

  window.addEventListener(
    "scroll",
    () => {
      if (pdpStickyBarTicking) return;
      pdpStickyBarTicking = true;
      requestAnimationFrame(pdpUpdateStickyBar);
    },
    { passive: true }
  );
  window.addEventListener("resize", pdpUpdateStickyBar);
  pdpUpdateStickyBar();
}
