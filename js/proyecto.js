let currentLang = localStorage.getItem("lang") || "es";
let translations = {};
let currentProject = null;

async function loadTranslations() {
  try {
    const response = await fetch("data/lang.json?v=3.12.0");
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
    container.setAttribute('aria-busy', 'false');
    return;
  }

  try {
    const response = await fetch("data/projects.json?v=3.12.0");
    if (!response.ok) throw new Error("No se pudo cargar el catálogo");

    const projects = await response.json();
    const project = projects.find((p) => String(p.id) === projectId);

    if (!project) {
      container.innerHTML = `<h1>${t("project_page_not_found")}</h1><a href='index.html'>${t("project_page_back_home")}</a>`;
      container.setAttribute('aria-busy', 'false');
      return;
    }

    renderProject(project, container);
    document.title = `${getProjectTitle(project)} | Portfolio DAW`;
    const breadcrumbTitle = document.getElementById("breadcrumb-project-title");
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = getProjectTitle(project);
      breadcrumbTitle.style.background = 'none';
      breadcrumbTitle.style.animation = 'none';
    }
    updateMeta(project);
  } catch (error) {
    container.innerHTML = `
      <h1 style="color:var(--accent)">${t("project_page_error")}</h1>
      <p>${t("project_page_error_text")}</p>
      <a href='index.html' class="project-links" style="text-decoration:none; display:inline-block; margin-top:1rem;">${t("project_page_back_home")}</a>
    `;
    container.setAttribute('aria-busy', 'false');
  }
}

function getProjectTitle(project) {
  return currentLang === "en" && project.title_en ? project.title_en : project.title;
}

function updateMeta(project) {
  const title = getProjectTitle(project);
  const description = getProjectDescription(project) || "Ficha profesional de un proyecto del Portfolio DAW de Sergio Daniel Martínez Gómez.";
  const url = `https://daw1bsergiomg26.github.io/portfolio-daw-sergio/proyecto.html?id=${encodeURIComponent(project.id)}`;
  const image = "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/og-image.svg";

  function setMeta(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }

  setMeta('meta[name="description"]', "content", description);
  setMeta('meta[property="og:title"]', "content", title);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[name="twitter:title"]', "content", title);
  setMeta('meta[name="twitter:description"]', "content", description);
  setMeta('meta[name="twitter:image"]', "content", image);
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
  const hasDemo = project.demo;
  container.innerHTML = `
    <div class="proj-tabs" role="tablist" aria-label="Secciones del proyecto">
      <button class="proj-tab is-active" role="tab" aria-selected="true" data-tab="details" id="tab-details">${t("project_tab_details")}</button>
      ${hasDemo ? `<button class="proj-tab" role="tab" aria-selected="false" data-tab="demo" id="tab-demo">${t("project_tab_demo")}</button>` : ""}
    </div>

    <div class="proj-panels">
      <div class="proj-panel is-active" role="tabpanel" aria-labelledby="tab-details" id="panel-details">
        <p class="project-kicker">${getProjectKicker(project) || t("project_page_default_kicker")}</p>
        <h1>${getProjectTitle(project)}</h1>
        <p style="font-size: 1.2rem; color: var(--muted);">${getProjectDescription(project)}</p>
        
        <div class="project-meta">
          ${project.status ? `<span>${t("project_meta_status")}: ${project.status}</span>` : ""}
          ${project.level ? `<span>${t("project_meta_level")}: ${project.level}</span>` : ""}
          ${project.version ? `<span>${t("project_meta_version")}: ${project.version}</span>` : ""}
          ${project.year ? `<span>${t("project_meta_year")}: ${project.year}</span>` : ""}
        </div>

        <h2>${t("modal_section_what")}</h2>
        <p>${getProjectDescription(project)}</p>

        <h2>${t("modal_section_learned")}</h2>
        <p>${getProjectLearning(project) || t("project_page_default_kicker")}</p>

        <h2>${t("modal_section_why")}</h2>
        <p>${getProjectRole(project) || t("project_page_default_kicker")}</p>

        <h2>${t("project_page_tech")}</h2>
        <div class="tech-chips">
          ${(project.technologies || []).map(tech => `<span>${tech}</span>`).join("")}
        </div>

        <h2>${t("project_page_links")}</h2>
        <div class="project-links">
          ${(project.links || []).map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join("")}
        </div>
      </div>

      ${hasDemo ? `<div class="proj-panel" role="tabpanel" aria-labelledby="tab-demo" id="panel-demo"><div class="sandbox-container"></div></div>` : ""}
    </div>
  `;
  container.setAttribute('aria-busy', 'false');

  currentProject = project;
  setupTabs(project);
}

function setupTabs(project) {
  document.querySelectorAll('.proj-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.proj-tab').forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.proj-panel').forEach(p => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('panel-' + btn.dataset.tab);
      if (panel) panel.classList.add('is-active');
      if (btn.dataset.tab === 'demo') {
        const sandboxContainer = panel.querySelector('.sandbox-container');
        if (sandboxContainer && !sandboxContainer.dataset.loaded) {
          sandboxContainer.dataset.loaded = 'true';
          createSandbox(sandboxContainer, project);
        }
      }
      window.dispatchEvent(new Event('resize'));
    });
  });
}

loadProject();
