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

  window.toggleTheme = toggleTheme;
  applyTheme(getPreferredTheme());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateToggleButtons);
  } else {
    updateToggleButtons();
  }
})();
