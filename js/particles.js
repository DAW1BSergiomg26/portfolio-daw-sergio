(function () {
  'use strict';

  const CONFIG = {
    count: 90,
    speed: 0.25,
    connectDist: 150,
    particleRadius: 1.8,
    lineWidth: 0.8,
    mouseRadius: 120,
    mouseForce: 0.4,
  };

  let canvas, ctx, particles, mouse, animId, theme;

  mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };

  function getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return {
      particle: isDark ? '180, 200, 240' : '30, 40, 60',
      lineBase: isDark ? '125, 211, 252' : '2, 132, 199',
      lineAlt: isDark ? '167, 139, 250' : '124, 58, 237',
      glow: isDark ? '60, 140, 220' : '60, 120, 200',
    };
  }

  function resize() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles(w, h) {
    const arr = [];
    for (let i = 0; i < CONFIG.count; i++) {
      arr.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed,
        r: CONFIG.particleRadius * (0.5 + Math.random() * 0.8),
        phase: Math.random() * Math.PI * 2,
        baseVx: (Math.random() - 0.5) * CONFIG.speed,
        baseVy: (Math.random() - 0.5) * CONFIG.speed,
      });
    }
    return arr;
  }

  function draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cols = getColors();

    ctx.clearRect(0, 0, w, h);

    // Update particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Mouse interaction
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (1 - dist / CONFIG.mouseRadius) * CONFIG.mouseForce;
        p.vx -= (dx / dist) * force;
        p.vy -= (dy / dist) * force;
      }

      // Return to base speed
      p.vx += (p.baseVx - p.vx) * 0.01;
      p.vy += (p.baseVy - p.vy) * 0.01;

      // Wrap around edges
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      // Dim glow per particle
      const alpha = 0.5 + 0.5 * Math.sin(Date.now() * 0.001 + p.phase);

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cols.particle}, ${0.5 + 0.3 * alpha})`;
      ctx.fill();

      // Glow ring
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cols.glow}, ${0.06 * alpha})`;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = dx * dx + dy * dy;

        if (dist < CONFIG.connectDist * CONFIG.connectDist) {
          const normDist = Math.sqrt(dist);
          const strength = 1 - normDist / CONFIG.connectDist;
          const alpha = strength * 0.35;

          const lineColor = (i + j) % 2 === 0 ? cols.lineBase : cols.lineAlt;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
          ctx.lineWidth = CONFIG.lineWidth * strength;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  function init() {
    if (canvas) return;

    canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    ctx = canvas.getContext('2d');

    resize();
    particles = createParticles(window.innerWidth, window.innerHeight);

    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    window.addEventListener('resize', () => {
      resize();
      particles = createParticles(window.innerWidth, window.innerHeight);
    });

    const observer = new MutationObserver(() => {
      theme = document.documentElement.getAttribute('data-theme');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
