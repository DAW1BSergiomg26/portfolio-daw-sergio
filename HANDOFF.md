# HANDOFF.md

> **Proyecto:** Portfolio DAW Sergio Martínez
> **Repositorio:** portfolio-daw-sergio
> **Documento:** Handoff Maestro
> **Versión del documento:** 1.0
> **Estado del proyecto:** v3.11.1

---

# 1. Propósito de este documento
Este documento constituye la fuente oficial de contexto del proyecto. Su objetivo es permitir la continuidad del desarrollo manteniendo la arquitectura y visión.

# 9. Estado actual
v3.11.1 - Dos features disruptivas: (1) Sandbox interactivo "Demo en vivo" en cada proyecto, con pestañas Detalles/Demo, iframe srcdoc con demos reales (gestor-tareas, web-servicios). (2) Mapa interactivo "Ruta DAW": SVG navegable tipo RPG con 5 islas, conexiones, panel de detalle al clicar, pulso en isla actual. v3.9.0: CV profesional. v3.8.0: Sobre mí mejorado + LinkedIn footer. v3.7.3: fix CLS breadcrumb.

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
