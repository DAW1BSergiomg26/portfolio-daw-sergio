(function () {
  'use strict';

  var container = document.getElementById('gh-heatmap');
  if (!container) return;

  var contributions = [];
  var CELL = 12, GAP = 2, LABEL_W = 30, HEADER_H = 18;
  var cols = 53, rows = 7;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var W = 0, H = 0;

  canvas.className = 'heatmap-canvas';
  canvas.setAttribute('aria-label', 'Contribuciones en los ultimos 365 dias');
  container.appendChild(canvas);

  function getColor(val, max) {
    var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    if (val === 0) return isDark ? '#1e293b' : '#ebedf0';
    var intensity = Math.min(val / (max || 1), 1);
    if (intensity < 0.25) return isDark ? '#0d4a2e' : '#9be9a8';
    if (intensity < 0.5) return isDark ? '#146d3a' : '#40c463';
    if (intensity < 0.75) return isDark ? '#1a9e4a' : '#30a14e';
    return isDark ? '#2ed15a' : '#216e39';
  }

  function getTextColor() {
    return document.documentElement.getAttribute('data-theme') !== 'light' ? '#64748b' : '#94a3b8';
  }

  function resize() {
    var w = container.clientWidth;
    var colsFit = Math.floor((w - LABEL_W) / (CELL + GAP));
    cols = Math.min(colsFit, 53);
    W = LABEL_W + cols * (CELL + GAP) + 4;
    H = HEADER_H + rows * (CELL + GAP) + 4;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    if (contributions.length === 0) return;
    ctx.clearRect(0, 0, W, H);
    var max = Math.max.apply(null, contributions);
    var textColor = getTextColor();

    // Day labels (left)
    var days = ['', 'Lun', '', 'Mie', '', 'Vie', ''];
    if (document.documentElement.lang === 'en') days = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    for (var r = 0; r < 7; r++) {
      if (!days[r]) continue;
      ctx.fillStyle = textColor;
      ctx.font = '9px Inter, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(days[r], LABEL_W - 6, HEADER_H + r * (CELL + GAP) + CELL / 2);
    }

    // Month labels (top)
    var months = [];
    if (document.documentElement.lang === 'en') {
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    } else {
      months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
    var now = new Date();
    ctx.fillStyle = textColor;
    ctx.font = '9px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Find first day of data (most recent Sunday would be today if today is Sunday...)
    // Data starts 365 days ago
    var startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 364);
    // Adjust to Sunday
    var startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);

    for (var c = 0; c < cols; c++) {
      var cellDate = new Date(startDate);
      cellDate.setDate(cellDate.getDate() + c * 7);
      var m = cellDate.getMonth();
      // Only show if this is the first week of the month or the month changes
      var prevDate = new Date(cellDate);
      prevDate.setDate(prevDate.getDate() - 7);
      if (cellDate.getMonth() !== prevDate.getMonth() || c === 0) {
        ctx.fillText(months[m], LABEL_W + c * (CELL + GAP), 2);
      }
    }

    // Contribution cells
    for (var i = 0; i < contributions.length && i < cols * rows; i++) {
      var week = Math.floor(i / 7);
      var day = i % 7;
      var x = LABEL_W + week * (CELL + GAP);
      var y = HEADER_H + day * (CELL + GAP);
      var val = contributions[i] || 0;

      ctx.fillStyle = getColor(val, max);
      ctx.beginPath();
      ctx.roundRect(x, y, CELL, CELL, 2);
      ctx.fill();

      // Tooltip hover
      // (We'll skip tooltip for simplicity)
    }

    // Total count label
    var total = contributions.reduce(function (a, b) { return a + b; }, 0);
    ctx.fillStyle = textColor;
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    var totalText = document.documentElement.lang === 'en'
      ? total + ' contributions in the last year'
      : total + ' contribuciones en el ultimo ano';
    ctx.fillText(totalText, LABEL_W, H - 14);
  }

  function loadData() {
    fetch('data/contributions.json?v=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (data) {
        contributions = data;
        resize();
      })
      .catch(function () {
        container.innerHTML = '<p class="heatmap-empty">' +
          (document.documentElement.lang === 'en' ? 'No data available' : 'Datos no disponibles') + '</p>';
      });
  }

  function init() {
    loadData();
    window.addEventListener('resize', resize, { passive: true });

    var observer = new MutationObserver(function () {
      if (contributions.length) draw();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
