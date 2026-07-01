# HANDOFF.md

> **Proyecto:** Portfolio DAW Sergio Martínez
> **Repositorio:** portfolio-daw-sergio
> **Documento:** Handoff Maestro
> **Versión del documento:** 1.0
> **Estado del proyecto:** v3.8.0

---

# 1. Propósito de este documento
Este documento constituye la fuente oficial de contexto del proyecto. Su objetivo es permitir la continuidad del desarrollo manteniendo la arquitectura y visión.

# 9. Estado actual
v3.8.0 - Sección Sobre mí mejorada: avatar SD, soft skills (6), valores profesionales (3), descarga CV, conexión LinkedIn. LinkedIn y email añadidos al footer social en todas las páginas. Footer duplicado eliminado de index.html. Versiones v3.6.3 a v3.7.2: 4 proyectos nuevos (20 total), skeleton loading, font-display:optional, breadcrumb min-width, heading order, admin mejorado, timeline, PWA, blog, admin panel, form contacto, theme toggle, 404, search modal, footer, iconos SVG. v3.7.3: fix CLS breadcrumb.

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
