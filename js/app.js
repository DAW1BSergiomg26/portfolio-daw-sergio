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

  window.setTimeout(() => {
    revealItems.forEach(showRevealItem);
  }, 350);
} else {
  revealItems.forEach(showRevealItem);
}

const projectSection = document.querySelector("#proyectos");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCounter = document.querySelector(".project-counter");
const projectFilters = document.querySelector(".project-filters");

let projectCards = Array.from(document.querySelectorAll(".project-card"));
let activeProjectCategory = "todos";
let projectSearchInput = null;
let portfolioStatsPanel = null;
let featuredProjectsPanel = null;

const tierMap = {
  published: {
    className: "tier-published",
    label: "Publicado",
    detail: "Entrega estable",
  },
  academic: {
    className: "tier-team",
    label: "Académico",
    detail: "Trabajo de grupo",
  },
  practice: {
    className: "tier-practice",
    label: "Práctica",
    detail: "Repositorio en evolución",
  },
};

const filterLabelMap = {
  todos: "catálogo completo",
  published: "publicados",
  academic: "académicos",
  practice: "prácticas",
  featured: "destacados",
  web: "web",
  javascript: "javascript",
  python: "python",
  bbdd: "bbdd",
  grupo: "grupo",
  religioso: "religioso",
  apps: "apps",
};

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function setProjectMetadata(card, project) {
  card.dataset.projectId = project.id || "";
  card.dataset.status = project.status || "practice";
  card.dataset.type = project.type || "practice";
  card.dataset.version = project.version || "";
  card.dataset.year = project.year || "";
  card.dataset.featured = String(Boolean(project.featured));
  card.dataset.priority = project.priority || "";
  card.dataset.level = project.level || "";
  card.dataset.learning = project.learning || "";
  card.dataset.portfolioRole = project.portfolioRole || "";
  card.dataset.categories = ["todos", ...(project.categories || [])].join(",");
  card.dataset.technologies = (project.technologies || []).join(",");
}

function createProjectDetail(project) {
  const hasDetail = project.learning || project.portfolioRole || project.level || project.technologies?.length;
  if (!hasDetail) return null;

  const details = document.createElement("details");
  details.className = "project-detail";

  const summary = document.createElement("summary");
  summary.textContent = "Ver detalle profesional";
  details.appendChild(summary);

  const body = document.createElement("div");
  body.className = "project-detail-body";

  if (project.learning) {
    const learning = document.createElement("p");
    learning.innerHTML = `<strong>Qué aprendí:</strong> ${project.learning}`;
    body.appendChild(learning);
  }

  if (project.portfolioRole) {
    const role = document.createElement("p");
    role.innerHTML = `<strong>Rol en el portfolio:</strong> ${project.portfolioRole}`;
    body.appendChild(role);
  }

  if (project.level) {
    const level = document.createElement("p");
    level.innerHTML = `<strong>Estado:</strong> ${project.level}`;
    body.appendChild(level);
  }

  if (project.technologies?.length) {
    const techTitle = document.createElement("strong");
    techTitle.textContent = "Tecnologías principales:";
    body.appendChild(techTitle);

    const techList = document.createElement("div");
    techList.className = "project-detail-tech";

    project.technologies.slice(0, 8).forEach((technology) => {
      const chip = document.createElement("span");
      chip.textContent = technology;
      techList.appendChild(chip);
    });

    body.appendChild(techList);
  }

  details.appendChild(body);
  return details;
}
function createProjectCard(project) {
  const article = document.createElement("article");
  article.className = "project-card";
  setProjectMetadata(article, project);

  const content = document.createElement("div");

  const kicker = document.createElement("p");
  kicker.className = "project-kicker";
  kicker.textContent = project.kicker;

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description;

  const detail = createProjectDetail(project);

  const links = document.createElement("div");
  links.className = "project-links";

  project.links.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.label;
    links.appendChild(anchor);
  });

  if (detail) {
    content.append(kicker, title, description, detail, links);
  } else {
    content.append(kicker, title, description, links);
  }

  const badge = document.createElement("div");
  badge.className = "project-badge";

  const badgeLabel = document.createElement("span");
  badgeLabel.textContent = project.badge.label;

  const badgeStatus = document.createElement("strong");
  badgeStatus.textContent = project.badge.status;

  badge.append(badgeLabel, badgeStatus);
  article.append(content, badge);

  return article;
}

function renderProjects(projects) {
  if (!projectSection || !projectCounter) return;

  projectSection.querySelectorAll(".project-card").forEach((card) => card.remove());

  const fragment = document.createDocumentFragment();
  projects.forEach((project) => {
    fragment.appendChild(createProjectCard(project));
  });

  projectCounter.after(fragment);
  projectCards = Array.from(projectSection.querySelectorAll(".project-card"));
}

