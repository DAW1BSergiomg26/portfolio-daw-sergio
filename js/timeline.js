(function () {
  'use strict';

  var DATA = [
    { skill: 'HTML5', color: '#e34f26', points: [
      { year: '2024-09', value: 55 }, { year: '2025-01', value: 70 },
      { year: '2025-06', value: 82 }, { year: '2026-01', value: 90 }
    ]},
    { skill: 'CSS3', color: '#1572b6', points: [
      { year: '2024-09', value: 45 }, { year: '2025-01', value: 60 },
      { year: '2025-06', value: 75 }, { year: '2026-01', value: 85 }
    ]},
    { skill: 'JavaScript', color: '#f7df1e', points: [
      { year: '2024-09', value: 25 }, { year: '2025-01', value: 40 },
      { year: '2025-06', value: 55 }, { year: '2026-01', value: 70 }
    ]},
    { skill: 'Git / GitHub', color: '#6e5494', points: [
      { year: '2024-09', value: 35 }, { year: '2025-01', value: 55 },
      { year: '2025-06', value: 68 }, { year: '2026-01', value: 80 }
    ]},
    { skill: 'Python', color: '#3776ab', points: [
      { year: '2024-09', value: 15 }, { year: '2025-01', value: 25 },
      { year: '2025-06', value: 35 }, { year: '2026-01', value: 40 }
    ]},
    { skill: 'SQL', color: '#e38c00', points: [
      { year: '2024-09', value: 10 }, { year: '2025-01', value: 20 },
      { year: '2025-06', value: 35 }, { year: '2026-01', value: 45 }
    ]},
  ];

  var canvas = document.getElementById('timeline-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var W = 0, H = 0;
  var animId = null;
  var tooltip = null;

  function getTheme() {
    var isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      text: isDark ? '#b7c0d8' : '#4b5163',
      grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      bg: isDark ? '#0d1220' : '#f6f7fb',
      tooltipBg: isDark ? '#1e293b' : '#ffffff',
      tooltipBorder: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    };
  }

  function labelForMonth(m) {
    var months = { '09': 'Sep', '01': 'Ene', '06': 'Jun' };
    return months[m] || m;
  }

  function resize() {
    var container = canvas.parentElement;
    var w = container.clientWidth;
    W = Math.min(w, 600);
    H = Math.round(W * 0.6);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    if (!canvas || W === 0) return;

    var PAD = { top: 20, right: 20, bottom: 35, left: 40 };
    var plotW = W - PAD.left - PAD.right;
    var plotH = H - PAD.top - PAD.bottom;
    var cols = getTheme();
    var allLabels = ['Sep 2024', 'Ene 2025', 'Jun 2025', 'Ene 2026'];
    var xPositions = [0, 0.33, 0.66, 1].map(function (t) { return PAD.left + t * plotW; });
    var hovered = null;

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    for (var v = 0; v <= 4; v++) {
      var y = PAD.top + plotH - (v / 4) * plotH;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(W - PAD.right, y);
      ctx.strokeStyle = cols.grid;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = cols.text;
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText((v * 25) + '%', PAD.left - 8, y);
    }

    // X labels
    for (var i = 0; i < allLabels.length; i++) {
      ctx.fillStyle = cols.text;
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(allLabels[i], xPositions[i], H - PAD.bottom + 8);
    }

    // Data lines
    for (var s = 0; s < DATA.length; s++) {
      var skill = DATA[s];
      var pts = skill.points;

      // Build path
      ctx.beginPath();
      for (var p = 0; p < pts.length; p++) {
        var x = xPositions[p];
        var y = PAD.top + plotH - (pts[p].value / 100) * plotH;
        if (p === 0) ctx.moveTo(x, y);
        else {
          var prevX = xPositions[p - 1];
          var prevY = PAD.top + plotH - (pts[p - 1].value / 100) * plotH;
          var cp1x = prevX + (x - prevX) * 0.4;
          var cp2x = prevX + (x - prevX) * 0.6;
          ctx.bezierCurveTo(cp1x, prevY, cp2x, y, x, y);
        }
      }
      ctx.strokeStyle = skill.color;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.85;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Points
      for (var p = 0; p < pts.length; p++) {
        var x = xPositions[p];
        var y = PAD.top + plotH - (pts[p].value / 100) * plotH;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = skill.color;
        ctx.fill();
        ctx.strokeStyle = cols.bg;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Legend
    var legendX = PAD.left;
    var legendY = H - 12;
    var legendItems = DATA.map(function (s) { return s.skill; });
    ctx.textBaseline = 'bottom';
    for (var i = 0; i < DATA.length; i++) {
      var text = DATA[i].skill;
      ctx.fillStyle = DATA[i].color;
      ctx.font = '10px Inter, system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(text, legendX, legendY);
      var tw = ctx.measureText(text).width;
      legendX += tw + 18;
    }
  }

  function init() {
    resize();
    window.addEventListener('resize', resize, { passive: true });

    var observer = new MutationObserver(function () { draw(); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
