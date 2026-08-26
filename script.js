const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const mobileLanding = window.matchMedia("(max-width: 620px)").matches && document.getElementById("home");

if (mobileLanding) {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (window.location.hash && window.location.hash !== "#home") {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }

  const resetLandingScroll = () => {
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      root.style.scrollBehavior = previousScrollBehavior;
    });
  };

  resetLandingScroll();
  window.addEventListener("load", resetLandingScroll, { once: true });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) resetLandingScroll();
  });
}

function updateScale() {
  const viewportWidth = document.documentElement.clientWidth;
  if (viewportWidth > 900) {
    root.style.setProperty("--page-scale", String(viewportWidth / 1920));
  } else {
    root.style.setProperty("--page-scale", "1");
  }
}

updateScale();
window.addEventListener("resize", updateScale, { passive: true });

const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const primaryNavigation = document.querySelector(".primary-nav");

function setMobileMenu(open) {
  if (!mobileMenuToggle || !primaryNavigation) return;
  mobileMenuToggle.setAttribute("aria-expanded", String(open));
  mobileMenuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  primaryNavigation.classList.toggle("is-open", open);
}

if (mobileMenuToggle && primaryNavigation) {
  mobileMenuToggle.addEventListener("click", () => {
    setMobileMenu(mobileMenuToggle.getAttribute("aria-expanded") !== "true");
  });

  primaryNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMobileMenu(false);
  });

  document.addEventListener("pointerdown", (event) => {
    if (mobileMenuToggle.getAttribute("aria-expanded") !== "true") return;
    if (mobileMenuToggle.contains(event.target) || primaryNavigation.contains(event.target)) return;
    setMobileMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMobileMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMobileMenu(false);
  }, { passive: true });
}

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function setupCursorGrid(container, grid) {
  if (!container || !grid || !finePointer) return;

  const updateGrid = (event) => {
    if (event.pointerType === "touch") return;
    const bounds = container.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));
    grid.style.setProperty("--cursor-x", `${x}%`);
    grid.style.setProperty("--cursor-y", `${y}%`);
    container.classList.add("is-grid-active");
  };

  container.addEventListener("pointerenter", updateGrid, { passive: true });
  container.addEventListener("pointermove", updateGrid, { passive: true });
  container.addEventListener("pointerleave", () => container.classList.remove("is-grid-active"));
}

setupCursorGrid(document.querySelector(".hero"), document.querySelector(".hero-lines"));
setupCursorGrid(document.querySelector(".catalog-header"), document.querySelector(".catalog-header .hero-lines"));
setupCursorGrid(document.querySelector(".footer"), document.querySelector(".footer-lines"));

const filters = [...document.querySelectorAll(".filter")];
const products = [...document.querySelectorAll(".product-card")];
const productScroller = document.getElementById("product-scroller");

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const pageScrollX = window.scrollX;
    const pageScrollY = window.scrollY;
    filters.forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");
    const category = filter.textContent.trim().toLowerCase();
    products.forEach((product) => {
      const visible = category === "all prints" || product.dataset.category === category;
      product.hidden = !visible;
    });
    filters.forEach((item) => item.setAttribute("aria-pressed", String(item === filter)));
    requestAnimationFrame(() => {
      productScroller?.scrollTo({ left: 0, behavior: "auto" });
      productScroller?.dispatchEvent(new Event("rail:refresh"));
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(pageScrollX, pageScrollY);
      requestAnimationFrame(() => {
        window.scrollTo(pageScrollX, pageScrollY);
        root.style.scrollBehavior = previousScrollBehavior;
      });
    });
  });
});

filters.forEach((item) => item.setAttribute("aria-pressed", String(item.classList.contains("active"))));

