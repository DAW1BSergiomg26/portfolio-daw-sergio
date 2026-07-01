function createSandbox(container, project) {
  container.innerHTML = '';

  if (!project.demo) {
    container.innerHTML = '<div class="sandbox-placeholder"><svg class="icon" aria-hidden="true" style="width:3rem;height:3rem;opacity:0.3;margin-bottom:1rem"><use href="icons.svg#icon-code"></use></svg><p data-i18n="demo_coming_soon">Demo en construcción</p></div>';
    return;
  }

  const loading = document.createElement('div');
  loading.className = 'sandbox-loading';
  loading.setAttribute('data-i18n', 'demo_loading');
  loading.textContent = 'Cargando demo...';
  container.appendChild(loading);

  const iframe = document.createElement('iframe');
  iframe.className = 'sandbox-frame';
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('title', 'Demo interactiva del proyecto');
  iframe.style.cssText = 'width:100%;border:0;border-radius:var(--radius-md);background:#fff;display:block';

  const send = (html, css, js) => {
    const doc = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>${css}</style>
<style>body{font-family:system-ui,-apple-system,sans-serif;padding:1.5rem;margin:0;background:#fff;color:#111}*{box-sizing:border-box}</style>
</head>
<body>${html}
<script>${js}<\/script>
</body>
</html>`;
    iframe.srcdoc = doc;
    container.innerHTML = '';
    container.appendChild(iframe);
    const resize = () => {
      try {
        const h = iframe.contentWindow.document.documentElement.scrollHeight;
        iframe.style.height = Math.min(h, 600) + 'px';
      } catch {}
    };
    iframe.addEventListener('load', resize);
    setTimeout(resize, 300);
    window.addEventListener('resize', resize);
  };

  if (typeof project.demo === 'string') {
    fetch(project.demo)
      .then(r => r.text())
      .then(text => { send(text, '', ''); })
      .catch(() => {
        container.innerHTML = '<div class="sandbox-placeholder"><p data-i18n="demo_error">Error al cargar la demo</p></div>';
      });
  } else if (project.demo.html !== undefined) {
    send(project.demo.html || '', project.demo.css || '', project.demo.js || '');
  } else {
    container.innerHTML = '<div class="sandbox-placeholder"><p data-i18n="demo_coming_soon">Demo en construcción</p></div>';
  }
}
