const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".main-nav a");

function markActiveSection() {
  let currentId = "inicio";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active-link", href === `#${currentId}`);
  });
}

const revealItems = document.querySelectorAll(".reveal");

function showRevealItem(item) {
  item.classList.add("is-visible");
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showRevealItem(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  // Fallback defensivo: evita espacios vacíos si el navegador salta a un ancla
  // antes de que IntersectionObserver pinte las secciones.
  window.setTimeout(() => {
    revealItems.forEach(showRevealItem);
  }, 350);
} else {
  revealItems.forEach(showRevealItem);
}

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectCounter = document.querySelector(".project-counter");
const projectFilters = document.querySelector(".project-filters");

let activeProjectCategory = "todos";
let projectSearchInput = null;

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function createProjectSearch() {
  if (!projectFilters || projectSearchInput) return;

  const searchBox = document.createElement("div");
  searchBox.className = "project-search";
  searchBox.innerHTML = `
    <label for="project-search-input">Buscar proyecto</label>
    <div class="project-search-control">
      <input id="project-search-input" type="search" placeholder="Buscar: Python, Auri, BBDD, Divina, CMS..." autocomplete="off">
      <button class="clear-search" type="button" aria-label="Limpiar búsqueda">×</button>
    </div>
  `;

  projectFilters.before(searchBox);
  projectSearchInput = searchBox.querySelector("#project-search-input");
  const clearSearchButton = searchBox.querySelector(".clear-search");

  projectSearchInput.addEventListener("input", applyProjectView);

  clearSearchButton.addEventListener("click", () => {
    projectSearchInput.value = "";
    projectSearchInput.focus();
    applyProjectView();
  });
}

function getProjectCategories(card) {
  const text = normalizeText(card.textContent);
  const categories = ["todos"];

  if (text.includes("publicado") || text.includes("v1.0.0")) categories.push("publicados");
  if (text.includes("web") || text.includes("html") || text.includes("css") || text.includes("frontend") || text.includes("landing")) categories.push("web");
  if (text.includes("javascript") || text.includes("dom") || text.includes("juego") || text.includes("localstorage")) categories.push("javascript");
  if (text.includes("python")) categories.push("python");
  if (text.includes("bbdd") || text.includes("sql") || text.includes("base de datos")) categories.push("bbdd");
  if (text.includes("grupo") || text.includes("intermodular") || text.includes("auri") || text.includes("naranco")) categories.push("grupo");
  if (text.includes("religioso") || text.includes("devocional") || text.includes("divina") || text.includes("misericordia")) categories.push("religioso");
  if (text.includes("app") || text.includes("aplicacion") || text.includes("webapp")) categories.push("apps");

  return categories;
}

function getSearchTerms() {
  if (!projectSearchInput) return [];

  return normalizeText(projectSearchInput.value)
    .split(/\s+/)
    .filter(Boolean);
}

function updateProjectCounter(visibleCount, total, searchTerms) {
  if (!projectCounter) return;

  const filterLabel = activeProjectCategory === "todos" ? "catálogo completo" : `filtro: ${activeProjectCategory}`;
  const searchLabel = searchTerms.length ? ` · búsqueda: ${projectSearchInput.value.trim()}` : "";

  projectCounter.textContent = `${visibleCount} de ${total} proyectos visibles (${filterLabel}${searchLabel})`;
}

function applyProjectView() {
  const searchTerms = getSearchTerms();
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const text = normalizeText(card.textContent);
    const categories = getProjectCategories(card);
    const matchesCategory = activeProjectCategory === "todos" || categories.includes(activeProjectCategory);
    const matchesSearch = searchTerms.every((term) => text.includes(term));
    const isVisible = matchesCategory && matchesSearch;

    card.classList.toggle("is-hidden", !isVisible);

    if (isVisible) {
      visibleCount += 1;
    }
  });

  updateProjectCounter(visibleCount, projectCards.length, searchTerms);
}

if (filterButtons.length && projectCards.length) {
  createProjectSearch();

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeProjectCategory = button.dataset.filter || "todos";

      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      applyProjectView();
    });
  });

  applyProjectView();
}

window.addEventListener("scroll", markActiveSection, { passive: true });
window.addEventListener("hashchange", markActiveSection);
markActiveSection();
