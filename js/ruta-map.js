(function () {
  const CONTAINER_ID = 'ruta-map-container';
  let mapData = null;
  let currentLang = localStorage.getItem('lang') || 'es';
  let activeIsland = null;
  let svgNS = 'http://www.w3.org/2000/svg';

  async function init() {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;
    try {
      const res = await fetch('data/ruta.json?v=3.11.0');
      mapData = await res.json();
      render(container);
    } catch (e) {
      console.error('[RutaMap] Error:', e);
      container.innerHTML = '<p style="text-align:center;color:var(--muted)">Error al cargar el mapa</p>';
    }
  }

  function t(textEs, textEn) {
    return currentLang === 'en' && textEn ? textEn : textEs;
  }

  function render(container) {
    const isCurrent = currentLang === 'en' ? 'en' : 'es';
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'ruta-map-wrapper';

    const legend = document.createElement('div');
    legend.className = 'ruta-legend';
    legend.innerHTML = `<div class="ruta-legend-item"><span class="ruta-dot completed"></span> Completado</div>
<div class="ruta-legend-item"><span class="ruta-dot current"></span> ${t('Actual', 'Current')}</div>`;
    wrapper.appendChild(legend);

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 65');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.classList.add('ruta-svg');

    const bg = document.createElementNS(svgNS, 'rect');
    bg.setAttribute('width', '100');
    bg.setAttribute('height', '65');
    bg.setAttribute('fill', 'none');
    svg.appendChild(bg);

    const defs = document.createElementNS(svgNS, 'defs');
    defs.innerHTML = `
      <filter id="ruta-glow">
        <feGaussianBlur stdDeviation="1" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="ruta-glow-strong">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    `;
    svg.appendChild(defs);

    const connGroup = document.createElementNS(svgNS, 'g');
    connGroup.classList.add('ruta-connections');
    connGroup.setAttribute('stroke', 'var(--line)');
    connGroup.setAttribute('stroke-width', '1.5');
    connGroup.setAttribute('fill', 'none');
    connGroup.setAttribute('stroke-dasharray', '4,3');
    connGroup.setAttribute('opacity', '0.5');
    svg.appendChild(connGroup);

    const islandGroup = document.createElementNS(svgNS, 'g');
    islandGroup.classList.add('ruta-islands');
    svg.appendChild(islandGroup);

    const labelGroup = document.createElementNS(svgNS, 'g');
    labelGroup.classList.add('ruta-labels');
    svg.appendChild(labelGroup);

    const islandPositions = {};
    mapData.islands.forEach(function (isl) {
      islandPositions[isl.id] = isl.position;
    });

    mapData.connections.forEach(function (conn) {
      const from = islandPositions[conn.from];
      const to = islandPositions[conn.to];
      if (!from || !to) return;
      const line = document.createElementNS(svgNS, 'path');
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;
      const cy = my - 6;
      line.setAttribute('d', 'M' + from.x + ',' + from.y + ' Q' + mx + ',' + cy + ' ' + to.x + ',' + to.y);
      connGroup.appendChild(line);
    });

    mapData.islands.forEach(function (isl) {
      const g = document.createElementNS(svgNS, 'g');
      g.classList.add('ruta-island');
      g.dataset.id = isl.id;
      g.style.cursor = 'pointer';
      g.setAttribute('filter', isl.status === 'current' ? 'url(#ruta-glow-strong)' : 'url(#ruta-glow)');

      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', isl.position.x);
      circle.setAttribute('cy', isl.position.y);
      circle.setAttribute('r', isl.status === 'current' ? '5' : '4');
      circle.setAttribute('fill', isl.color);
      circle.setAttribute('stroke', 'var(--bg)');
      circle.setAttribute('stroke-width', '1.5');
      circle.setAttribute('opacity', isl.status === 'current' ? '1' : '0.85');
      g.appendChild(circle);

      if (isl.status === 'current') {
        const pulse = document.createElementNS(svgNS, 'circle');
        pulse.setAttribute('cx', isl.position.x);
        pulse.setAttribute('cy', isl.position.y);
        pulse.setAttribute('r', '7');
        pulse.setAttribute('fill', 'none');
        pulse.setAttribute('stroke', isl.color);
        pulse.setAttribute('stroke-width', '1.5');
        pulse.setAttribute('opacity', '0.4');
        pulse.classList.add('ruta-pulse');
        g.appendChild(pulse);
      }

      islandGroup.appendChild(g);

      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', isl.position.x);
      text.setAttribute('y', isl.position.y + 10);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'var(--muted)');
      text.setAttribute('font-size', '2.5');
      text.setAttribute('font-weight', '600');
      text.setAttribute('font-family', 'system-ui, sans-serif');
      text.textContent = t(isl.titleEs, isl.titleEn);
      labelGroup.appendChild(text);

      g.addEventListener('click', function () { toggleIsland(isl.id); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleIsland(isl.id); } });
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', t(isl.titleEs, isl.titleEn));
    });

    const player = document.createElementNS(svgNS, 'g');
    player.setAttribute('filter', 'url(#ruta-glow)');
    const lastIsland = mapData.islands[mapData.islands.length - 1];
    const px = lastIsland.position.x + 9;
    const py = lastIsland.position.y - 4;
    const ship = document.createElementNS(svgNS, 'text');
    ship.setAttribute('x', px);
    ship.setAttribute('y', py);
    ship.setAttribute('text-anchor', 'middle');
    ship.setAttribute('font-size', '6');
    ship.setAttribute('dominant-baseline', 'central');
    ship.textContent = '⛵';
    player.appendChild(ship);
    svg.appendChild(player);

    wrapper.appendChild(svg);

    const detailPanel = document.createElement('div');
    detailPanel.className = 'ruta-detail';
    detailPanel.id = 'ruta-detail-panel';
    wrapper.appendChild(detailPanel);

    container.appendChild(wrapper);
  }

  function toggleIsland(id) {
    const isl = mapData.islands.find(function (i) { return i.id === id; });
    if (!isl) return;
    const panel = document.getElementById('ruta-detail-panel');
    if (!panel) return;

    if (activeIsland === id) {
      panel.classList.remove('open');
      activeIsland = null;
      return;
    }

    activeIsland = id;
    const isEn = currentLang === 'en';
    const title = isEn ? isl.titleEn : isl.titleEs;
    const period = isEn ? isl.periodEn : isl.periodEs;
    const desc = isEn ? isl.descriptionEn : isl.descriptionEs;

    panel.innerHTML = `
      <button class="ruta-detail-close" aria-label="Cerrar">&times;</button>
      <div class="ruta-detail-color" style="background:${isl.color}"></div>
      <h3>${title}</h3>
      <span class="ruta-detail-period">${period}</span>
      <p>${desc}</p>
      <div class="ruta-detail-tech">${isl.technologies.map(function (t) { return '<span class="ruta-tech-tag">' + t + '</span>'; }).join('')}</div>
    `;

    panel.querySelector('.ruta-detail-close').addEventListener('click', function () {
      panel.classList.remove('open');
      activeIsland = null;
    });

    panel.classList.add('open');
  }

  document.addEventListener('languagechange', function (e) {
    currentLang = e.detail.lang || 'es';
    const container = document.getElementById(CONTAINER_ID);
    if (container && mapData) {
      activeIsland = null;
      render(container);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