const productModal = document.getElementById("product-modal");
const modalDialog = productModal?.querySelector(".product-modal__dialog");
const modalImage = document.getElementById("product-modal-image");
const modalCategory = document.getElementById("product-modal-category");
const modalTitle = document.getElementById("product-modal-title");
const modalDescription = document.getElementById("product-modal-description");
const modalPrice = document.getElementById("product-modal-price");
const modalQuantity = document.getElementById("product-modal-quantity");
const modalAddButton = productModal?.querySelector(".product-modal__add");
const modalAddLabel = modalAddButton?.querySelector("span");
const cartLink = document.querySelector(".cart-link");
const cartDrawer = document.getElementById("cart-drawer");
const cartPanel = cartDrawer?.querySelector(".cart-drawer__panel");
const cartItemsContainer = document.getElementById("cart-drawer-items");
const cartDrawerCount = document.getElementById("cart-drawer-count");
const cartSubtotal = document.getElementById("cart-drawer-subtotal");
const cartBuyButton = cartDrawer?.querySelector(".cart-drawer__buy");
const featureModal = document.getElementById("feature-modal");
const featureDialog = featureModal?.querySelector(".feature-modal__dialog");
const featureModalImage = document.getElementById("feature-modal-image");
const featureModalCategory = document.getElementById("feature-modal-category");
const featureModalTitle = document.getElementById("feature-modal-title");
const featureModalDescription = document.getElementById("feature-modal-description");
const featureModalWhy = document.getElementById("feature-modal-why");
const featureModalFacts = document.getElementById("feature-modal-facts");
const aboutBrandModal = document.getElementById("about-brand-modal");
const aboutBrandDialog = aboutBrandModal?.querySelector(".about-brand-modal__dialog");
let cartCount = 0;
let cartItems = [];
let quantity = 1;
let modalBasePrice = 0;
let currentProduct = null;
let lastFocusedElement = null;
let lastCartFocusedElement = null;
let lastFeatureFocusedElement = null;
let lastAboutFocusedElement = null;
let closeTimer = null;
let cartCloseTimer = null;
let featureCloseTimer = null;
let aboutCloseTimer = null;
let addedTimer = null;
let checkoutTimer = null;

const featureDetails = {
  "Textured Paper": {
    category: "Paper & finish",
    description: "A tactile surface that gives every black, line, and quiet detail more depth.",
    why: "The surface is part of the artwork. Its natural grain catches pigment softly and keeps large areas of colour rich rather than flat.",
    facts: ["250 gsm archival stock", "Acid-free and FSC-certified", "Soft, natural matte grain"],
  },
  "Premium Ink": {
    category: "Colour & contrast",
    description: "Pigment-rich inks hold deep blacks, warm neutrals, and crisp graphic edges.",
    why: "Archival pigment sits inside the paper grain instead of coating it with gloss. The result stays precise up close and powerful from across the room.",
    facts: ["Archival pigment system", "Deep, lightfast colour", "Clean high-contrast edges"],
  },
  "Frame Ready": {
    category: "Format & display",
    description: "Standard formats make the path from package to wall simple and considered.",
    why: "Every composition includes a deliberate print margin and is prepared for common frame sizes, so the artwork sits naturally without custom trimming.",
    facts: ["A4, A3 and A2 formats", "Balanced framing margins", "Fits standard frame systems"],
  },
  "Carefully Packed": {
    category: "Packing & delivery",
    description: "Protective layers keep the print clean, flat, and ready for its final space.",
    why: "Each order is checked by hand, wrapped in acid-free tissue, and secured against movement so corners and printed surfaces arrive untouched.",
    facts: ["Acid-free protective tissue", "Rigid corner protection", "Tracked dispatch in 2–4 days"],
  },
};

function selectedSizeSurcharge() {
  const selected = productModal?.querySelector('input[name="print-size"]:checked');
  return Number(selected?.dataset.surcharge || 0);
}

function updateModalPrice() {
  if (modalPrice) modalPrice.textContent = `$${modalBasePrice + selectedSizeSurcharge()}`;
}

function updateQuantity(nextQuantity) {
  quantity = Math.min(9, Math.max(1, nextQuantity));
  if (modalQuantity) modalQuantity.textContent = String(quantity);
}

function updateProductModalHeight() {
  if (!productModal || !modalDialog || productModal.hidden || window.matchMedia("(max-width: 760px)").matches) return;
  const modalContent = productModal.querySelector(".product-modal__content");
  const modalNote = productModal.querySelector(".product-modal__note");
  if (!modalContent || !modalNote) return;

  const measureContentHeight = () => {
    const contentBounds = modalContent.getBoundingClientRect();
    const noteBounds = modalNote.getBoundingClientRect();
    const bottomPadding = Number.parseFloat(getComputedStyle(modalContent).paddingBottom) || 0;
    return Math.ceil(noteBounds.bottom - contentBounds.top + bottomPadding + 12);
  };

  modalDialog.classList.remove("is-content-dense");
  modalDialog.style.setProperty("--product-modal-height", "640px");
  const availableHeight = Math.min(640, window.innerHeight - 80);
  let contentHeight = measureContentHeight();
  if (contentHeight > availableHeight) {
    modalDialog.classList.add("is-content-dense");
    contentHeight = measureContentHeight();
  }
  const targetHeight = Math.min(640, Math.max(500, contentHeight));
  modalDialog.style.setProperty("--product-modal-height", `${targetHeight}px`);
}

