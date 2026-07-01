/**
 * Blog técnico - Portfolio DAW Sergio
 * Renderiza listado de entradas y ficha individual desde data/blog.json
 * Soporta internacionalización ES/EN
 */
(function () {
  'use strict';

  let blogData = [];
  let blogTranslations = {};
  let currentLang = localStorage.getItem('lang') || 'es';

  const BLOG_JSON_URL = 'data/blog.json?v=3.7.0';
  const LANG_JSON_URL = 'data/lang.json?v=3.7.0';

  async function loadBlogTranslations() {
    try {
      const response = await fetch(LANG_JSON_URL);
      if (!response.ok) throw new Error('No se pudo cargar lang.json');
      const data = await response.json();
      blogTranslations = data;
    } catch (err) {
      console.warn('[Blog] Error cargando traducciones:', err);
      blogTranslations = {};
    }
  }

  function t(key) {
    return (blogTranslations[currentLang] && blogTranslations[currentLang][key]) || key;
  }

  async function loadBlogData() {
    try {
      const localBlog = localStorage.getItem('portfolio-blog');
      if (localBlog) {
        blogData = JSON.parse(localBlog);
        return blogData;
      }
      const response = await fetch(BLOG_JSON_URL);
      if (!response.ok) throw new Error('No se pudo cargar blog.json');
      blogData = await response.json();
      return blogData;
    } catch (err) {
      console.error('[Blog] Error cargando entradas:', err);
      blogData = [];
      return [];
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat(currentLang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  function getPostContent(post) {
    return post[currentLang] || post.es || post.en || {};
  }

  function updatePostMeta(post, content) {
    const title = content.title || 'Blog | Portfolio DAW';
    const description = content.excerpt || 'Blog técnico del Portfolio DAW de Sergio Daniel Martínez Gómez.';
    const url = `https://daw1bsergiomg26.github.io/portfolio-daw-sergio/entrada.html?slug=${encodeURIComponent(post.slug)}`;
    const image = 'https://daw1bsergiomg26.github.io/portfolio-daw-sergio/og-image.svg';

    function setMeta(selector, attr, value) {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    }

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', image);
  }

  function renderBlogList(container) {
    if (!container) return;
    container.innerHTML = `<p class="blog-loading" data-i18n="blog_loading">${t('blog_loading')}</p>`;

    Promise.all([loadBlogData(), loadBlogTranslations()]).then(([posts]) => {
      if (!posts || posts.length === 0) {
        container.innerHTML = `<p class="blog-empty" data-i18n="blog_empty">${t('blog_empty')}</p>`;
        return;
      }

      const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
      const list = document.createElement('div');
      list.className = 'blog-grid';

      sorted.forEach(post => {
        const content = getPostContent(post);
        const article = document.createElement('article');
        article.className = 'blog-card';
        article.innerHTML = `
          <header class="blog-card-header">
            <span class="blog-card-category">${post.category}</span>
            <time datetime="${post.date}">${formatDate(post.date)}</time>
          </header>
          <h3 class="blog-card-title">${content.title || ''}</h3>
          <p class="blog-card-excerpt">${content.excerpt || ''}</p>
          <footer class="blog-card-footer">
            <span class="blog-card-meta">${post.readTime} ${t('blog_min_read')}</span>
            <a class="btn small" href="entrada.html?slug=${post.slug}" data-i18n="blog_read_more">${t('blog_read_more')}</a>
          </footer>
        `;
        list.appendChild(article);
      });

      container.innerHTML = '';
      container.appendChild(list);
    });
  }

  function renderBlogPost(container) {
    if (!container) return;
    container.innerHTML = `<p class="blog-loading" data-i18n="blog_post_loading">${t('blog_post_loading')}</p>`;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    Promise.all([loadBlogData(), loadBlogTranslations()]).then(([posts]) => {
      const post = posts.find(p => p.slug === slug);

      if (!post) {
        container.innerHTML = `
          <div class="blog-error">
            <h2 data-i18n="blog_post_not_found">${t('blog_post_not_found')}</h2>
            <a class="btn primary" href="index.html#blog" data-i18n="blog_back">${t('blog_back')}</a>
          </div>
        `;
        container.setAttribute('aria-busy', 'false');
        return;
      }

      const content = getPostContent(post);
      const tags = (post.tags || []).map(tag => `<span class="blog-tag">${tag}</span>`).join('');

      const breadcrumbTitle = document.getElementById('breadcrumb-post-title');
      if (breadcrumbTitle) {
        breadcrumbTitle.textContent = content.title || '';
        breadcrumbTitle.style.background = 'none';
        breadcrumbTitle.style.animation = 'none';
        breadcrumbTitle.style.minWidth = 'auto';
      }
      document.title = `${content.title || 'Blog'} | Portfolio DAW`;
      updatePostMeta(post, content);

      container.innerHTML = `
        <article class="blog-post">
          <header class="blog-post-header">
            <a class="back-link" href="index.html#blog" data-i18n="blog_back">${t('blog_back')}</a>
            <span class="blog-post-category">${post.category}</span>
            <h1>${content.title || ''}</h1>
            <div class="blog-post-meta">
              <time datetime="${post.date}">${formatDate(post.date)}</time>
              <span>·</span>
              <span>${post.readTime} ${t('blog_min_read')}</span>
            </div>
          </header>
          <div class="blog-post-content">
            ${content.content || ''}
          </div>
          <footer class="blog-post-footer">
            <p><strong data-i18n="blog_post_tags">${t('blog_post_tags')}</strong></p>
            <div class="blog-tags">${tags}</div>
          </footer>
        </article>
      `;
      container.setAttribute('aria-busy', 'false');
    });
  }

  function initBlog() {
    const listContainer = document.getElementById('blog-list');
    const postContainer = document.getElementById('blog-post-container');

    if (listContainer) renderBlogList(listContainer);
    if (postContainer) renderBlogPost(postContainer);
  }

  function setBlogLanguage(lang) {
    if (!['es', 'en'].includes(lang)) return;
    currentLang = lang;
    localStorage.setItem('lang', currentLang);
    document.documentElement.lang = currentLang;
    initBlog();
    if (typeof applyTranslations === 'function') applyTranslations();
  }

  window.refreshBlog = initBlog;
  window.setBlogLanguage = setBlogLanguage;
  window.setLanguage = setBlogLanguage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlog);
  } else {
    initBlog();
  }
})();
