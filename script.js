const comparison = document.querySelector("#comparison");
const range = comparison.querySelector(".comparison-range");
const beforeImage = comparison.querySelector(".before-layer img");
const afterImage = comparison.querySelector(".after-image");
const title = document.querySelector("#comparison-title");
const cards = [...document.querySelectorAll(".gallery-card")];
const currentCount = document.querySelector("#current-count");
const gallery = document.querySelector(".gallery");

function mergeSort(items, compare) {
  if (items.length < 2) return items;

  const middle = Math.floor(items.length / 2);
  const left = mergeSort(items.slice(0, middle), compare);
  const right = mergeSort(items.slice(middle), compare);
  const merged = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (compare(left[leftIndex], right[rightIndex]) <= 0) {
      merged.push(left[leftIndex++]);
    } else {
      merged.push(right[rightIndex++]);
    }
  }

  return merged.concat(left.slice(leftIndex), right.slice(rightIndex));
}

range.addEventListener("input", () => {
  comparison.style.setProperty("--position", `${range.value}%`);
});

cards.forEach((card) => {
  card.querySelector(".card-image").addEventListener("click", () => {
    beforeImage.src = card.dataset.before;
    afterImage.src = card.dataset.after;
    beforeImage.alt = `${card.dataset.title.split(" → ")[0]} view`;
    afterImage.alt = `${card.dataset.title.split(" → ")[1]} view`;
    title.innerHTML = card.dataset.title.replace(" → ", " <span>→</span> ");
    currentCount.textContent = String([...gallery.children].indexOf(card) + 1).padStart(2, "0");
    range.value = 50;
    comparison.style.setProperty("--position", "50%");
    comparison.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

const seasonOrder = ["spring", "summer", "fall", "winter"];
const sortButtons = document.querySelectorAll(".sort-button");

sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const compare =
      button.dataset.sort === "alphabetical"
        ? (a, b) => a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent)
        : (a, b) => seasonOrder.indexOf(a.dataset.season) - seasonOrder.indexOf(b.dataset.season);

    mergeSort([...gallery.children], compare).forEach((card) => gallery.append(card));

    sortButtons.forEach((sortButton) => {
      const isActive = sortButton === button;
      sortButton.classList.toggle("active", isActive);
      sortButton.setAttribute("aria-pressed", String(isActive));
    });
  });
});