function openProductModal(card, trigger) {
  if (!productModal || !card) return;
  window.clearTimeout(closeTimer);
  lastFocusedElement = trigger;

  const image = card.querySelector(".product-image");
  const category = card.querySelector(".eyebrow")?.textContent.trim() || "Art print";
  const title = card.querySelector("h3")?.textContent.trim() || "Selected print";
  const description = card.querySelector(".product-copy p")?.textContent.trim() || "Limited art print on textured paper.";
  const priceText = card.querySelector(".product-buy > span")?.textContent || "$34";

  modalBasePrice = Number(priceText.match(/\d+/)?.[0] || 34);
  currentProduct = {
    title,
    category,
    image: image?.src || "./assets/drop-noisy.png",
    imageAlt: image?.alt || title,
  };
  if (modalImage) {
    modalImage.src = image?.src || "./assets/drop-noisy.png";
    modalImage.alt = image?.alt || title;
  }
  if (modalCategory) modalCategory.textContent = category;
  if (modalTitle) modalTitle.textContent = title;
  if (modalDescription) modalDescription.textContent = description;
  productModal.querySelector('input[name="print-size"][value="A4"]')?.click();
  updateQuantity(1);
  updateModalPrice();
  modalAddButton?.classList.remove("is-added");
  if (modalAddLabel) modalAddLabel.textContent = "Add to cart";

  modalDialog?.style.setProperty("--product-modal-height", "640px");
  productModal.hidden = false;
  if (modalDialog) modalDialog.scrollTop = 0;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => {
    updateProductModalHeight();
    productModal.classList.add("is-open");
    productModal.querySelector(".product-modal__close")?.focus();
  });
}

function closeProductModal() {
  if (!productModal || productModal.hidden) return;
  productModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  const finish = () => {
    productModal.hidden = true;
    lastFocusedElement?.focus();
  };
  if (reducedMotion) finish();
  else closeTimer = window.setTimeout(finish, 280);
}

document.querySelectorAll(".product-card .outline-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openProductModal(link.closest(".product-card"), link);
  });
});

productModal?.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", closeProductModal));
productModal?.querySelectorAll('input[name="print-size"]').forEach((input) => input.addEventListener("change", updateModalPrice));
productModal?.querySelector('[data-quantity="minus"]')?.addEventListener("click", () => updateQuantity(quantity - 1));
productModal?.querySelector('[data-quantity="plus"]')?.addEventListener("click", () => updateQuantity(quantity + 1));
window.addEventListener("resize", () => {
  if (productModal && !productModal.hidden) requestAnimationFrame(updateProductModalHeight);
}, { passive: true });

function openFeatureModal(card, trigger) {
  if (!featureModal || !card) return;
  window.clearTimeout(featureCloseTimer);
  lastFeatureFocusedElement = trigger;

  const image = card.querySelector(":scope > img");
  const title = card.querySelector("h3")?.textContent.trim() || "Materials & craft";
  featureDialog?.style.setProperty("--feature-modal-height", title === "Carefully Packed" ? "640px" : "585px");
  const details = featureDetails[title] || {
    category: "Materials & craft",
    description: card.querySelector("p")?.textContent.trim() || "Made with attention to every visible and invisible detail.",
    why: "Every choice is made to keep the print tactile, precise, and ready to live with for years.",
    facts: ["Carefully selected materials", "Made for long-term display", "Checked by hand"],
  };

  if (featureModalImage) {
    featureModalImage.src = image?.src || "./assets/feature-paper.png";
    featureModalImage.alt = image?.alt || title;
  }
  if (featureModalCategory) featureModalCategory.textContent = details.category;
  if (featureModalTitle) featureModalTitle.textContent = title;
  if (featureModalDescription) featureModalDescription.textContent = details.description;
  if (featureModalWhy) featureModalWhy.textContent = details.why;
  if (featureModalFacts) featureModalFacts.innerHTML = details.facts.map((fact) => `<li>${fact}</li>`).join("");

  featureModal.hidden = false;
  if (featureDialog) featureDialog.scrollTop = 0;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => {
    featureModal.classList.add("is-open");
    featureModal.querySelector(".product-modal__close")?.focus();
  });
}

