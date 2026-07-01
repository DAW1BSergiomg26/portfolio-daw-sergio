/**
 * Panel de administración - Portfolio DAW Sergio
 * Gestión local de proyectos y entradas de blog mediante localStorage.
 * Exportación/importación JSON para persistencia real en GitHub.
 */
(function () {
  'use strict';

  const ADMIN_LANG_KEY = 'portfolio-admin-lang';
  const PROJECTS_KEY = 'portfolio-projects';
  const BLOG_KEY = 'portfolio-blog';
  const AUTH_KEY = 'portfolio-admin-auth';
  const APP_VERSION = 'v3.6.0';

  // Hash SHA-256 de "Rufi141414%$"
  const ADMIN_PASSWORD_HASH = 'fb705980c178167d0f50537bd6c9dfb88765e01f3b180e889c868e405770f13d';

  let currentLang = localStorage.getItem(ADMIN_LANG_KEY) || localStorage.getItem('lang') || 'es';
  let projects = [];
  let blog = [];
  let activeTab = 'projects';
  let editingId = null;

  const t = {
    es: {
      login_title: 'Panel de administración',
      login_password: 'Contraseña',
      login_button: 'Acceder',
      login_error: 'Contraseña incorrecta',
      logout: 'Cerrar sesión',
      tab_projects: 'Proyectos',
      tab_blog: 'Blog',
      tab_stats: 'Estadísticas',
      add_project: 'Añadir proyecto',
      add_post: 'Añadir entrada',
      edit: 'Editar',
      delete: 'Eliminar',
      view: 'Ver',
      copy_link: 'Copiar enlace',
      link_copied: 'Enlace copiado',
      save: 'Guardar',
      cancel: 'Cancelar',
      export_json: 'Exportar JSON',
      import_json: 'Importar JSON',
      reset_default: 'Restaurar originales',
      search: 'Buscar...',
      no_results: 'No se encontraron resultados',
      confirm_delete: '¿Eliminar este elemento?',
      import_success: 'Datos importados correctamente',
      import_error: 'Error al importar el archivo',
      saved: 'Cambios guardados',
      total_projects: 'Proyectos',
      total_posts: 'Entradas',
      published_projects: 'Publicados',
      featured_projects: 'Destacados'
    },
    en: {
      login_title: 'Admin panel',
      login_password: 'Password',
      login_button: 'Sign in',
      login_error: 'Incorrect password',
      logout: 'Log out',
      tab_projects: 'Projects',
      tab_blog: 'Blog',
      tab_stats: 'Statistics',
      add_project: 'Add project',
      add_post: 'Add post',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      copy_link: 'Copy link',
      link_copied: 'Link copied',
      save: 'Save',
      cancel: 'Cancel',
      export_json: 'Export JSON',
      import_json: 'Import JSON',
      reset_default: 'Restore defaults',
      search: 'Search...',
      no_results: 'No results found',
      confirm_delete: 'Delete this item?',
      import_success: 'Data imported successfully',
      import_error: 'Error importing file',
      saved: 'Changes saved',
      total_projects: 'Projects',
      total_posts: 'Posts',
      published_projects: 'Published',
      featured_projects: 'Featured'
    }
  };

  function txt(key) {
    return (t[currentLang] && t[currentLang][key]) || key;
  }

  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function loadData() {
    const localProjects = localStorage.getItem(PROJECTS_KEY);
    const localBlog = localStorage.getItem(BLOG_KEY);

    if (localProjects) {
      projects = JSON.parse(localProjects);
    } else {
      const res = await fetch('data/projects.json?v=3.6.0');
      projects = await res.json();
    }

    if (localBlog) {
      blog = JSON.parse(localBlog);
    } else {
      const res = await fetch('data/blog.json?v=3.6.0');
      blog = await res.json();
    }
  }

  function persist() {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    localStorage.setItem(BLOG_KEY, JSON.stringify(blog));
  }

  function showToast(message, type = 'success') {
    let toast = document.getElementById('admin-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'admin-toast';
      toast.className = 'admin-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `admin-toast is-${type}`;

    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3500);
  }

  function slugify(text) {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.lang === currentLang);
    });
    document.documentElement.lang = currentLang;
  }

  function renderText() {
    document.querySelectorAll('[data-t]').forEach(el => {
      el.textContent = txt(el.dataset.t);
    });
    document.querySelectorAll('[data-t-placeholder]').forEach(el => {
      el.placeholder = txt(el.dataset.tPlaceholder);
    });
  }

  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  }

  async function handleLogin(e) {
    e.preventDefault();
    const input = document.getElementById('admin-password');
    const hash = await sha256(input.value);
    if (hash === ADMIN_PASSWORD_HASH) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      initAdmin();
    } else {
      const error = document.getElementById('login-error');
      error.textContent = txt('login_error');
      error.hidden = false;
    }
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    location.reload();
  }

  function renderStats() {
    const stats = document.getElementById('admin-stats');
    if (!stats) return;
    stats.innerHTML = `
      <div class="admin-stat-card">
        <span class="admin-stat-value">${projects.length}</span>
        <span class="admin-stat-label">${txt('total_projects')}</span>
      </div>
      <div class="admin-stat-card">
        <span class="admin-stat-value">${blog.length}</span>
        <span class="admin-stat-label">${txt('total_posts')}</span>
      </div>
      <div class="admin-stat-card">
        <span class="admin-stat-value">${projects.filter(p => p.status === 'published').length}</span>
        <span class="admin-stat-label">${txt('published_projects')}</span>
      </div>
      <div class="admin-stat-card">
        <span class="admin-stat-value">${projects.filter(p => p.featured).length}</span>
        <span class="admin-stat-label">${txt('featured_projects')}</span>
      </div>
    `;
  }

  function renderProjects() {
    const container = document.getElementById('admin-list');
    const search = (document.getElementById('admin-search')?.value || '').toLowerCase();
    const filtered = projects.filter(p =>
      (p.title || '').toLowerCase().includes(search) ||
      (p.title_en || '').toLowerCase().includes(search) ||
      (p.slug || '').toLowerCase().includes(search)
    );

    container.innerHTML = filtered.map(p => {
      const statusClass = p.status === 'published' ? 'gold' : (p.status === 'academic' ? 'purple' : '');
      const techBadges = (p.technologies || []).slice(0, 4).map(t => `<span class="admin-badge">${t}</span>`).join('');
      return `
      <div class="admin-item">
        <div class="admin-item-info">
          <strong>#${p.id} ${p.title || ''}</strong>
          <div class="admin-item-meta">
            ${p.status ? `<span class="admin-badge ${statusClass}">${p.status}</span>` : ''}
            ${p.category ? `<span class="admin-badge">${p.category}</span>` : ''}
            ${p.featured ? '<span class="admin-badge gold"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-star"></use></svg> Featured</span>' : ''}
            ${techBadges}
          </div>
        </div>
        <div class="admin-item-actions">
          <a class="btn small" href="proyecto.html?id=${encodeURIComponent(p.id)}" target="_blank" rel="noopener noreferrer" data-t="view">${txt('view')}</a>
          <button type="button" class="btn small ghost" onclick="window.adminCopyProjectLink(${JSON.stringify(p.id).replace(/"/g, '&quot;')})" data-t="copy_link">${txt('copy_link')}</button>
          <button type="button" class="btn small" onclick="window.adminEditProject(${p.id})" data-t="edit">${txt('edit')}</button>
          <button type="button" class="btn small ghost" onclick="window.adminDeleteProject(${p.id})" data-t="delete">${txt('delete')}</button>
        </div>
      </div>
    `}).join('') || `<p class="admin-empty">${txt('no_results')}</p>`;
  }

  function renderBlog() {
    const container = document.getElementById('admin-list');
    const search = (document.getElementById('admin-search')?.value || '').toLowerCase();
    const filtered = blog.filter(p =>
      (p.es?.title || '').toLowerCase().includes(search) ||
      (p.en?.title || '').toLowerCase().includes(search) ||
      (p.slug || '').toLowerCase().includes(search)
    );

    container.innerHTML = filtered.map(p => {
      const tagBadges = (p.tags || []).slice(0, 4).map(t => `<span class="admin-badge">${t}</span>`).join('');
      return `
      <div class="admin-item">
        <div class="admin-item-info">
          <strong>${p.es?.title || p.en?.title || ''}</strong>
          <div class="admin-item-meta">
            ${p.date ? `<span class="admin-badge"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-calendar"></use></svg> ${p.date}</span>` : ''}
            ${p.category ? `<span class="admin-badge purple">${p.category}</span>` : ''}
            ${p.readTime ? `<span class="admin-badge"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-clock"></use></svg> ${p.readTime} min</span>` : ''}
            ${tagBadges}
          </div>
        </div>
        <div class="admin-item-actions">
          <a class="btn small" href="entrada.html?slug=${encodeURIComponent(p.slug)}" target="_blank" rel="noopener noreferrer" data-t="view">${txt('view')}</a>
          <button type="button" class="btn small ghost" onclick="window.adminCopyPostLink(${JSON.stringify(p.slug).replace(/"/g, '&quot;')})" data-t="copy_link">${txt('copy_link')}</button>
          <button type="button" class="btn small" onclick="window.adminEditPost('${p.slug}')" data-t="edit">${txt('edit')}</button>
          <button type="button" class="btn small ghost" onclick="window.adminDeletePost('${p.slug}')" data-t="delete">${txt('delete')}</button>
        </div>
      </div>
    `}).join('') || `<p class="admin-empty">${txt('no_results')}</p>`;
  }

  function renderList() {
    if (activeTab === 'projects') renderProjects();
    else if (activeTab === 'blog') renderBlog();
    else renderStats();
  }

  function showForm(type, data = null) {
    const panel = document.getElementById('admin-form-panel');
    const isProject = type === 'project';
    editingId = isProject ? (data ? data.id : null) : (data ? data.slug : null);

    if (isProject) {
      panel.innerHTML = `
        <h3>${data ? txt('edit') : txt('add_project')}</h3>
        <form id="admin-form" class="admin-form" novalidate>
          <fieldset>
            <legend>Información básica</legend>
            <label>ID</label>
            <input type="number" name="id" value="${data ? data.id : ''}" ${data ? 'readonly' : ''} required>
            <p class="field-error" id="error-id"></p>
            <p class="field-hint">Identificador numérico único del proyecto.</p>

            <label>Título (ES)</label>
            <input type="text" name="title" id="field-title" value="${data ? data.title || '' : ''}" required>
            <p class="field-error" id="error-title"></p>

            <label>Título (EN)</label>
            <input type="text" name="title_en" value="${data ? data.title_en || '' : ''}">

            <label>Slug</label>
            <input type="text" name="slug" id="field-slug" value="${data ? data.slug || '' : ''}" required>
            <p class="field-hint">Se genera automáticamente desde el título. Puedes editarlo.</p>
            <p class="field-error" id="error-slug"></p>
          </fieldset>

          <fieldset>
            <legend>Contenido</legend>
            <label>Kicker (ES)</label>
            <input type="text" name="kicker" value="${data ? data.kicker || '' : ''}">
            <label>Kicker (EN)</label>
            <input type="text" name="kicker_en" value="${data ? data.kicker_en || '' : ''}">
            <label>Descripción (ES)</label>
            <textarea name="description" rows="3">${data ? data.description || '' : ''}</textarea>
            <label>Descripción (EN)</label>
            <textarea name="description_en" rows="3">${data ? data.description_en || '' : ''}</textarea>
          </fieldset>

          <fieldset>
            <legend>Metadatos</legend>
            <label>Estado</label>
            <select name="status" required>
              <option value="" ${!data || !data.status ? 'selected' : ''}>Selecciona un estado</option>
              <option value="published" ${data && data.status === 'published' ? 'selected' : ''}>Publicado</option>
              <option value="academic" ${data && data.status === 'academic' ? 'selected' : ''}>Académico</option>
              <option value="practice" ${data && data.status === 'practice' ? 'selected' : ''}>Práctica</option>
            </select>

            <label>Categoría</label>
            <input type="text" name="category" value="${data ? data.category || '' : ''}">

            <label>Tecnologías (coma separadas)</label>
            <input type="text" name="technologies" value="${data ? (data.technologies || []).join(', ') : ''}">

            <label>Prioridad</label>
            <input type="number" name="priority" value="${data ? data.priority || '' : ''}">

            <label class="admin-checkbox"><input type="checkbox" name="featured" ${data && data.featured ? 'checked' : ''}> Destacado</label>
          </fieldset>

          <fieldset>
            <legend>Enlaces</legend>
            <label>URL Demo</label>
            <input type="url" name="demoUrl" value="${data ? data.demoUrl || '' : ''}">
            <label>URL Repo</label>
            <input type="url" name="repoUrl" value="${data ? data.repoUrl || '' : ''}">
          </fieldset>

          <div class="admin-form-actions">
            <button type="submit" class="btn primary" data-t="save">${txt('save')}</button>
            <button type="button" class="btn ghost" onclick="window.adminCloseForm()" data-t="cancel">${txt('cancel')}</button>
          </div>
        </form>
      `;
    } else {
      const today = new Date().toISOString().slice(0, 10);
      panel.innerHTML = `
        <h3>${data ? txt('edit') : txt('add_post')}</h3>
        <form id="admin-form" class="admin-form" novalidate>
          <fieldset>
            <legend>Información básica</legend>
            <label>Título (ES)</label>
            <input type="text" name="es_title" id="field-es-title" value="${data ? data.es?.title || '' : ''}" required>
            <p class="field-error" id="error-es-title"></p>

            <label>Slug</label>
            <input type="text" name="slug" id="field-slug" value="${data ? data.slug || '' : ''}" ${data ? 'readonly' : ''} required>
            <p class="field-hint">Se genera automáticamente desde el título en español.</p>
            <p class="field-error" id="error-slug"></p>

            <label>Fecha</label>
            <input type="date" name="date" value="${data ? data.date || today : today}" required>

            <label>Categoría</label>
            <input type="text" name="category" value="${data ? data.category || '' : ''}">

            <label>Etiquetas (coma separadas)</label>
            <input type="text" name="tags" value="${data ? (data.tags || []).join(', ') : ''}">

            <label>Tiempo de lectura (min)</label>
            <input type="number" name="readTime" value="${data ? data.readTime || '' : ''}">
          </fieldset>

          <fieldset>
            <legend>Contenido en español</legend>
            <label>Extracto (ES)</label>
            <textarea name="es_excerpt" rows="2">${data ? data.es?.excerpt || '' : ''}</textarea>
            <label>Contenido HTML (ES)</label>
            <textarea name="es_content" rows="6">${data ? data.es?.content || '' : ''}</textarea>
          </fieldset>

          <fieldset>
            <legend>Contenido en inglés</legend>
            <label>Título (EN)</label>
            <input type="text" name="en_title" value="${data ? data.en?.title || '' : ''}">
            <label>Extracto (EN)</label>
            <textarea name="en_excerpt" rows="2">${data ? data.en?.excerpt || '' : ''}</textarea>
            <label>Contenido HTML (EN)</label>
            <textarea name="en_content" rows="6">${data ? data.en?.content || '' : ''}</textarea>
          </fieldset>

          <div class="admin-form-actions">
            <button type="submit" class="btn primary" data-t="save">${txt('save')}</button>
            <button type="button" class="btn ghost" onclick="window.adminCloseForm()" data-t="cancel">${txt('cancel')}</button>
          </div>
        </form>
      `;
    }

    bindFormHelpers(data);
    document.getElementById('admin-form').addEventListener('submit', handleFormSubmit);
    panel.scrollIntoView({ behavior: 'smooth' });
  }

  function bindFormHelpers(data) {
    const titleInput = document.getElementById('field-title');
    const esTitleInput = document.getElementById('field-es-title');
    const slugInput = document.getElementById('field-slug');
    if (!slugInput) return;

    const sourceInput = titleInput || esTitleInput;
    if (!sourceInput) return;

    const existingSlug = data ? (data.slug || '') : '';
    let lastAutoSlug = existingSlug || '';

    sourceInput.addEventListener('input', () => {
      if (slugInput.readOnly) return;
      const currentSlug = slugInput.value.trim();
      if (!currentSlug || currentSlug === lastAutoSlug) {
        lastAutoSlug = slugify(sourceInput.value);
        slugInput.value = lastAutoSlug;
      }
    });
  }

  function clearFieldErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    document.querySelectorAll('#admin-form [aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  }

  function setFieldError(name, message) {
    const errorEl = document.getElementById(`error-${name}`);
    const field = document.querySelector(`[name="${name}"]`);
    if (errorEl) errorEl.textContent = message;
    if (field) field.setAttribute('aria-invalid', 'true');
  }

  function validateForm(fd) {
    clearFieldErrors();
    let isValid = true;

    if (activeTab === 'projects') {
      const title = fd.get('title')?.toString().trim();
      const slug = fd.get('slug')?.toString().trim();
      const id = parseInt(fd.get('id')?.toString().trim() || '', 10);

      if (!id || id <= 0) {
        setFieldError('id', 'Introduce un ID numérico válido.');
        isValid = false;
      }
      if (!title) {
        setFieldError('title', 'El título en español es obligatorio.');
        isValid = false;
      }
      if (!slug) {
        setFieldError('slug', 'El slug es obligatorio.');
        isValid = false;
      }
    } else {
      const title = fd.get('es_title')?.toString().trim();
      const slug = fd.get('slug')?.toString().trim();

      if (!title) {
        setFieldError('es-title', 'El título en español es obligatorio.');
        isValid = false;
      }
      if (!slug) {
        setFieldError('slug', 'El slug es obligatorio.');
        isValid = false;
      }
    }

    return isValid;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const get = name => fd.get(name)?.toString().trim() || '';

    if (!validateForm(fd)) {
      showToast('Corrige los errores del formulario.', 'error');
      return;
    }

    if (activeTab === 'projects') {
      const id = parseInt(get('id'), 10);
      const item = {
        id,
        slug: get('slug'),
        title: get('title'),
        title_en: get('title_en'),
        kicker: get('kicker'),
        kicker_en: get('kicker_en'),
        description: get('description'),
        description_en: get('description_en'),
        status: get('status'),
        category: get('category'),
        technologies: get('technologies').split(',').map(s => s.trim()).filter(Boolean),
        featured: fd.has('featured'),
        demoUrl: get('demoUrl'),
        repoUrl: get('repoUrl'),
        priority: parseInt(get('priority'), 10) || 0
      };

      const idx = projects.findIndex(p => p.id === id);
      if (idx >= 0) projects[idx] = item;
      else projects.push(item);
    } else {
      const slug = get('slug');
      const item = {
        id: slug,
        slug,
        date: get('date'),
        category: get('category'),
        tags: get('tags').split(',').map(s => s.trim()).filter(Boolean),
        readTime: parseInt(get('readTime'), 10) || 3,
        es: {
          title: get('es_title'),
          excerpt: get('es_excerpt'),
          content: get('es_content')
        },
        en: {
          title: get('en_title'),
          excerpt: get('en_excerpt'),
          content: get('en_content')
        }
      };

      const idx = blog.findIndex(p => p.slug === slug);
      if (idx >= 0) blog[idx] = item;
      else blog.push(item);
    }

    persist();
    closeForm();
    renderList();
    renderStats();
    showToast(txt('saved'), 'success');
  }

  function closeForm() {
    document.getElementById('admin-form-panel').innerHTML = '';
    editingId = null;
  }

  function getBaseUrl() {
    const { protocol, host, pathname } = window.location;
    const path = pathname.replace(/\/[^/]*$/, '/');
    return `${protocol}//${host}${path}`;
  }

  function copyToClipboard(url) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => showToast(txt('link_copied'), 'success'))
        .catch(() => showToast(txt('import_error'), 'error'));
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast(txt('link_copied'), 'success');
      } catch (err) {
        showToast(txt('import_error'), 'error');
      }
      document.body.removeChild(textarea);
    }
  }

  window.adminEditProject = function(id) {
    activeTab = 'projects';
    updateTabs();
    showForm('project', projects.find(p => p.id === id));
  };

  window.adminCopyProjectLink = function(id) {
    copyToClipboard(`${getBaseUrl()}proyecto.html?id=${encodeURIComponent(id)}`);
  };

  window.adminCopyPostLink = function(slug) {
    copyToClipboard(`${getBaseUrl()}entrada.html?slug=${encodeURIComponent(slug)}`);
  };

  window.adminDeleteProject = function(id) {
    if (!confirm(txt('confirm_delete'))) return;
    projects = projects.filter(p => p.id !== id);
    persist();
    renderList();
  };

  window.adminEditPost = function(slug) {
    activeTab = 'blog';
    updateTabs();
    showForm('post', blog.find(p => p.slug === slug));
  };

  window.adminDeletePost = function(slug) {
    if (!confirm(txt('confirm_delete'))) return;
    blog = blog.filter(p => p.slug !== slug);
    persist();
    renderList();
  };

  window.adminCloseForm = closeForm;

  function updateTabs() {
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.classList.toggle('is-active', tab.dataset.tab === activeTab);
    });
    const addBtn = document.getElementById('admin-add');
    addBtn.textContent = activeTab === 'projects' ? txt('add_project') : (activeTab === 'blog' ? txt('add_post') : '');
    addBtn.hidden = activeTab === 'stats';
    renderList();
  }

  function exportJSON() {
    const data = { projects, blog, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.projects) {
          projects = data.projects;
          localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
        }
        if (data.blog) {
          blog = data.blog;
          localStorage.setItem(BLOG_KEY, JSON.stringify(blog));
        }
        renderList();
        renderStats();
        showToast(txt('import_success'), 'success');
      } catch (err) {
        showToast(txt('import_error'), 'error');
      }
    };
    reader.readAsText(file);
  }

  async function resetDefaults() {
    localStorage.removeItem(PROJECTS_KEY);
    localStorage.removeItem(BLOG_KEY);
    await loadData();
    renderList();
    renderStats();
  }

  function renderAdmin() {
    document.body.innerHTML = `
      <header class="admin-header">
        <div class="admin-title">
          <h1 data-t="login_title">${txt('login_title')}</h1>
          <span class="admin-version" title="Versión actual">${APP_VERSION}</span>
        </div>
        <div class="admin-actions">
          <div class="lang-switcher" role="group" aria-label="Selector de idioma">
            <button type="button" class="lang-btn" data-lang="es" onclick="window.adminSetLang('es')">ES</button>
            <button type="button" class="lang-btn" data-lang="en" onclick="window.adminSetLang('en')">EN</button>
          </div>
          <button type="button" class="theme-toggle" id="admin-theme-toggle" aria-label="Cambiar tema" onclick="window.toggleTheme()">
            <span class="theme-icon-light" aria-hidden="true"><svg class="icon"><use href="icons.svg#icon-sun"></use></svg></span>
            <span class="theme-icon-dark" aria-hidden="true"><svg class="icon"><use href="icons.svg#icon-moon"></use></svg></span>
          </button>
          <button type="button" class="btn ghost" onclick="window.adminLogout()" data-t="logout">${txt('logout')}</button>
        </div>
      </header>

      <main class="admin-main">
        <nav class="admin-tabs" aria-label="Admin tabs">
          <button type="button" class="admin-tab" data-tab="projects" onclick="window.adminSetTab('projects')" data-t="tab_projects">${txt('tab_projects')}</button>
          <button type="button" class="admin-tab" data-tab="blog" onclick="window.adminSetTab('blog')" data-t="tab_blog">${txt('tab_blog')}</button>
          <button type="button" class="admin-tab" data-tab="stats" onclick="window.adminSetTab('stats')" data-t="tab_stats">${txt('tab_stats')}</button>
        </nav>

        <div class="admin-toolbar">
          <input type="search" id="admin-search" class="admin-search" data-t-placeholder="search" placeholder="${txt('search')}">
          <button type="button" id="admin-add" class="btn primary" data-t="add_project">${txt('add_project')}</button>
          <button type="button" class="btn ghost" onclick="window.adminExportJSON()" data-t="export_json">${txt('export_json')}</button>
          <label class="btn ghost" style="cursor:pointer;">
            <span data-t="import_json">${txt('import_json')}</span>
            <input type="file" accept="application/json" hidden onchange="window.adminImportJSON(this.files[0])">
          </label>
          <button type="button" class="btn ghost" onclick="window.adminResetDefaults()" data-t="reset_default">${txt('reset_default')}</button>
        </div>

        <div id="admin-list" class="admin-list"></div>
        <div id="admin-stats" class="admin-stats"></div>
        <div id="admin-form-panel" class="admin-form-panel"></div>
      </main>
    `;

    updateLanguageButtons();
    updateTabs();
    renderStats();

    document.getElementById('admin-add').addEventListener('click', () => {
      showForm(activeTab === 'projects' ? 'project' : 'post');
    });

    document.getElementById('admin-search').addEventListener('input', renderList);
  }

  window.adminSetTab = function(tab) {
    activeTab = tab;
    closeForm();
    updateTabs();
  };

  window.adminSetLang = function(lang) {
    currentLang = lang;
    localStorage.setItem(ADMIN_LANG_KEY, currentLang);
    renderAdmin();
  };

  window.adminLogout = logout;
  window.adminExportJSON = exportJSON;
  window.adminImportJSON = importJSON;
  window.adminResetDefaults = resetDefaults;

  async function initAdmin() {
    await loadData();
    renderAdmin();
  }

  function renderLogin() {
    document.body.innerHTML = `
      <div class="admin-login">
        <div class="admin-login-card">
          <h1 data-t="login_title">${txt('login_title')}</h1>
          <form id="admin-login-form">
            <label for="admin-password" data-t="login_password">${txt('login_password')}</label>
            <input type="password" id="admin-password" required autofocus>
            <p id="login-error" class="admin-login-error" hidden></p>
            <button type="submit" class="btn primary" data-t="login_button">${txt('login_button')}</button>
          </form>
          <p style="margin-top:1rem; font-size:0.85rem; color:var(--muted);">
            Contraseña de acceso: <code>Rufi141414%$</code>
          </p>
        </div>
      </div>
    `;
    document.getElementById('admin-login-form').addEventListener('submit', handleLogin);
  }

  function init() {
    if (isAuthenticated()) {
      initAdmin();
    } else {
      renderLogin();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
