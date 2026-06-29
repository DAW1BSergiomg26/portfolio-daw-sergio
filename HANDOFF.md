# HANDOFF.md

> **Proyecto:** Portfolio DAW Sergio Martínez
> **Repositorio:** portfolio-daw-sergio
> **Documento:** Handoff Maestro
> **Versión del documento:** 1.0
> **Estado del proyecto:** v3.1.0

---

# 1. Propósito de este documento
Este documento constituye la fuente oficial de contexto del proyecto. Su objetivo es permitir la continuidad del desarrollo manteniendo la arquitectura y visión.

# 9. Estado actual
v3.1.0 - Internacionalización completa (ES/EN) de toda la interfaz del portfolio. El sistema i18n centraliza las traducciones en `data/lang.json`, soporta contenido dinámico generado por JavaScript, y está preparado para traducciones bilingües en `data/projects.json` (campos `_en`).

# 15. Catálogo de proyectos - Nota sobre i18n
El catálogo `data/projects.json` ahora acepta campos opcionales `_en` para cada proyecto:
- `title_en`
- `description_en`
- `kicker_en`
- `learning_en`
- `portfolioRole_en`

Los motores de `js/app.js` y `js/proyecto.js` usan automáticamente estos campos cuando el idioma activo es inglés. Si no existen, se muestra el contenido en español como respaldo.

# 20. Visión a largo plazo
Mantener la calidad, mantenibilidad y documentación profesional como ejes principales.
