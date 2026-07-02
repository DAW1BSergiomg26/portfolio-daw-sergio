(function () {
  'use strict';

  var DEFAULT_HTML = '<h1>Hola, mundo!</h1>\n<p>Esta es una demo en vivo.</p>';
  var DEFAULT_CSS = 'body {\n  font-family: system-ui;\n  padding: 2rem;\n  background: #f6f7fb;\n  color: #0f1221;\n}';
  var DEFAULT_JS = '// Escribe JavaScript aqui\ndocument.querySelector("h1").style.color = "#0284c7";';

  var htmlEl = document.getElementById('sandbox-html');
  var cssEl = document.getElementById('sandbox-css');
  var jsEl = document.getElementById('sandbox-js');
  var frameEl = document.getElementById('sandbox-frame');
  var runBtn = document.getElementById('sandbox-run');
  var resetBtn = document.getElementById('sandbox-reset');
  var tabBtns = document.querySelectorAll('.sandbox-tab');

  var debounceTimer = null;

  function getThemeColors() {
    var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      bg: isDark ? '#0d1220' : '#f6f7fb',
      text: isDark ? '#f6f7fb' : '#0f1221',
    };
  }

  function buildDocument(htmlCode, cssCode, jsCode) {
    var cols = getThemeColors();
    return '<!DOCTYPE html><html>' +
      '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>' + (cssCode || '') + '</style>' +
      '</head><body>' +
      (htmlCode || '') +
      '<script>' + (jsCode || '') + '<\/script>' +
      '</body></html>';
  }

  function run() {
    var html = htmlEl.value;
    var css = cssEl.value;
    var js = jsEl.value;
    var doc = buildDocument(html, css, js);
    frameEl.srcdoc = doc;
  }

  function debouncedRun() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(run, 500);
  }

  function switchTab(btn) {
    tabBtns.forEach(function (b) { b.classList.remove('is-active'); });
    btn.classList.add('is-active');

    var target = btn.getAttribute('data-panel');
    document.querySelectorAll('.sandbox-panel').forEach(function (p) {
      p.classList.remove('is-active');
    });
    var panel = document.getElementById('sandbox-panel-' + target);
    if (panel) panel.classList.add('is-active');
  }

  function resetCode() {
    htmlEl.value = DEFAULT_HTML;
    cssEl.value = DEFAULT_CSS;
    jsEl.value = DEFAULT_JS;
    run();
  }

  function init() {
    // Set defaults
    htmlEl.value = DEFAULT_HTML;
    cssEl.value = DEFAULT_CSS;
    jsEl.value = DEFAULT_JS;

    // Tabs
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { switchTab(btn); });
    });

    // Auto-run
    htmlEl.addEventListener('input', debouncedRun);
    cssEl.addEventListener('input', debouncedRun);
    jsEl.addEventListener('input', debouncedRun);

    // Buttons
    if (runBtn) runBtn.addEventListener('click', run);
    if (resetBtn) resetBtn.addEventListener('click', resetCode);

    // Initial run
    run();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
