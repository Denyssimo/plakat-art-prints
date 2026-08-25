const collectionCatalogs = {
  typography: {
    number: "01",
    title: "Typography",
    description: "Bold type-led posters for rooms that need a stronger voice.",
    items: [
      ["Noisy Silence", "drop-noisy.png", 34, "Bold type and rough texture with a direct, uncompromising voice."],
      ["Type Speaks", "collection-type.png", 36, "Oversized letterforms worn into paper and built to hold a wall."],
      ["Loud Type", "collection-type.png", 40, "Compressed lettering made to read from across the room."],
      ["Signal / Noise", "collection-street.png", 43, "Layered words and fragments arranged like an analog transmission."],
      ["Words Become Walls", "drop-noisy.png", 38, "A dense typographic study of scale, rhythm, and repetition."],
      ["Heavy Letter", "collection-type.png", 46, "Architectural letterforms with weight, grain, and quiet tension."],
    ],
  },
  abstract: {
    number: "02",
    title: "Abstract",
    description: "Expressive shapes, brush marks, and visual tension printed with raw character.",
    items: [
      ["Black Motion", "drop-motion.png", 42, "Expressive brush strokes, deep blacks, and raw visual energy."],
      ["Ink Orbit", "collection-abstract.png", 46, "A sweeping black gesture suspended in textured space."],
      ["Raw Gesture", "drop-motion.png", 39, "Fast marks and open paper held in deliberate imbalance."],
      ["Collision", "collection-street.png", 44, "Fragments, paint, and pressure meeting in one rough composition."],
      ["Black Current", "collection-abstract.png", 48, "A circular ink movement with grain, tension, and momentum."],
      ["Still Energy", "feature-ink.png", 41, "Colour bands and dark forms reduced to their essential rhythm."],
    ],
  },
  street: {
    number: "03",
    title: "Street",
    description: "Raw posters inspired by graffiti, city walls, stickers, and underground visual culture.",
    items: [
      ["Raw Signal", "collection-street.png", 41, "Street marks, fragments, and visual noise pressed into paper."],
      ["Night Paste", "collection-type.png", 37, "A torn typographic layer inspired by posters after dark."],
      ["Wall Echo", "drop-noisy.png", 35, "Worn ink and repeated words carrying the memory of a city wall."],
      ["Sticker Code", "collection-street.png", 43, "Symbols, tags, and pasted fragments stacked into a visual code."],
      ["City Noise", "drop-motion.png", 45, "Fast black strokes shaped by movement, pressure, and concrete."],
      ["Underground Smile", "collection-street.png", 39, "A playful street icon surrounded by paint, drips, and type."],
    ],
  },
  minimal: {
    number: "04",
    title: "Minimal",
    description: "Clean compositions for calm interiors, quiet corners, and focused spaces.",
    items: [
      ["Quiet Geometry", "collection-minimal.png", 38, "Calm forms and deliberate spacing for focused interiors."],
      ["Material Study", "feature-paper.png", 32, "Paper, grain, and a single black plane reduced to essentials."],
      ["Soft Balance", "drop-bauhaus.png", 42, "A dark circle balanced against fine vertical rhythm."],
      ["Single Form", "collection-minimal.png", 36, "One decisive shape and enough space for it to breathe."],
      ["Pause / Line", "feature-frame.png", 44, "A measured composition made around proportion and silence."],
      ["Near Silence", "feature-paper.png", 35, "Subtle texture and restrained contrast for a quieter wall."],
    ],
  },
  architecture: {
    number: "05",
    title: "Architecture",
    description: "Monochrome structures, sharp light, and quiet geometry for considered spaces.",
    items: [
      ["Light / Shadow / Balance", "drop-light.png", 39, "Monochrome space shaped by silence, contrast, and geometry."],
      ["Concrete Rhythm", "hero-collage.png", 44, "Layered structures, sharp shadows, and bold modern forms."],
      ["Form Follows Light", "feature-frame.png", 48, "A framed study of proportion, shadow, and disciplined space."],
      ["Quiet Facade", "drop-light.png", 43, "A restrained elevation interrupted by one precise field of light."],
      ["Brutal Balance", "hero-collage.png", 47, "Heavy concrete forms held together by strict graphic rhythm."],
      ["Open Volume", "feature-frame.png", 41, "Negative space and structural lines defining a calm interior."],
    ],
  },
  bauhaus: {
    number: "06",
    title: "Bauhaus",
    description: "Modernist circles, disciplined lines, and archival forms with lasting character.",
    items: [
      ["Circle Study 1919", "drop-bauhaus.png", 45, "Strict geometry and archival poster character in perfect balance."],
      ["Arc & Grid", "collection-minimal.png", 42, "A simple arc held against a precise field of vertical lines."],
      ["Form No. 3", "drop-bauhaus.png", 38, "A modular study of circle, line, proportion, and repetition."],
      ["Workshop 1923", "feature-ink.png", 46, "Pigment-rich bands arranged with functional modernist clarity."],
      ["Modern Rhythm", "collection-minimal.png", 40, "Repeated geometry creating movement without visual noise."],
      ["School of Form", "drop-bauhaus.png", 49, "A bold archival composition rooted in disciplined design."],
    ],
  },
};

const requestedCollectionSlug = new URLSearchParams(window.location.search).get("slug") || "typography";
const activeCollectionSlug = collectionCatalogs[requestedCollectionSlug] ? requestedCollectionSlug : "typography";
const activeCollection = collectionCatalogs[activeCollectionSlug];
const collectionTitleElement = document.getElementById("collection-title");
const collectionDescriptionElement = document.getElementById("collection-description");
const collectionKickerElement = document.getElementById("collection-kicker");
const collectionGridElement = document.getElementById("catalog-grid");

if (collectionTitleElement) collectionTitleElement.textContent = activeCollection.title;
if (collectionDescriptionElement) collectionDescriptionElement.textContent = activeCollection.description;
if (collectionKickerElement) collectionKickerElement.textContent = `Collection ${activeCollection.number} / 06`;
document.title = `${activeCollection.title} Collection — Plakat`;

if (collectionGridElement) {
  collectionGridElement.innerHTML = activeCollection.items.map(([title, image, price, description], index) => `
    <article class="product-card catalog-card" data-category="${activeCollectionSlug}" data-price="${price}" data-order="${index + 1}">
      <img class="product-image${image === "hero-collage.png" ? " product-image--collage" : ""}" src="./assets/${image}" alt="${title} ${activeCollection.title.toLowerCase()} poster" />
      <div class="product-info">
        <div class="product-copy"><span class="eyebrow">${activeCollection.title}</span><h3>${title}</h3><p>${description}</p></div>
        <div class="product-buy"><span>From $${price}</span><a class="outline-link" href="#product-modal">View print<img src="./assets/arrow-card.svg" alt="" /></a></div>
      </div>
    </article>
  `).join("");
}