function closeFeatureModal() {
  if (!featureModal || featureModal.hidden) return;
  featureModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  const finish = () => {
    featureModal.hidden = true;
    lastFeatureFocusedElement?.focus();
  };
  if (reducedMotion) finish();
  else featureCloseTimer = window.setTimeout(finish, 280);
}

document.querySelectorAll(".feature-card .outline-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openFeatureModal(link.closest(".feature-card"), link);
  });
});
featureModal?.querySelectorAll("[data-feature-close]").forEach((button) => button.addEventListener("click", closeFeatureModal));
featureModal?.querySelector(".feature-modal__cta")?.addEventListener("click", closeFeatureModal);

function openAboutBrandModal(trigger) {
  if (!aboutBrandModal) return;
  window.clearTimeout(aboutCloseTimer);
  lastAboutFocusedElement = trigger;
  aboutBrandModal.hidden = false;
  if (aboutBrandDialog) aboutBrandDialog.scrollTop = 0;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => {
    aboutBrandModal.classList.add("is-open");
    aboutBrandModal.querySelector(".product-modal__close")?.focus();
  });
}

function closeAboutBrandModal() {
  if (!aboutBrandModal || aboutBrandModal.hidden) return;
  aboutBrandModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  const finish = () => {
    aboutBrandModal.hidden = true;
    lastAboutFocusedElement?.focus();
  };
  if (reducedMotion) finish();
  else aboutCloseTimer = window.setTimeout(finish, 280);
}

document.querySelectorAll("[data-about-open]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openAboutBrandModal(link);
  });
});
aboutBrandModal?.querySelectorAll("[data-about-close]").forEach((button) => button.addEventListener("click", closeAboutBrandModal));
aboutBrandModal?.querySelector(".feature-modal__cta")?.addEventListener("click", closeAboutBrandModal);

function renderCart() {
  cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (cartLink) {
    cartLink.textContent = `Cart (${cartCount})`;
    cartLink.setAttribute("aria-label", `${cartCount} items in cart`);
  }
  if (cartDrawerCount) cartDrawerCount.textContent = `(${cartCount})`;
  if (cartSubtotal) cartSubtotal.textContent = `$${subtotal}`;
  if (cartBuyButton) cartBuyButton.disabled = cartItems.length === 0;
  if (!cartItemsContainer) return;

  if (!cartItems.length) {
    cartItemsContainer.innerHTML = '<div class="cart-drawer__empty"><strong>Your cart is empty.</strong><span>Pick a print with enough character for your wall.</span></div>';
    return;
  }

  cartItemsContainer.innerHTML = cartItems.map((item) => `
    <article class="cart-item">
      <img class="cart-item__image" src="${item.image}" alt="${item.imageAlt}" />
      <div class="cart-item__meta">
        <span>${item.category} · ${item.size}</span>
        <h3>${item.title}</h3>
        <p>$${item.price} × ${item.quantity}</p>
        <button class="cart-item__remove" type="button" data-cart-remove="${item.key}">Remove</button>
      </div>
      <strong class="cart-item__total">$${item.price * item.quantity}</strong>
    </article>
  `).join("");
}

modalAddButton?.addEventListener("click", () => {
  if (!currentProduct) return;
  const selectedSize = productModal?.querySelector('input[name="print-size"]:checked')?.value || "A4";
  const price = modalBasePrice + selectedSizeSurcharge();
  const key = `${currentProduct.title}::${selectedSize}`;
  const existing = cartItems.find((item) => item.key === key);
  if (existing) existing.quantity += quantity;
  else {
    cartItems.push({ ...currentProduct, key, size: selectedSize, price, quantity });
  }
  renderCart();
  window.clearTimeout(addedTimer);
  modalAddButton.classList.add("is-added");
  if (modalAddLabel) modalAddLabel.textContent = "Added to cart";
  addedTimer = window.setTimeout(() => {
    modalAddButton.classList.remove("is-added");
    if (modalAddLabel) modalAddLabel.textContent = "Add to cart";
  }, 1600);
});

