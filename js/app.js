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
let portfolioStatsPanel = null;

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

function getProjectTier(card) {
  const text = normalizeText(card.textContent);

  if (text.includes("publicado") || text.includes("release") || text.includes("github pages")) {
    return {
      className: "tier-published",
      label: "Publicado",
      detail: "Entrega estable",
    };
  }

  if (text.includes("grupo") || text.includes("intermodular") || text.includes("auri") || text.includes("naranco")) {
    return {
      className: "tier-team",
      label: "Académico",
      detail: "Trabajo de grupo",
    };
  }

  return {
    className: "tier-practice",
    label: "Práctica",
    detail: "Repositorio en evolución",
  };
}

function getCategoryLabels(categories) {
  const categoryMap = {
    publicados: "Publicado",
    web: "Web",
    javascript: "JavaScript",
    python: "Python",
    bbdd: "BBDD",
    grupo: "Grupo",
    religioso: "Religioso",
    apps: "App",
  };

  return categories
    .filter((category) => category !== "todos")
    .map((category) => categoryMap[category])
    .filter(Boolean)
    .slice(0, 4);
}

function getPortfolioStats() {
  const stats = {
    total: projectCards.length,
    published: 0,
    academic: 0,
    practice: 0,
    technologies: new Set(),
    visible: projectCards.length,
  };

  projectCards.forEach((card) => {
    const tier = getProjectTier(card);
    const categories = getProjectCategories(card);

    if (tier.className === "tier-published") stats.published += 1;
    if (tier.className === "tier-team") stats.academic += 1;
    if (tier.className === "tier-practice") stats.practice += 1;

    categories
      .filter((category) => !["todos", "publicados", "grupo"].includes(category))
      .forEach((category) => stats.technologies.add(category));
  });

  return stats;
}

function createPortfolioStats() {
  if (!projectFilters || portfolioStatsPanel) return;

  const stats = getPortfolioStats();
  const panel = document.createElement("div");
  panel.className = "portfolio-stats-panel";
  panel.setAttribute("aria-label", "Estadísticas del portfolio");
  panel.innerHTML = `
    <div class="stats-heading">
      <span>Dashboard DAW</span>
      <strong>Resumen vivo del portfolio</strong>
    </div>
    <div class="stats-grid">
      <article class="stat-card">
        <span>Total</span>
        <strong data-stat="total">${stats.total}</strong>
        <small>proyectos catalogados</small>
      </article>
      <article class="stat-card">
        <span>Publicados</span>
        <strong data-stat="published">${stats.published}</strong>
        <small>entregas estables</small>
      </article>
      <article class="stat-card">
        <span>Académicos</span>
        <strong data-stat="academic">${stats.academic}</strong>
        <small>trabajos de grupo</small>
      </article>
      <article class="stat-card">
        <span>Prácticas</span>
        <strong data-stat="practice">${stats.practice}</strong>
        <small>repos en evolución</small>
      </article>
      <article class="stat-card">
        <span>Tecnologías</span>
        <strong data-stat="tech">${stats.technologies.size}</strong>
        <small>áreas usadas</small>
      </article>
      <article class="stat-card stat-card-live">
        <span>Visibles</span>
        <strong data-stat="visible">${stats.visible}</strong>
        <small>según filtro actual</small>
      </article>
    </div>
  `;

  projectFilters.before(panel);
  portfolioStatsPanel = panel;
}

function updatePortfolioStats(visibleCount) {
  if (!portfolioStatsPanel) return;

  const visibleStat = portfolioStatsPanel.querySelector('[data-stat="visible"]');
  if (visibleStat) {
    visibleStat.textContent = visibleCount;
  }
}

function enhanceProjectCards() {
  projectCards.forEach((card, index) => {
    if (card.dataset.enhanced === "true") return;

    const categories = getProjectCategories(card);
    const tier = getProjectTier(card);
    const labels = getCategoryLabels(categories);
    const title = card.querySelector("h3");
    const content = card.querySelector("div:first-child");

    card.dataset.enhanced = "true";
    card.classList.add("project-card-premium", tier.className);
    card.style.setProperty("--card-order", String(index + 1).padStart(2, "0"));

    if (content && !card.querySelector(".project-meta-row")) {
      const metaRow = document.createElement("div");
      metaRow.className = "project-meta-row";

      const orderPill = document.createElement("span");
      orderPill.className = "project-order-pill";
      orderPill.textContent = `#${String(index + 1).padStart(2, "0")}`;

      const tierPill = document.createElement("span");
      tierPill.className = "project-tier-pill";
      tierPill.textContent = tier.label;

      metaRow.append(orderPill, tierPill);
      content.prepend(metaRow);
    }

    if (title && labels.length && !card.querySelector(".project-chip-list")) {
      const chipList = document.createElement("div");
      chipList.className = "project-chip-list";

      labels.forEach((label) => {
        const chip = document.createElement("span");
        chip.textContent = label;
        chipList.appendChild(chip);
      });

      title.insertAdjacentElement("afterend", chipList);
    }

    const badge = card.querySelector(".project-badge");
    if (badge && !badge.querySelector("em")) {
      const detail = document.createElement("em");
      detail.textContent = tier.detail;
      badge.appendChild(detail);
    }
  });
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
  updatePortfolioStats(visibleCount);
}

if (filterButtons.length && projectCards.length) {
  enhanceProjectCards();
  createPortfolioStats();
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
