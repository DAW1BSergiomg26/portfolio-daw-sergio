(function () {
  'use strict';

  var STORAGE_KEY = 'portfolio-zen';
  var isActive = localStorage.getItem(STORAGE_KEY) === 'true';

  function apply(state) {
    document.documentElement.classList.toggle('zen-mode', state);
    var btn = document.getElementById('zen-toggle');
    if (btn) {
      btn.classList.toggle('is-active', state);
      btn.setAttribute('aria-pressed', state);
    }
  }

  function toggle() {
    isActive = !isActive;
    localStorage.setItem(STORAGE_KEY, isActive);
    apply(isActive);
  }

  function init() {
    var btn = document.getElementById('zen-toggle');
    if (btn) {
      btn.addEventListener('click', toggle);
    }

    apply(isActive);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.toggleZen = toggle;
  window.__isZenActive = function () { return isActive; };
})();
