let currentLang = localStorage.getItem("lang") || "es";
let translations = {};

async function loadTranslations() {
  try {
    const response = await fetch("data/lang.json?v=3.4.2");
    translations = await response.json();
    updateLangButtons();
    applyTranslations();
  } catch (error) {
    console.error("Error loading translations:", error);
  }
}

function t(key, replacements = {}) {
  const text = translations[currentLang]?.[key] || translations["es"]?.[key] || key;
  return Object.entries(replacements).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`{{${key}}}`, "g"), value);
  }, text);
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = translations[currentLang]?.[key] || translations["es"]?.[key];
    if (text) el.textContent = text;
  });
  document.documentElement.lang = currentLang;
}

function setLanguage(lang) {
  if (!["es", "en"].includes(lang)) return;
  currentLang = lang;
  localStorage.setItem("lang", currentLang);
  updateLangButtons();
  applyTranslations();
  loadProject();
}

function updateLangButtons() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === currentLang);
  });
}

async function loadProject() {
  await loadTranslations();
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");
  const container = document.getElementById("project-container");

  if (!projectId) {
    container.innerHTML = `<h1>${t("project_page_not_found")}</h1><a href='index.html'>${t("project_page_back_home")}</a>`;
    return;
  }

  try {
    const response = await fetch("data/projects.json?v=3.4.2");
    if (!response.ok) throw new Error("No se pudo cargar el catálogo");

    const projects = await response.json();
    const project = projects.find((p) => String(p.id) === projectId);

    if (!project) {
      container.innerHTML = `<h1>${t("project_page_not_found")}</h1><a href='index.html'>${t("project_page_back_home")}</a>`;
      return;
    }

    renderProject(project, container);
    document.title = `${getProjectTitle(project)} | Portfolio DAW`;
  } catch (error) {
    container.innerHTML = `
      <h1 style="color:var(--accent)">${t("project_page_error")}</h1>
      <p>${t("project_page_error_text")}</p>
      <a href='index.html' class="project-links" style="text-decoration:none; display:inline-block; margin-top:1rem;">${t("project_page_back_home")}</a>
    `;
  }
}

function getProjectTitle(project) {
  return currentLang === "en" && project.title_en ? project.title_en : project.title;
}

function getProjectDescription(project) {
  return currentLang === "en" && project.description_en ? project.description_en : project.description;
}

function getProjectKicker(project) {
  return currentLang === "en" && project.kicker_en ? project.kicker_en : project.kicker;
}

function getProjectLearning(project) {
  return currentLang === "en" && project.learning_en ? project.learning_en : project.learning;
}

function getProjectRole(project) {
  return currentLang === "en" && project.portfolioRole_en ? project.portfolioRole_en : project.portfolioRole;
}

function renderProject(project, container) {
  container.innerHTML = `
    <p class="project-kicker">${getProjectKicker(project) || t("project_page_default_kicker")}</p>
    <h1>${getProjectTitle(project)}</h1>
    <p style="font-size: 1.2rem; color: var(--muted);">${getProjectDescription(project)}</p>
    
    <div class="project-meta">
      ${project.status ? `<span>${t("project_meta_status")}: ${project.status}</span>` : ""}
      ${project.level ? `<span>${t("project_meta_level")}: ${project.level}</span>` : ""}
      ${project.version ? `<span>${t("project_meta_version")}: ${project.version}</span>` : ""}
      ${project.year ? `<span>${t("project_meta_year")}: ${project.year}</span>` : ""}
    </div>

    <h3>${t("modal_section_what")}</h3>
    <p>${getProjectDescription(project)}</p>

    <h3>${t("modal_section_learned")}</h3>
    <p>${getProjectLearning(project) || t("project_page_default_kicker")}</p>

    <h3>${t("modal_section_why")}</h3>
    <p>${getProjectRole(project) || t("project_page_default_kicker")}</p>

    <h3>${t("project_page_tech")}</h3>
    <div class="tech-chips">
      ${(project.technologies || []).map(tech => `<span>${tech}</span>`).join("")}
    </div>

    <h3>${t("project_page_links")}</h3>
    <div class="project-links">
      ${(project.links || []).map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join("")}
    </div>
  `;
}

loadProject();