function openCart() {
  if (!cartDrawer) return;
  window.clearTimeout(cartCloseTimer);
  lastCartFocusedElement = document.activeElement;
  renderCart();
  cartDrawer.hidden = false;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => {
    cartDrawer.classList.add("is-open");
    cartDrawer.querySelector(".cart-drawer__close")?.focus();
  });
}

function closeCart() {
  if (!cartDrawer || cartDrawer.hidden) return;
  cartDrawer.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  const finish = () => {
    cartDrawer.hidden = true;
    lastCartFocusedElement?.focus();
  };
  if (reducedMotion) finish();
  else cartCloseTimer = window.setTimeout(finish, 280);
}

cartLink?.addEventListener("click", (event) => {
  event.preventDefault();
  openCart();
});
cartDrawer?.querySelectorAll("[data-cart-close]").forEach((button) => button.addEventListener("click", closeCart));
cartItemsContainer?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-cart-remove]");
  if (!removeButton) return;
  cartItems = cartItems.filter((item) => item.key !== removeButton.dataset.cartRemove);
  renderCart();
});
cartBuyButton?.addEventListener("click", () => {
  if (!cartItems.length) return;
  window.clearTimeout(checkoutTimer);
  cartBuyButton.classList.add("is-ready");
  cartBuyButton.querySelector("span").textContent = "Ready to checkout";
  checkoutTimer = window.setTimeout(() => {
    cartBuyButton.classList.remove("is-ready");
    cartBuyButton.querySelector("span").textContent = "Buy now";
  }, 1800);
});

renderCart();

function trapDialogFocus(event, dialog) {
  if (event.key !== "Tab" || !dialog) return;
  const focusable = [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener("keydown", (event) => {
  if (productModal && !productModal.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeProductModal();
      return;
    }
    trapDialogFocus(event, modalDialog);
  } else if (featureModal && !featureModal.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeFeatureModal();
      return;
    }
    trapDialogFocus(event, featureDialog);
  } else if (aboutBrandModal && !aboutBrandModal.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAboutBrandModal();
      return;
    }
    trapDialogFocus(event, aboutBrandDialog);
  } else if (cartDrawer && !cartDrawer.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeCart();
      return;
    }
    trapDialogFocus(event, cartPanel);
  }
});

const marquee = document.querySelector(".marquee-track");
let marqueeOffset = 0;
let previousTime = performance.now();

function animateMarquee(now) {
  const delta = Math.min(now - previousTime, 32);
  previousTime = now;
  marqueeOffset -= delta * 0.035;
  if (marqueeOffset <= -670) marqueeOffset += 670;
  marquee.style.transform = `translate3d(${marqueeOffset}px, 0, 0)`;
  requestAnimationFrame(animateMarquee);
}

if (marquee && !reducedMotion) requestAnimationFrame(animateMarquee);

