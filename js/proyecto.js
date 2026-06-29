async function loadProject() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");
  const container = document.getElementById("project-container");

  if (!projectId) {
    container.innerHTML = "<h1>Proyecto no encontrado</h1><a href='index.html'>Volver al inicio</a>";
    return;
  }

  try {
    const response = await fetch("data/projects.json?v=2.7.0");
    if (!response.ok) throw new Error("No se pudo cargar el catálogo");

    const projects = await response.json();
    const project = projects.find((p) => String(p.id) === projectId);

    if (!project) {
      container.innerHTML = "<h1>Proyecto no encontrado</h1><a href='index.html'>Volver al inicio</a>";
      return;
    }

    renderProject(project, container);
    document.title = `${project.title} | Portfolio DAW`;
  } catch (error) {
    container.innerHTML = `
      <h1 style="color:var(--accent)">Error al cargar</h1>
      <p>No se pudo recuperar la información del proyecto.</p>
      <a href='index.html' class="project-links" style="text-decoration:none; display:inline-block; margin-top:1rem;">Volver al inicio</a>
    `;
  }
}

function renderProject(project, container) {
  container.innerHTML = `
    <p class="project-kicker">${project.kicker || "Proyecto profesional"}</p>
    <h1>${project.title}</h1>
    <p style="font-size: 1.2rem; color: var(--muted);">${project.description}</p>
    
    <div class="project-meta">
      ${project.status ? `<span>Estado: ${project.status}</span>` : ""}
      ${project.level ? `<span>Nivel: ${project.level}</span>` : ""}
      ${project.version ? `<span>Versión: ${project.version}</span>` : ""}
      ${project.year ? `<span>Año: ${project.year}</span>` : ""}
    </div>

    <h3>Defensa Técnica</h3>
    <p><strong>Qué hice:</strong> ${project.description}</p>
    <p><strong>Qué aprendí:</strong> ${project.learning || "Documentación en progreso."}</p>
    <p><strong>Por qué importa:</strong> ${project.portfolioRole || "Proyecto clave dentro del portfolio."}</p>

    <h3>Tecnologías aplicadas</h3>
    <div class="tech-chips">
      ${(project.technologies || []).map(tech => `<span>${tech}</span>`).join("")}
    </div>

    <h3>Enlaces directos</h3>
    <div class="project-links">
      ${(project.links || []).map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join("")}
    </div>
  `;
}

loadProject();
