(function () {
  'use strict';

  var elements = [];
  var ticking = false;

  function prefersReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function init() {
    if (prefersReduced()) return;

    document.querySelectorAll('[data-parallax-speed]').forEach(function (el) {
      var section = el.closest('[data-scroll]');
      if (!section) return;

      var speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0;
      var dir = el.getAttribute('data-parallax-dir') || 'y';

      el.style.willChange = 'transform';

      elements.push({
        el: el,
        section: section,
        speed: Math.min(speed, 1),
        dir: dir,
      });
    });

    if (elements.length === 0) return;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  function update() {
    var viewH = window.innerHeight;

    for (var i = 0; i < elements.length; i++) {
      var item = elements[i];
      var rect = item.section.getBoundingClientRect();
      var sectionTop = rect.top;
      var sectionBot = rect.bottom;

      if (sectionBot < -100 || sectionTop > viewH + 100) {
        if (item.el.style.transform) {
          item.el.style.transform = '';
        }
        continue;
      }

      var progress = (viewH - sectionTop) / (viewH + rect.height);
      progress = Math.max(0, Math.min(1, progress));

      var center = progress - 0.5;
      var offset = center * item.speed * 50;

      if (item.dir === 'x') {
        item.el.style.transform = 'translateX(' + offset.toFixed(1) + 'px)';
      } else {
        item.el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.__refreshParallax = function () {
    elements = [];
    init();
  };
})();
