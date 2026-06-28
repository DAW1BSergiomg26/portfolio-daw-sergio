# Auditoría de calidad - Portfolio DAW v2.3.0

Documento de control técnico para validar el Portfolio DAW de Sergio Daniel Martínez Gómez antes de cada versión estable.

## Estado de la auditoría

- Versión objetivo: v2.3.0
- Rama de trabajo: `feature/auditoria-calidad-v2`
- Estado: lista para revisión manual
- URL pública: https://daw1bsergiomg26.github.io/portfolio-daw-sergio/

## 1. Rendimiento

### Objetivo

Mantener el portfolio ligero, rápido y estable en GitHub Pages, sin dependencias innecesarias ni recursos pesados.

### Checklist

- [x] Proyecto sin framework pesado.
- [x] Proyecto sin WebGL obligatorio.
- [x] Proyecto sin Three.js innecesario.
- [x] CSS y JavaScript separados.
- [x] Assets versionados por query string.
- [x] Catálogo de proyectos cargado desde JSON.
- [x] Imagen Open Graph en SVG.
- [x] Sin imágenes pesadas nuevas.
- [x] Sin errores visibles en consola durante prueba local.

### Comandos útiles

```powershell
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/" -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/js/app.js?v=2.2.0" -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/css/styles.css?v=2.2.0" -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/css/filters.css?v=2.2.0" -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/data/projects.json?v=2.2.0" -UseBasicParsing | Select-Object StatusCode
```

## 2. Accesibilidad

### Objetivo

Garantizar una navegación básica accesible, especialmente con teclado y lectores de pantalla.

### Checklist

- [x] Idioma declarado en HTML: `lang="es"`.
- [x] Un único `h1` principal.
- [x] Secciones principales con estructura semántica.
- [x] Navegación principal con `aria-label`.
- [x] Botón de menú con `aria-expanded`.
- [x] Contador de proyectos con `aria-live`.
- [x] Secciones principales con `aria-labelledby`.
- [x] Icono decorativo marcado con `aria-hidden`.
- [x] Skip link para saltar al catálogo de proyectos.
- [x] Foco visible para navegación por teclado.
- [x] Compatibilidad con `prefers-reduced-motion` en animaciones destacadas.

### Prueba manual

1. Abrir la web.
2. Pulsar `Tab` desde el inicio.
3. Confirmar que aparece el enlace "Saltar al catálogo de proyectos".
4. Confirmar que el foco visible se ve claramente.
5. Navegar por menú, filtros, buscador y botones.
6. Confirmar que no se bloquea ninguna interacción con teclado.

## 3. SEO y presentación externa

### Objetivo

Preparar el portfolio para buscadores, GitHub, LinkedIn, WhatsApp y presentación académica/profesional.

### Checklist

- [x] Título SEO profesional.
- [x] Meta description optimizada.
- [x] Canonical definido.
- [x] Robots meta definido.
- [x] Open Graph completo.
- [x] Twitter Card `summary_large_image`.
- [x] Imagen Open Graph propia: `og-image.svg`.
- [x] JSON-LD con `ProfilePage`.
- [x] JSON-LD con `Person`.
- [x] JSON-LD con `ItemList`.
- [x] Sitemap publicado.
- [x] Robots.txt publicado.

### Comandos útiles

```powershell
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/" -UseBasicParsing | Select-String "summary_large_image"
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/" -UseBasicParsing | Select-String "application/ld+json"
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/og-image.svg" -UseBasicParsing | Select-Object StatusCode
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/sitemap.xml" -UseBasicParsing | Select-String "lastmod"
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/robots.txt" -UseBasicParsing | Select-String "Sitemap"
```

## 4. PWA ligera

### Objetivo

Mantener una configuración PWA básica, limpia y compatible con GitHub Pages.

### Checklist

- [x] Manifest enlazado desde HTML.
- [x] `name` definido.
- [x] `short_name` definido.
- [x] `description` definido.
- [x] `id` definido.
- [x] `start_url` dentro del scope del proyecto.
- [x] `scope` definido.
- [x] `display` en modo `standalone`.
- [x] `theme_color` definido.
- [x] `background_color` definido.
- [x] Icono SVG definido.
- [x] Metadatos Apple/PWA añadidos.
- [x] Apple touch icon configurado.

