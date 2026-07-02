(function () {
  'use strict';

  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let idx = 0;
  let active = false;

  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const expected = KONAMI[idx].toLowerCase();

    if (key === expected) {
      idx++;
      if (idx === KONAMI.length) {
        idx = 0;
        toggleDevMode();
      }
    } else if (key === 'escape' && active) {
      toggleDevMode();
    } else {
      idx = 0;
    }
  });

  function toggleDevMode() {
    active = !active;
    document.documentElement.classList.toggle('dev-mode', active);

    if (active) {
      showToast();
      injectScanlines();
    } else {
      removeToast();
      removeScanlines();
    }
  }

  function showToast() {
    const existing = document.querySelector('.dev-toast');
    if (existing) existing.remove();

    const toasts = [
      'MODO DEV ACTIVADO',
      'SYSTEM OVERRIDE',
      'KONAMI — CODIGO ACTIVO',
      'MODO EXPERTO'
    ];
    const msg = toasts[Math.floor(Math.random() * toasts.length)];

    const el = document.createElement('div');
    el.className = 'dev-toast';
    el.textContent = msg;
    el.addEventListener('click', toggleDevMode);
    document.body.appendChild(el);

    setTimeout(() => el.classList.add('dev-toast--show'), 50);
  }

  function removeToast() {
    const el = document.querySelector('.dev-toast');
    if (el) {
      el.classList.remove('dev-toast--show');
      setTimeout(() => el.remove(), 400);
    }
  }

  function injectScanlines() {
    let div = document.querySelector('.dev-scanlines');
    if (!div) {
      div = document.createElement('div');
      div.className = 'dev-scanlines';
      document.body.appendChild(div);
    }
  }

  function removeScanlines() {
    const el = document.querySelector('.dev-scanlines');
    if (el) el.remove();
  }

  window.toggleDevMode = toggleDevMode;

  const devCommands = ['konami', 'devmode', 'cheats', 'godmode'];
  window.__isDevModeActive = () => active;
  window.__runDevCommand = (cmd) => {
    if (devCommands.includes(cmd)) {
      if (!active) toggleDevMode();
      return active ? (document.documentElement.lang === 'en' ? 'Dev Mode activated. Type "exit" or press ESC to disable.' : 'Modo Dev activado. Escribe "exit" o pulsa ESC para desactivar.')
        : null;
    }
    return null;
  };
})();
