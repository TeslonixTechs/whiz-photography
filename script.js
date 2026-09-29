const WHATSAPP_NUMBER = "2348063227239";

const collections = [
  { name: "Weddings", slug: "weddings", images: [] },
  { name: "Events", slug: "events", images: [] },
  { name: "Portraits", slug: "portraits", images: [] },
  { name: "Fashion", slug: "fashion", images: [] },
  { name: "Studio", slug: "studio", images: [] },
  { name: "Commercial", slug: "commercial", images: [] },
];

const galleryGrid = document.querySelector("#gallery-grid");
const lightbox = document.querySelector("#lightbox");
const lightboxContent = document.querySelector("#lightbox-content");
const lightboxCaption = document.querySelector("#lightbox-caption");
let activeCollection = null;
let activeImageIndex = 0;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function renderCollections() {
  galleryGrid.innerHTML = collections.map((collection, index) => `
    <button class="gallery-card" type="button" data-collection="${collection.slug}" aria-label="Open ${collection.name} gallery">
      <span class="gallery-art${collection.images.length ? " has-image" : ""}">
        ${collection.images.length ? `<img class="gallery-photo" src="${escapeHTML(collection.images[0].src)}" alt="" loading="lazy" decoding="async">` : ""}
        <span class="placeholder-index">COLLECTION / 0${index + 1}</span>
        <span class="placeholder-message">${collection.name.toUpperCase()}<br><em>in focus.</em></span>
        <span class="placeholder-caption">${collection.images.length ? `${collection.images.length} PHOTOGRAPHS` : "A COLLECTION IN THE MAKING"}</span>
      </span>
      <span class="gallery-meta"><strong>${collection.name}</strong><span>${String(collection.images.length).padStart(2, "0")} IMAGES</span></span>
    </button>
  `).join("");

  galleryGrid.querySelectorAll(".gallery-card").forEach((card) => {
    card.addEventListener("click", () => openCollection(card.dataset.collection));
  });
}

function openCollection(slug) {
  activeCollection = collections.find((collection) => collection.slug === slug);
  activeImageIndex = 0;
  if (!activeCollection) return;
  lightbox.showModal();
  renderLightboxImage();
}

function renderLightboxImage() {
  const images = activeCollection.images;
  const previousButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  previousButton.hidden = images.length < 2;
  nextButton.hidden = images.length < 2;

  if (images.length === 0) {
    lightboxContent.innerHTML = `
      <div class="lightbox-empty">
        <span>WHIZPHOTOGRAPHY · ${activeCollection.name.toUpperCase()}</span>
        <h2>This story is<br>waiting to be told.</h2>
        <p>We're preparing this collection. Get in touch to start a story of your own.</p>
        <a class="button button-light" href="#contact">Enquire about a session <span aria-hidden="true">↗</span></a>
      </div>`;
    lightboxContent.querySelector("a").addEventListener("click", () => lightbox.close());
    lightboxCaption.textContent = `${activeCollection.name.toUpperCase()} · OSOGBO, NIGERIA`;
    return;
  }

  const image = images[activeImageIndex];
  const avifSource = image.avif ? `<source srcset="${escapeHTML(image.avif)}" type="image/avif">` : "";
  lightboxContent.innerHTML = `<picture>${avifSource}<img src="${escapeHTML(image.src)}" alt="${escapeHTML(image.alt || activeCollection.name)}" fetchpriority="high"></picture>`;
  lightboxCaption.textContent = `${image.caption || activeCollection.name} · ${activeImageIndex + 1} / ${images.length}`;
}

function changeImage(direction) {
  if (!activeCollection || activeCollection.images.length < 2) return;
  const imageCount = activeCollection.images.length;
  activeImageIndex = (activeImageIndex + direction + imageCount) % imageCount;
  renderLightboxImage();
}

renderCollections();
document.querySelector("#current-year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    siteNav.classList.remove("is-open");
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => changeImage(-1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => changeImage(1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.open) lightbox.close();
});

const bookingForm = document.querySelector("#booking-form");
bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const formData = new FormData(bookingForm);
  const details = [
    "Hello WhizPhotography, I'd like to check availability.",
    "",
    `Name: ${formData.get("name")}`,
    `Phone / WhatsApp: ${formData.get("phone")}`,
    formData.get("email") ? `Email: ${formData.get("email")}` : "",
    `Photography type: ${formData.get("type")}`,
    formData.get("date") ? `Event date: ${formData.get("date")}` : "",
    formData.get("location") ? `Location: ${formData.get("location")}` : "",
    formData.get("message") ? `Message: ${formData.get("message")}` : "",
  ].filter(Boolean).join("\n");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(details)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  document.querySelector("#form-status").textContent = "Your enquiry is ready in WhatsApp. Send the message to complete your request.";
});