async function loadProjectsFromJson() {
  try {
    const response = await fetch("data/projects.json?v=2.5.0");

    if (!response.ok) {
      throw new Error("No se pudo cargar data/projects.json");
    }

    const projects = await response.json();
    renderProjects(projects);
    createFeaturedProjectsPanel(projects);
  } catch (error) {
    console.warn("Usando proyectos estáticos como respaldo:", error);
    projectCards = Array.from(document.querySelectorAll(".project-card"));
  }
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
  if (card.dataset.categories) {
    return card.dataset.categories.split(",").filter(Boolean);
  }

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
  if (card.dataset.status && tierMap[card.dataset.status]) {
    return tierMap[card.dataset.status];
  }

  const text = normalizeText(card.textContent);

  if (text.includes("publicado") || text.includes("release") || text.includes("github pages")) {
    return tierMap.published;
  }

  if (text.includes("grupo") || text.includes("intermodular") || text.includes("auri") || text.includes("naranco")) {
    return tierMap.academic;
  }

  return tierMap.practice;
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

function getProjectTechnologies(card) {
  if (card.dataset.technologies) {
    return card.dataset.technologies.split(",").filter(Boolean);
  }

  return getProjectCategories(card).filter((category) => !["todos", "publicados", "grupo"].includes(category));
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
    const status = card.dataset.status;

    if (status === "published") stats.published += 1;
    else if (status === "academic") stats.academic += 1;
    else if (status === "practice") stats.practice += 1;
    else {
      const tier = getProjectTier(card);
      if (tier.className === "tier-published") stats.published += 1;
      if (tier.className === "tier-team") stats.academic += 1;
      if (tier.className === "tier-practice") stats.practice += 1;
    }

    getProjectTechnologies(card).forEach((technology) => stats.technologies.add(technology));
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

  const stats = getPortfolioStats();
  const values = {
    total: stats.total,
    published: stats.published,
    academic: stats.academic,
    practice: stats.practice,
    tech: stats.technologies.size,
    visible: visibleCount,
  };

  Object.entries(values).forEach(([key, value]) => {
    const stat = portfolioStatsPanel.querySelector(`[data-stat="${key}"]`);
    if (stat) stat.textContent = value;
  });
}

function getFeaturedProjects(projects) {
  return projects.filter((project) => project.featured).slice(0, 5);
}

function createFeaturedCard(project, index) {
  const card = document.createElement("article");
  card.className = "featured-project-card";
  card.style.setProperty("--featured-order", String(index + 1).padStart(2, "0"));

  const categories = (project.categories || []).slice(0, 3);
  const technologies = (project.technologies || []).slice(0, 3);
  const primaryLink = project.links?.[0];

  card.innerHTML = `
    <div class="featured-card-glow" aria-hidden="true"></div>
    <div class="featured-card-content">
      <span class="featured-index">#${String(index + 1).padStart(2, "0")}</span>
      <p class="featured-kicker">${project.kicker}</p>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="featured-meta">
        <span>${project.status === "published" ? "Publicado" : "Destacado"}</span>
        <span>${project.version || "Portfolio"}</span>
        <span>${project.year || "DAW"}</span>
      </div>
      <div class="featured-tech-list">
        ${[...categories, ...technologies].slice(0, 5).map((item) => `<span>${item}</span>`).join("")}
      </div>
      ${primaryLink ? `<a class="featured-link" href="${primaryLink.url}" target="_blank" rel="noopener noreferrer">Abrir proyecto</a>` : ""}
    </div>
  `;

  return card;
}

function createFeaturedProjectsPanel(projects) {
  if (!projectFilters || featuredProjectsPanel) return;

  const featuredProjects = getFeaturedProjects(projects);
  if (!featuredProjects.length) return;

  const panel = document.createElement("section");
  panel.className = "featured-projects-panel";
  panel.setAttribute("aria-label", "Proyectos destacados del portfolio");

  const cards = document.createElement("div");
  cards.className = "featured-projects-grid";
  featuredProjects.forEach((project, index) => {
    cards.appendChild(createFeaturedCard(project, index));
  });

  panel.innerHTML = `
    <div class="featured-panel-heading">
      <div>
        <span>Showcase 3D ligero</span>
        <h3>Proyectos destacados</h3>
      </div>
      <p>Una capa visual premium sin WebGL pesado: profundidad CSS, carga inmediata y foco en proyectos reales del catálogo.</p>
    </div>
  `;
  panel.appendChild(cards);

  projectFilters.before(panel);
  featuredProjectsPanel = panel;
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

function getCurrentFilterLabel() {
  return filterLabelMap[activeProjectCategory] || activeProjectCategory;
}

function updateProjectCounter(visibleCount, total, searchTerms) {
  if (!projectCounter) return;

  const filterLabel = activeProjectCategory === "todos" ? "catálogo completo" : `filtro: ${getCurrentFilterLabel()}`;
  const searchLabel = searchTerms.length ? ` · búsqueda: ${projectSearchInput.value.trim()}` : "";

  projectCounter.textContent = `${visibleCount} de ${total} proyectos visibles (${filterLabel}${searchLabel})`;
}

function getProjectSearchText(card) {
  return normalizeText([
    card.textContent,
    card.dataset.projectId,
    card.dataset.status,
    card.dataset.type,
    card.dataset.version,
    card.dataset.year,
    card.dataset.categories,
    card.dataset.technologies,
    card.dataset.priority,
    card.dataset.level,
    card.dataset.learning,
    card.dataset.portfolioRole,
  ].join(" "));
}

function matchesActiveFilter(card) {
  if (activeProjectCategory === "todos") return true;
  if (activeProjectCategory === "featured") return card.dataset.featured === "true";
  if (["published", "academic", "practice"].includes(activeProjectCategory)) {
    return card.dataset.status === activeProjectCategory;
  }

  return getProjectCategories(card).includes(activeProjectCategory);
}

function applyProjectView() {
  const searchTerms = getSearchTerms();
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const text = getProjectSearchText(card);
    const matchesCategory = matchesActiveFilter(card);
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

function bindProjectFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeProjectCategory = button.dataset.filter || "todos";

      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      applyProjectView();
    });
  });
}

async function initProjectsCatalog() {
  if (!projectFilters) return;

  await loadProjectsFromJson();

  if (!projectCards.length) return;

  enhanceProjectCards();
  createPortfolioStats();
  createProjectSearch();
  bindProjectFilters();
  applyProjectView();
}

initProjectsCatalog();

window.addEventListener("scroll", markActiveSection, { passive: true });
window.addEventListener("hashchange", markActiveSection);
markActiveSection();
