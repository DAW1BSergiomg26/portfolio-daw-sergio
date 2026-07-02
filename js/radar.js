(function () {
  'use strict';

  var SKILLS = [
    { label: 'HTML5', value: 90 },
    { label: 'CSS3', value: 85 },
    { label: 'JavaScript', value: 70 },
    { label: 'JSON', value: 70 },
    { label: 'Git / GitHub', value: 80 },
    { label: 'Responsive', value: 80 },
    { label: 'SEO', value: 60 },
    { label: 'Python', value: 40 },
    { label: 'SQL', value: 45 },
  ];

  var canvas = document.getElementById('radar-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var size = 0;  // will be set in resize
  var animId = null;

  function getThemeColors() {
    var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      grid: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      gridLabel: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
      label: isDark ? '#b7c0d8' : '#4b5163',
      fill: isDark ? 'rgba(125,211,252,0.15)' : 'rgba(2,132,199,0.12)',
      stroke: isDark ? '#7dd3fc' : '#0284c7',
      accent2: isDark ? '#a78bfa' : '#7c3aed',
    };
  }

  function resize() {
    var container = canvas.parentElement;
    var w = container.clientWidth;
    size = Math.min(w, 480);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    if (!canvas || size === 0) return;
    var cx = size / 2;
    var cy = size / 2;
    var radius = size * 0.35;
    var cols = getThemeColors();
    var count = SKILLS.length;

    ctx.clearRect(0, 0, size, size);

    // --- Grid rings (5 levels) ---
    var rings = 5;
    for (var r = 1; r <= rings; r++) {
      var ringR = (radius / rings) * r;
      ctx.beginPath();
      for (var i = 0; i <= count; i++) {
        var angle = (Math.PI * 2 / count) * i - Math.PI / 2;
        var x = cx + ringR * Math.cos(angle);
        var y = cy + ringR * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = cols.grid;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ring label (percentage)
      if (r < rings) {
        var pct = Math.round((r / rings) * 100);
        ctx.fillStyle = cols.gridLabel;
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pct + '%', cx + ringR + 8, cy);
      }
    }

    // --- Axis lines ---
    for (var i = 0; i < count; i++) {
      var angle = (Math.PI * 2 / count) * i - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.strokeStyle = cols.grid;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // --- Data polygon ---
    // Build points
    var points = [];
    for (var i = 0; i < count; i++) {
      var angle = (Math.PI * 2 / count) * i - Math.PI / 2;
      var val = SKILLS[i].value / 100;
      var px = cx + radius * val * Math.cos(angle);
      var py = cy + radius * val * Math.sin(angle);
      points.push({ x: px, y: py });
    }

    // Fill
    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
      if (i === 0) ctx.moveTo(points[i].x, points[i].y);
      else ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    var gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    gradient.addColorStop(0, isDark ? 'rgba(125,211,252,0.25)' : 'rgba(2,132,199,0.2)');
    gradient.addColorStop(1, isDark ? 'rgba(167,139,250,0.08)' : 'rgba(124,58,237,0.06)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Stroke
    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
      if (i === 0) ctx.moveTo(points[i].x, points[i].y);
      else ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.strokeStyle = cols.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();

    // --- Data points ---
    for (var i = 0; i < points.length; i++) {
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? cols.stroke : cols.accent2;
      ctx.fill();
      ctx.strokeStyle = isDark ? '#070911' : '#f6f7fb';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // --- Labels ---
    for (var i = 0; i < count; i++) {
      var angle = (Math.PI * 2 / count) * i - Math.PI / 2;
      var labelR = radius * 1.18;
      var lx = cx + labelR * Math.cos(angle);
      var ly = cy + labelR * Math.sin(angle);

      ctx.fillStyle = cols.label;
      ctx.font = '600 11px Inter, system-ui, sans-serif';
      ctx.textAlign = angle > Math.PI / 2 && angle < Math.PI * 1.5 ? 'right' :
                       angle > -Math.PI / 2 && angle < Math.PI / 2 ? 'left' : 'center';
      ctx.textBaseline = angle > 0 ? 'top' : 'bottom';
      ctx.fillText(SKILLS[i].label, lx, ly);
    }
  }

  function init() {
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Re-draw on theme change
    var observer = new MutationObserver(function () {
      draw();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
