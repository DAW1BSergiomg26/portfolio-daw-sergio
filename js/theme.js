(function () {
  'use strict';

  const THEME_KEY = 'portfolio-theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    updateToggleButtons();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  function updateToggleButtons() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const lightIcon = btn.querySelector('.theme-icon-light');
      const darkIcon = btn.querySelector('.theme-icon-dark');
      if (lightIcon) lightIcon.style.display = isLight ? 'none' : 'inline';
      if (darkIcon) darkIcon.style.display = isLight ? 'inline' : 'none';
      btn.setAttribute('aria-pressed', String(isLight));
    });
  }

  function initScrollTop() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'scroll-top';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    function onScroll() {
      const threshold = 400;
      if (window.scrollY > threshold) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  window.toggleTheme = toggleTheme;
  applyTheme(getPreferredTheme());

  function initRevealAnimations() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    function show(item) {
      item.classList.add('is-visible');
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

      items.forEach(item => observer.observe(item));

      window.setTimeout(() => {
        items.forEach(show);
      }, 350);
    } else {
      items.forEach(show);
    }
  }

  function init() {
    updateToggleButtons();
    initScrollTop();
    initRevealAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