### Comandos útiles

```powershell
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/site.webmanifest" -UseBasicParsing | Select-String '"id"'
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/site.webmanifest" -UseBasicParsing | Select-String '"scope"'
Invoke-WebRequest "https://daw1bsergiomg26.github.io/portfolio-daw-sergio/" -UseBasicParsing | Select-String "apple-mobile-web-app-title"
```

## 5. Catálogo de proyectos

### Objetivo

Garantizar que el catálogo JSON, filtros, dashboard, búsqueda y panel destacado siguen funcionando.

### Checklist

- [x] `data/projects.json` existe.
- [x] El catálogo renderiza tarjetas desde JSON.
- [x] Hay 16 proyectos catalogados.
- [x] El dashboard muestra totales.
- [x] El filtro "Todos" muestra el catálogo completo.
- [x] El filtro "Destacados" usa `featured: true`.
- [x] El buscador filtra por texto y metadatos.
- [x] Las tarjetas premium se conservan.
- [x] El panel destacado no se corta en desktop.
- [x] El panel destacado funciona en móvil.

### Prueba manual

1. Abrir `#proyectos`.
2. Confirmar que se muestra el panel de proyectos destacados.
3. Confirmar que el contador muestra 16 proyectos.
4. Pulsar "Destacados" y comprobar que muestra solo proyectos destacados.
5. Buscar `Python`, `Auri`, `BBDD`, `Divina` y confirmar resultados.
6. Probar en ancho móvil desde DevTools.

## 6. Responsive

### Objetivo

Comprobar que el portfolio no se rompe en móvil, tablet ni escritorio.

### Checklist

- [x] Menú móvil visible y funcional.
- [x] Hero legible en móvil.
- [x] Botones táctiles suficientemente grandes.
- [x] Panel destacado adaptado a móvil.
- [x] Dashboard responsive.
- [x] Filtros en varias líneas sin romper el layout.
- [x] Tarjetas de proyecto legibles.
- [x] Sin scroll horizontal no deseado.

### Anchos recomendados para probar

- 393 px: móvil pequeño.
- 768 px: tablet.
- 1366 px: portátil.
- 1920 px: escritorio amplio.

## 7. Enlaces principales

### Objetivo

Evitar enlaces rotos en las rutas más importantes del portfolio.

### Checklist

- [x] URL principal responde 200.
- [x] `css/styles.css` responde 200.
- [x] `css/filters.css` responde 200.
- [x] `js/app.js` responde 200.
- [x] `data/projects.json` responde 200.
- [x] `og-image.svg` responde 200.
- [x] `site.webmanifest` responde 200.
- [x] `robots.txt` responde 200.
- [x] `sitemap.xml` responde 200.

## 8. Criterio 3D aplicado

### Diagnóstico

El portfolio incluye una capa visual con profundidad CSS 3D en el panel de destacados, pero evita WebGL obligatorio.

### Decisión técnica

- Se descarta Three.js por ahora porque el objetivo actual es presentación profesional, catálogo y rendimiento.
- Se mantiene CSS 3D ligero porque aporta jerarquía visual sin coste alto.
- Se evita cargar modelos GLB/GLTF, texturas, postprocessing o escenas WebGL.
- Se prioriza móvil, accesibilidad y velocidad.

### Estado

- [x] 3D usado con intención visual.
- [x] Sin efectos decorativos pesados.
- [x] Sin dependencia de GPU/WebGL.
- [x] Sin romper móvil.

## Resultado de auditoría

El portfolio queda preparado como entrega profesional inicial:

- estable en GitHub Pages;
- documentado con releases y checkpoints;
- optimizado para compartir;
- con catálogo JSON mantenible;
- con PWA ligera;
- con base accesible;
- con diseño responsive;
- con criterios técnicos defendibles.

## Próximo ciclo recomendado

Después de esta auditoría, el siguiente crecimiento debería centrarse en añadir nuevos proyectos reales al catálogo JSON, no en añadir más efectos visuales.

Versión sugerida posterior:

`v2.4.0 - Nuevos proyectos y curaduría del catálogo`
