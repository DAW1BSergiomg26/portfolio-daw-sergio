# HANDOFF.md

> **Proyecto:** Portfolio DAW Sergio Martínez
> **Repositorio:** portfolio-daw-sergio
> **Documento:** Handoff Maestro
> **Versión del documento:** 1.0
> **Estado del proyecto:** v3.7.3

---

# 1. Propósito de este documento
Este documento constituye la fuente oficial de contexto del proyecto. Su objetivo es permitir la continuidad del desarrollo manteniendo la arquitectura y visión.

# 9. Estado actual
v3.7.3 - CLS en breadcrumb de proyecto resuelto (max-width + text-overflow: ellipsis). Versiones v3.6.3 a v3.7.2: 4 proyectos nuevos (20 total), skeleton loading en proyecto/blog, font-display:optional, breadcrumb min-width reservado, heading order corregido, admin mejorado, timeline profesional, PWA, blog, admin panel, form contacto, theme toggle, 404 custom, search modal, footer completo, iconos SVG. Lighthouse: Index 94, Entrada 92, Admin 92, 404 91 (Perf); 100 Accesibilidad, 100 Prácticas, 100 SEO público. Proyecto detail page CLS residual ~0.30 (en investigación).

# 15. Catálogo de proyectos - Nota sobre i18n
El catálogo `data/projects.json` incluye campos `_en` para cada uno de los 20 proyectos:
- `title_en`
- `description_en`
- `kicker_en`
- `learning_en`
- `portfolioRole_en`

Los motores de `js/app.js` y `js/proyecto.js` usan automáticamente estos campos cuando el idioma activo es inglés. Si no existen, se muestra el contenido en español como respaldo.

# 20. Visión a largo plazo
Mantener la calidad, mantenibilidad y documentación profesional como ejes principales.
