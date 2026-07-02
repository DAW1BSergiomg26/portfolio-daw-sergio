import * as THREE from 'three';

const RADIUS = 9;
const CARD_W = 4;
const CARD_H = 6;
const AUTO_SPEED = 0.0008;

let currentLang = 'es';

export async function initCarousel(containerId) {
  const container = document.getElementById(containerId);
  if (!container || container.dataset.carouselInited) return;
  container.dataset.carouselInited = '1';

  const loader = container.querySelector('.hero-carousel-loader');
  if (loader) loader.style.display = 'none';

  let projects;
  try {
    const res = await fetch(`data/projects.json?v=${Date.now()}`);
    projects = await res.json();
  } catch { return; }

  const items = projects
    .filter(p => p.featured || p.status === 'published')
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 8);

  if (!items.length) return;

  currentLang = localStorage.getItem('lang') || 'es';
  document.addEventListener('languagechange', e => {
    currentLang = e.detail?.lang || 'es';
  });

  const w = container.clientWidth || 600;
  const h = container.clientHeight || 500;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
  camera.position.set(0, 2, 18);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  addParticles(scene);
  addAmbientLight(scene);

  const group = new THREE.Group();
  scene.add(group);

  const cards = [];
  items.forEach((proj, i) => {
    const angle = (i / items.length) * Math.PI * 2;
    const tex = createCardTexture(proj);
    const geo = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, transparent: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS);
    mesh.lookAt(0, 0, 0);
    mesh.userData.project = proj;
    group.add(mesh);
    cards.push(mesh);
  });

  let mouseX = 0, mouseY = 0;
  let targetRX = 0, targetRY = 0;

  const onPointer = (cx, cy) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((cx - rect.left) / rect.width) * 2 - 1;
    mouseY = -((cy - rect.top) / rect.height) * 2 + 1;
  };

  container.addEventListener('mousemove', e => onPointer(e.clientX, e.clientY));
  container.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (t) onPointer(t.clientX, t.clientY);
  }, { passive: true });
  container.addEventListener('touchend', () => { mouseX = 0; mouseY = 0; });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const onClick = (e) => {
    const rect = container.getBoundingClientRect();
    const cx = e.clientX || (e.changedTouches?.[0]?.clientX ?? 0);
    const cy = e.clientY || (e.changedTouches?.[0]?.clientY ?? 0);
    pointer.x = ((cx - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((cy - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(cards);
    if (hits.length) openProjectModal(hits[0].object.userData.project);
  };

  container.addEventListener('click', onClick);
  container.addEventListener('touchend', (e) => {
    if (e.changedTouches?.length) onClick(e);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    group.rotation.y += AUTO_SPEED * dt * 30;
    targetRY += (mouseX * 0.4 - targetRY) * 0.05;
    targetRX += (mouseY * 0.15 - targetRX) * 0.05;
    group.rotation.y += targetRY * 0.02;
    group.rotation.x = targetRX * 0.2;
    renderer.render(scene, camera);
  }
  animate();

  const ro = new ResizeObserver(() => {
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    if (cw && ch) {
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    }
  });
  ro.observe(container);

  const themeObserver = new MutationObserver(() => {
    cards.forEach(mesh => {
      const tex = createCardTexture(mesh.userData.project, true);
      mesh.material.map = tex;
      mesh.material.needsUpdate = true;
    });
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

function addParticles(scene) {
  const count = 600;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 60;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x7dd3fc,
    size: 0.04,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(geo, mat);
  points.position.y = -5;
  scene.add(points);
}

function addAmbientLight(scene) {
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(1, 2, 1);
  scene.add(dir);
}

function createCardTexture(project, forceNew) {
  const w = 512, h = 704;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const bg1 = project.featured ? (isDark ? '#1a1a3e' : '#e8e0ff') : (isDark ? '#1a2a3e' : '#e0e8ff');
  const bg2 = project.featured ? (isDark ? '#0d0d2b' : '#d0c8f0') : (isDark ? '#0d1a2b' : '#c8d8f0');

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, bg1);
  grad.addColorStop(1, bg2);
  ctx.fillStyle = grad;
  roundRect(ctx, 0, 0, w, h, 24);
  ctx.fill();

  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 2;
  roundRect(ctx, 1, 1, w - 2, h - 2, 24);
  ctx.stroke();

  const badge = project.badge;
  if (badge) {
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = isDark ? 'rgba(125,211,252,0.85)' : 'rgba(2,132,199,0.85)';
    ctx.fillText(badge.label, w - 24, 42);
  }

  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = isDark ? '#f6f7fb' : '#0f1221';
  const projTitle = currentLang === 'en' && project.title_en ? project.title_en : project.title;
  const lines = wrapText(ctx, projTitle, w - 64, 24);
  let ty = 90;
  lines.forEach(l => { ctx.fillText(l, 32, ty); ty += 30; });

  const kickerKey = currentLang === 'en' && project.kicker_en ? 'kicker_en' : 'kicker';
  const kicker = project[kickerKey] || project.kicker;
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillStyle = isDark ? '#b7c0d8' : '#4b5163';
  const ky = Math.min(ty + 22, 280);
  ctx.fillText(kicker.substring(0, 50), 32, ky);

  const tags = project.technologies.slice(0, 5);
  let tx = 32;
  let tagY = Math.min(ky + 60, 340);
  tags.forEach(t => {
    ctx.font = '13px system-ui, sans-serif';
    const tw = ctx.measureText(t).width + 22;
    if (tx + tw > w - 32) { tx = 32; tagY += 32; }
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    roundRect(ctx, tx, tagY - 13, tw, 26, 13);
    ctx.fill();
    ctx.fillStyle = isDark ? '#7dd3fc' : '#0284c7';
    ctx.fillText(t, tx + 11, tagY + 4);
    tx += tw + 8;
  });

  ctx.font = '14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
  const hint = currentLang === 'en' ? '✦ Click to explore ✦' : '✦ Click para explorar ✦';
  ctx.fillText(hint, w / 2, h - 32);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function wrapText(ctx, text, maxW, fontSize) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  words.forEach(w => {
    const test = cur + w + ' ';
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur.trim());
      cur = w + ' ';
    } else cur = test;
  });
  lines.push(cur.trim());
  return lines;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function openProjectModal(project) {
  try {
    const existing = document.querySelector('.project-modal-overlay');
    if (existing) existing.remove();

    const lang = currentLang;
    const isEn = lang === 'en';
    const title = project[`title_${lang}`] || project.title;
    const desc = project[`description_${lang}`] || project.description;
    const kicker = project[`kicker_${lang}`] || project.kicker;
    const learning = project[`learning_${lang}`] || project.learning;
    const role = project[`portfolioRole_${lang}`] || project.portfolioRole;
    const status = project.badge?.status || '';
    const techs = project.technologies || [];

    const overlay = document.createElement('div');
    overlay.className = 'project-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', title);

    let linksHtml = '';
    (project.links || []).forEach(l => {
      const url = l.url.replace(/"/g, '&quot;');
      const label = l.label.replace(/"/g, '&quot;');
      linksHtml += `<a href="${url}" target="_blank" rel="noopener noreferrer" class="btn ghost">${label}</a>`;
    });

    const safe = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] || c);

    modal.innerHTML = `
      <button class="project-modal-close" aria-label="${isEn ? 'Close' : 'Cerrar'}">&times;</button>
      <div class="project-modal-header">
        <span class="project-modal-badge">${safe(status)}</span>
        <p class="project-modal-kicker">${safe(kicker)}</p>
        <h2>${safe(title)}</h2>
      </div>
      <div class="project-modal-body">
        <p class="project-modal-desc">${safe(desc)}</p>
        <div class="project-modal-techs">${techs.map(t => `<span class="project-modal-tag">${safe(t)}</span>`).join('')}</div>
        <details class="project-modal-details">
          <summary>${isEn ? 'Learning &amp; role' : 'Aprendizaje y rol'}</summary>
          <p><strong>${isEn ? 'Learning' : 'Aprendizaje'}:</strong> ${safe(learning)}</p>
          <p><strong>${isEn ? 'Role in portfolio' : 'Rol en el portfolio'}:</strong> ${safe(role)}</p>
        </details>
      </div>
      <div class="project-modal-actions">${linksHtml}</div>
    `;

    modal.querySelector('.project-modal-close').onclick = () => overlay.remove();
    modal.addEventListener('click', e => e.stopPropagation());
    overlay.addEventListener('click', () => overlay.remove());

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));
  } catch (e) {
    console.error('[Carousel] Error al abrir modal:', e);
  }
}
