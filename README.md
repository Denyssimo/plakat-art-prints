# Plakat

Pixel-accurate static implementation of the supplied Figma frame (`1:28`).

## Run locally

```bash
npm start
```

Open `http://127.0.0.1:4173`.

The full marketplace is available at `drops.html`. `collections.html` presents all curated collections in a 3-column grid, while individual collections use the shared `collection.html?slug=...` template and include their own product grids.

The 1920 px desktop composition follows the original 1920 × 8559 Figma frame. Between 901 px and 1919 px it scales proportionally, and below 901 px it switches to a touch-friendly mobile layout.

All Figma artwork, icons, textures, and fonts used by the page are stored locally in `assets/`.