function setupRailScrollbar(scrollbar) {
  const scroller = document.getElementById(scrollbar.dataset.scroller);
  const thumb = scrollbar.querySelector(".rail-scrollbar-thumb");
  if (!scroller || !thumb) return;

  const update = () => {
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const trackWidth = scrollbar.clientWidth;
    const thumbWidth = Math.max(96, trackWidth * (scroller.clientWidth / scroller.scrollWidth));
    const travel = Math.max(0, trackWidth - thumbWidth);
    const progress = maxScroll ? scroller.scrollLeft / maxScroll : 0;

    scrollbar.style.setProperty("--thumb-width", `${thumbWidth}px`);
    scrollbar.style.setProperty("--thumb-x", `${travel * progress}px`);
    scrollbar.classList.toggle("is-static", maxScroll === 0);
    scrollbar.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
  };

  let pointerId = null;
  let grabOffset = 0;

  const scrollToPointer = (clientX) => {
    const track = scrollbar.getBoundingClientRect();
    const thumbWidth = thumb.getBoundingClientRect().width;
    const travel = Math.max(1, track.width - thumbWidth);
    const progress = Math.min(1, Math.max(0, (clientX - track.left - grabOffset) / travel));
    scroller.scrollLeft = progress * (scroller.scrollWidth - scroller.clientWidth);
  };

  scrollbar.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const thumbBounds = thumb.getBoundingClientRect();
    pointerId = event.pointerId;
    grabOffset = event.target === thumb ? event.clientX - thumbBounds.left : thumbBounds.width / 2;
    scrollbar.classList.add("is-dragging");
    scrollbar.setPointerCapture(pointerId);
    scrollToPointer(event.clientX);
  });

  scrollbar.addEventListener("pointermove", (event) => {
    if (event.pointerId === pointerId) scrollToPointer(event.clientX);
  });

  const stopDragging = (event) => {
    if (event.pointerId !== pointerId) return;
    scrollbar.classList.remove("is-dragging");
    pointerId = null;
  };

  scrollbar.addEventListener("pointerup", stopDragging);
  scrollbar.addEventListener("pointercancel", stopDragging);
  scrollbar.addEventListener("keydown", (event) => {
    const step = Math.max(120, scroller.clientWidth * 0.35);
    if (event.key === "ArrowLeft") scroller.scrollBy({ left: -step, behavior: "smooth" });
    else if (event.key === "ArrowRight") scroller.scrollBy({ left: step, behavior: "smooth" });
    else if (event.key === "Home") scroller.scrollTo({ left: 0, behavior: "smooth" });
    else if (event.key === "End") scroller.scrollTo({ left: scroller.scrollWidth, behavior: "smooth" });
    else return;
    event.preventDefault();
  });
  scroller.addEventListener("scroll", update, { passive: true });
  scroller.addEventListener("rail:refresh", update);
  if ("ResizeObserver" in window) new ResizeObserver(update).observe(scroller);
  else window.addEventListener("resize", update, { passive: true });
  update();
}

document.querySelectorAll(".rail-scrollbar").forEach(setupRailScrollbar);

document.querySelectorAll(".rail-scroller").forEach((scroller) => {
  let pointerId = null;
  let startX = 0;
  let startScroll = 0;

  scroller.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest("a, button")) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = scroller.scrollLeft;
    scroller.setPointerCapture(pointerId);
  });

  scroller.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) > 3) scroller.classList.add("is-dragging");
    scroller.scrollLeft = startScroll - distance;
  });

  const stopDragging = (event) => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    requestAnimationFrame(() => scroller.classList.remove("is-dragging"));
  };

  scroller.addEventListener("pointerup", stopDragging);
  scroller.addEventListener("pointercancel", stopDragging);
});

const revealSets = [
  [".section-heading", 0, 0, ""],
  [".filters-row, .story-link, .collections-link", 90, 0, "reveal-from-left"],
  [".catalog-card", 80, 70, ""],
  [".collections-market-card", 80, 70, ""],
  [".feature-card", 80, 90, ""],
  [".story-image", 150, 0, ""],
  [".cta-panel", 80, 0, ""],
  [".footer-intro, .footer-column, .footer-social, .footer-bottom", 0, 65, ""],
];

const railRevealSets = [
  ["#product-scroller", ".product-card", 100, 0],
  ["#collection-scroller", ".collection-card", 80, 0],
];

const revealItems = [];
const railRevealItems = [];

revealSets.forEach(([selector, baseDelay, stagger, extraClass]) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add("reveal-item");
    if (extraClass) element.classList.add(extraClass);
    element.style.setProperty("--reveal-delay", `${baseDelay + (index % 6) * stagger}ms`);
    revealItems.push(element);
  });
});

railRevealSets.forEach(([railSelector, itemSelector, baseDelay, stagger]) => {
  const rail = document.querySelector(railSelector);
  const items = [...document.querySelectorAll(itemSelector)];
  items.forEach((element, index) => {
    element.classList.add("reveal-item");
    element.style.setProperty("--reveal-delay", `${baseDelay + (index % 6) * stagger}ms`);
  });
  if (rail) railRevealItems.push({ rail, items });
});

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((element) => element.classList.add("is-visible"));
  railRevealItems.forEach(({ items }) => items.forEach((element) => element.classList.add("is-visible")));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -7% 0px" });

  revealItems.forEach((element) => revealObserver.observe(element));

  const railRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const group = railRevealItems.find(({ rail }) => rail === entry.target);
      group?.items.forEach((element) => element.classList.add("is-visible"));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

  railRevealItems.forEach(({ rail }) => railRevealObserver.observe(rail));
}
