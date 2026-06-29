# HANDOFF.md

> **Proyecto:** Portfolio DAW Sergio Martínez
> **Repositorio:** portfolio-daw-sergio
> **Documento:** Handoff Maestro
> **Versión del documento:** 1.0
> **Estado del proyecto:** v3.1.2

---

# 1. Propósito de este documento
Este documento constituye la fuente oficial de contexto del proyecto. Su objetivo es permitir la continuidad del desarrollo manteniendo la arquitectura y visión.

# 9. Estado actual
v3.1.2 - Internacionalización completa (ES/EN) de toda la interfaz y los 16 proyectos del catálogo. Optimizaciones Lighthouse aplicadas: carga prioritaria de fuentes, reserva de espacio para contenido dinámico (CLS), atributos hreflang y etiquetas ARIA refinadas.

# 15. Catálogo de proyectos - Nota sobre i18n
El catálogo `data/projects.json` incluye campos `_en` para cada uno de los 16 proyectos:
- `title_en`
- `description_en`
- `kicker_en`
- `learning_en`
- `portfolioRole_en`

Los motores de `js/app.js` y `js/proyecto.js` usan automáticamente estos campos cuando el idioma activo es inglés. Si no existen, se muestra el contenido en español como respaldo.

# 20. Visión a largo plazo
Mantener la calidad, mantenibilidad y documentación profesional como ejes principales.
