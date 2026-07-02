(function () {
  'use strict';

  var glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  var mx = -200, my = -200;
  var cx = -200, cy = -200;
  var animId = null;
  var size = 180;

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;
  }

  function onLeave() {
    mx = -200;
    my = -200;
  }

  function onOver(el) {
    el.addEventListener('mouseenter', function () {
      glow.classList.add('cursor-glow--interact');
    });
    el.addEventListener('mouseleave', function () {
      glow.classList.remove('cursor-glow--interact');
    });
  }

  function animate() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    glow.style.transform = 'translate(' + (cx - size / 2) + 'px, ' + (cy - size / 2) + 'px)';
    animId = requestAnimationFrame(animate);
  }

  function init() {
    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave, { passive: true });

    // Interactive elements
    document.querySelectorAll('a, button, .project-card, .guestbook-entry, .filter-btn, .sandbox-tab').forEach(onOver);

    animate();
  }

  if (window.matchMedia('(pointer: coarse)').matches) {
    // Touch device, disable
    glow.style.display = 'none';
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
