(function () {
  'use strict';

  var SECTIONS = [
    { id: 'inicio', label: 'Inicio', labelEn: 'Home', icon: '*' },
    { id: 'sobre-mi', label: 'Sobre mi', labelEn: 'About', icon: '*' },
    { id: 'tecnologias', label: 'Tecnologias', labelEn: 'Tech', icon: '*' },
    { id: 'github', label: 'GitHub', labelEn: 'GitHub', icon: '*' },
    { id: 'proyectos', label: 'Proyectos', labelEn: 'Projects', icon: '*' },
    { id: 'proximos-proyectos', label: 'Proximos', labelEn: 'Upcoming', icon: '*' },
    { id: 'blog', label: 'Blog', labelEn: 'Blog', icon: '*' },
    { id: 'guestbook', label: 'Invitados', labelEn: 'Guests', icon: '*' },
    { id: 'ruta', label: 'Ruta DAW', labelEn: 'DAW Path', icon: '*' },
    { id: 'sandbox', label: 'Sandbox', labelEn: 'Sandbox', icon: '*' },
    { id: 'contacto', label: 'Contacto', labelEn: 'Contact', icon: '*' },
  ];

  var COLS = 3;
  var currentIndex = 0;
  var modal, grid, isOpen = false;

  function isEn() { return (document.documentElement.lang || 'es') === 'en'; }

  function build() {
    if (modal) { modal.parentNode && modal.parentNode.removeChild(modal); modal = null; }

    modal = document.createElement('div');
    modal.className = 'explore-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');

    var content = document.createElement('div');
    content.className = 'explore-content';

    var header = document.createElement('div');
    header.className = 'explore-header';
    var title = document.createElement('span');
    title.className = 'explore-title';
    title.textContent = isEn() ? 'Explore Portfolio' : 'Explorar Portfolio';

    var hint = document.createElement('span');
    hint.className = 'explore-hint';
    hint.textContent = 'WASD / Arrows + Enter';
    header.appendChild(title);
    header.appendChild(hint);
    content.appendChild(header);

    grid = document.createElement('div');
    grid.className = 'explore-grid';
    grid.style.setProperty('--cols', COLS);
    content.appendChild(grid);

    modal.appendChild(content);
    document.body.appendChild(modal);

    SECTIONS.forEach(function (sec, idx) {
      var card = document.createElement('button');
      card.className = 'explore-card';
      card.setAttribute('data-index', idx);
      card.textContent = (isEn() ? sec.labelEn : sec.label);
      card.addEventListener('click', function () { goTo(idx); });
      card.addEventListener('mouseenter', function () { setIndex(idx); });
      grid.appendChild(card);
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
  }

  function setIndex(idx) {
    currentIndex = idx;
    var cards = grid.querySelectorAll('.explore-card');
    cards.forEach(function (c, i) { c.classList.toggle('is-active', i === idx); });
  }

  function goTo(idx) {
    var sec = SECTIONS[idx];
    if (!sec) return;
    close();
    var el = document.getElementById(sec.id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function move(dx, dy) {
    var row = Math.floor(currentIndex / COLS);
    var col = currentIndex % COLS;
    var newRow = row + dy;
    var newCol = col + dx;
    if (newRow < 0 || newRow >= Math.ceil(SECTIONS.length / COLS)) return;
    if (newCol < 0 || newCol >= COLS) return;
    var newIdx = newRow * COLS + newCol;
    if (newIdx >= SECTIONS.length) return;
    setIndex(newIdx);
    var cards = grid.querySelectorAll('.explore-card');
    if (cards[newIdx]) cards[newIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function onKey(e) {
    var key = e.key;
    if (key === 'Escape') { close(); return; }
    if (key === 'Enter') { goTo(currentIndex); return; }

    var handled = true;
    switch (key) {
      case 'w': case 'W': case 'ArrowUp': move(0, -1); break;
      case 's': case 'S': case 'ArrowDown': move(0, 1); break;
      case 'a': case 'A': case 'ArrowLeft': move(-1, 0); break;
      case 'd': case 'D': case 'ArrowRight': move(1, 0); break;
      default: handled = false;
    }
    if (handled) e.preventDefault();
  }

  function open() {
    build();
    isOpen = true;
    modal.classList.add('is-open');
    setIndex(0);
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (!modal) return;
    isOpen = false;
    modal.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
  }

  function init() {
    var btn = document.getElementById('explore-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (isOpen) close();
      else open();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
