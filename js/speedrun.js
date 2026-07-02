(function () {
  'use strict';

  var POOL = [
    { title: 'HTML5 Semantico', titleEn: 'Semantic HTML5', desc: 'Estructura clara con header, main, section, article, aside y footer.', descEn: 'Clean structure with header, main, section, article, aside, footer.' },
    { title: 'CSS3 Responsive', titleEn: 'Responsive CSS3', desc: 'Layouts adaptativos con Grid, Flexbox y media queries.', descEn: 'Adaptive layouts with Grid, Flexbox, and media queries.' },
    { title: 'JavaScript DOM', titleEn: 'JavaScript DOM', desc: 'Manipulacion del DOM, eventos, Fetch y modales interactivos.', descEn: 'DOM manipulation, events, Fetch, and interactive modals.' },
    { title: 'Git & GitHub', titleEn: 'Git & GitHub', desc: 'Control de versiones con commits convencionales y ramas.', descEn: 'Version control with conventional commits and branches.' },
    { title: 'GitHub Pages', titleEn: 'GitHub Pages', desc: 'Despliegue continuo de proyectos estaticos publicados.', descEn: 'Continuous deployment of published static projects.' },
    { title: 'Datos JSON', titleEn: 'JSON Data', desc: 'Catalogo dinamico de proyectos gestionado con datos estructurados.', descEn: 'Dynamic project catalog managed with structured data.' },
    { title: 'SEO Tecnico', titleEn: 'Technical SEO', desc: 'Meta tags, Open Graph, JSON-LD, sitemap y robots.', descEn: 'Meta tags, Open Graph, JSON-LD, sitemap, and robots.' },
    { title: 'PWA', titleEn: 'PWA', desc: 'Service Worker con cache, offline y manifest de aplicacion.', descEn: 'Service Worker with cache, offline, and app manifest.' },
    { title: 'i18n', titleEn: 'i18n', desc: 'Internacionalizacion ES/EN con selector de idioma y traducciones.', descEn: 'ES/EN internationalization with language selector and translations.' },
    { title: 'SQL', titleEn: 'SQL', desc: 'Modelado de datos, consultas y normalizacion de bases de datos.', descEn: 'Data modeling, queries, and database normalization.' },
    { title: 'Python', titleEn: 'Python', desc: 'Scripts de automatizacion, logica basica y ejercicios practicos.', descEn: 'Automation scripts, basic logic, and practical exercises.' },
    { title: 'Colaboracion', titleEn: 'Collaboration', desc: 'Proyectos en equipo con flujo Git organizado y documentacion.', descEn: 'Team projects with organized Git flow and documentation.' },
  ];

  var modal = null;
  var timerInterval = null;
  var startTime = 0;
  var currentChallenge = 0;
  var challenges = [];
  var solved = false;
  var btn = null;

  function isEn() { return (document.documentElement.lang || 'es') === 'en'; }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function build() {
    modal = document.createElement('div');
    modal.className = 'speedrun-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', isEn() ? 'Hire Me Speedrun' : 'Speed-run Contratame');
    modal.innerHTML =
      '<div class="speedrun-overlay"></div>' +
      '<div class="speedrun-content">' +
        '<div class="speedrun-header">' +
          '<span class="speedrun-title">' + (isEn() ? 'Hire Me Speed-run' : 'Speed-run Contratame') + '</span>' +
          '<span class="speedrun-timer" id="speedrun-timer">00:00</span>' +
        '</div>' +
        '<div class="speedrun-progress" id="speedrun-progress"></div>' +
        '<div class="speedrun-body" id="speedrun-body"></div>' +
      '</div>';
    document.body.appendChild(modal);
  }

  function start() {
    if (!modal) build();
    challenges = shuffle(POOL.slice()).slice(0, 7);
    currentChallenge = 0;
    solved = false;

    modal.classList.add('is-open');
    document.getElementById('speedrun-progress').innerHTML = '';

    startTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 100);

    showChallenge();
  }

  function showChallenge() {
    var body = document.getElementById('speedrun-body');
    var ch = challenges[currentChallenge];
    var num = currentChallenge + 1;
    var total = challenges.length;

    // Update progress
    var progress = document.getElementById('speedrun-progress');
    progress.innerHTML = '';
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('span');
      dot.className = 'speedrun-dot' + (i < currentChallenge ? ' speedrun-dot--done' : '') + (i === currentChallenge ? ' speedrun-dot--current' : '');
      progress.appendChild(dot);
    }

    body.innerHTML =
      '<div class="speedrun-challenge">' +
        '<div class="speedrun-challenge-num">' + num + '/' + total + '</div>' +
        '<div class="speedrun-challenge-icon">*</div>' +
        '<h3 class="speedrun-challenge-title">' + (isEn() ? ch.titleEn : ch.title) + '</h3>' +
        '<p class="speedrun-challenge-desc">' + (isEn() ? ch.descEn : ch.desc) + '</p>' +
        '<button class="btn primary speedrun-challenge-btn" id="speedrun-next">' + (isEn() ? 'Complete' : 'Completar') + '</button>' +
      '</div>';

    document.getElementById('speedrun-next').addEventListener('click', next);
  }

  function next() {
    currentChallenge++;
    if (currentChallenge >= challenges.length) {
      finish();
    } else {
      showChallenge();
    }
  }

  function finish() {
    if (solved) return;
    solved = true;
    if (timerInterval) clearInterval(timerInterval);

    var elapsed = (Date.now() - startTime) / 1000;
    var secs = Math.round(elapsed);
    var grade = getGrade(secs);
    var gradeLabel = grade.label;
    var gradeDesc = grade.desc;

    var body = document.getElementById('speedrun-body');
    body.innerHTML =
      '<div class="speedrun-result">' +
        '<div class="speedrun-grade">' + gradeLabel + '</div>' +
        '<div class="speedrun-time">' + formatTime(elapsed) + '</div>' +
        '<p class="speedrun-grade-desc">' + gradeDesc + '</p>' +
        '<button class="btn primary" id="speedrun-retry">' + (isEn() ? 'Try Again' : 'Intentar de nuevo') + '</button>' +
        '<button class="btn ghost" id="speedrun-close">' + (isEn() ? 'Close' : 'Cerrar') + '</button>' +
      '</div>';

    document.getElementById('speedrun-retry').addEventListener('click', start);
    document.getElementById('speedrun-close').addEventListener('click', close);
  }

  function getGrade(secs) {
    if (secs < 15) return { label: 'S', desc: isEn() ? 'Godlike. Instant hire.' : 'Divino. Contratacion inmediata.' };
    if (secs < 25) return { label: 'A', desc: isEn() ? 'Excellent. Strong candidate.' : 'Excelente. Candidato solido.' };
    if (secs < 40) return { label: 'B', desc: isEn() ? 'Great. Shows solid skills.' : 'Muy bien. Demuestra solidez.' };
    if (secs < 60) return { label: 'C', desc: isEn() ? 'Good. Consistent knowledge.' : 'Bien. Conocimiento consistente.' };
    return { label: 'D', desc: isEn() ? 'Keep practicing. Room to grow.' : 'Sigue practicando. Espacio para crecer.' };
  }

  function updateTimer() {
    var elapsed = (Date.now() - startTime) / 1000;
    document.getElementById('speedrun-timer').textContent = formatTime(elapsed);
  }

  function formatTime(secs) {
    var m = Math.floor(secs / 60);
    var s = Math.floor(secs % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function close() {
    modal.classList.remove('is-open');
    if (timerInterval) clearInterval(timerInterval);
  }

  function init() {
    btn = document.getElementById('speedrun-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      start();
    });

    // Close on overlay click
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('speedrun-overlay')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
