const catalogGridElement = document.getElementById("catalog-grid");
const catalogCountElement = document.getElementById("catalog-count");
const catalogSortElement = document.getElementById("catalog-sort");
const catalogCards = catalogGridElement ? [...catalogGridElement.querySelectorAll(".catalog-card")] : [];

function updateCatalogCount() {
  if (!catalogCountElement) return;
  const visibleCount = catalogCards.filter((card) => !card.hidden).length;
  catalogCountElement.textContent = `${visibleCount} ${visibleCount === 1 ? "print" : "prints"}`;
}

document.querySelectorAll(".catalog-controls .filter").forEach((filter) => {
  filter.addEventListener("click", () => requestAnimationFrame(updateCatalogCount));
});

catalogSortElement?.addEventListener("change", () => {
  const sortBy = catalogSortElement.value;
  const sortedCards = [...catalogCards].sort((a, b) => {
    if (sortBy === "price-low") return Number(a.dataset.price) - Number(b.dataset.price);
    if (sortBy === "price-high") return Number(b.dataset.price) - Number(a.dataset.price);
    if (sortBy === "name") return a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent);
    return Number(a.dataset.order) - Number(b.dataset.order);
  });
  sortedCards.forEach((card) => catalogGridElement.appendChild(card));
});

updateCatalogCount();
