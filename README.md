# Portfolio DAW - Sergio Daniel

Portfolio personal de **Sergio Daniel Martínez Gómez** como alumno de **Desarrollo de Aplicaciones Web**.

## URL pública

- Web publicada: https://daw1bsergiomg26.github.io/portfolio-daw-sergio/
- Repositorio: https://github.com/DAW1BSergiomg26/portfolio-daw-sergio

## Objetivo

Este proyecto reúne mis prácticas, proyectos publicados y avances durante mi formación en DAW. La idea es tener una web central donde pueda enseñar lo que voy construyendo y documentar mi progreso de forma ordenada.

## Proyectos destacados publicados

### Archivo Moonwalk

Web cultural, legal y documentada sobre Michael Jackson, publicada con GitHub Pages y preparada como entrega estable.

- Web: https://daw1bsergiomg26.github.io/m_j_pop_rey/
- Portfolio del proyecto: https://daw1bsergiomg26.github.io/m_j_pop_rey/portfolio.html
- Memoria técnica: https://daw1bsergiomg26.github.io/m_j_pop_rey/MEMORIA_TECNICA_DAW.md?v=1
- Release: https://github.com/DAW1BSergiomg26/m_j_pop_rey/releases/tag/v1.0.0

### Gestor de Tareas DAW

Mini aplicación funcional creada con HTML, CSS y JavaScript para practicar DOM, eventos, filtros y almacenamiento local con `localStorage`.

- Web: https://daw1bsergiomg26.github.io/gestor-tareas-daw/
- Repositorio: https://github.com/DAW1BSergiomg26/gestor-tareas-daw
- Release: https://github.com/DAW1BSergiomg26/gestor-tareas-daw/releases/tag/v1.0.0

### Web Servicios Informáticos

Landing profesional creada con HTML, CSS y JavaScript para presentar servicios informáticos básicos: instalación de Windows, limpieza, optimización, copias de seguridad, soporte remoto y mantenimiento preventivo.

- Web: https://daw1bsergiomg26.github.io/web-servicios-informaticos/
- Repositorio: https://github.com/DAW1BSergiomg26/web-servicios-informaticos
- Release: https://github.com/DAW1BSergiomg26/web-servicios-informaticos/releases/tag/v1.0.0

## Catálogo ampliado de repositorios

Además de los proyectos publicados, el portfolio recoge otros repositorios de práctica, grupo, aprendizaje o evolución personal:

- Web-Mio-Divina: https://github.com/DAW1BSergiomg26/Web-Mio-Divina
- Menú responsive ciberpunk multicolores: https://github.com/DAW1BSergiomg26/web-responsive-menu-ciberpunk-multicolores
- Envios Paraguay CMS: https://github.com/DAW1BSergiomg26/Envios_Paraguay_CMS
- NARANCO GRUPO B 2: https://github.com/DAW1BSergiomg26/NARANCO_GRUPO_B_2
- Proyecto Intermodular Auri - Sergio, Juan, Juanca, Luis, Óscar y Héctor: https://github.com/DAW1BSergiomg26/Proyecto-Intermodular-Auri_Grupo_Sergio_Juan_Juanca_Luis_Oscar_Hector
- Proyecto Intermodular Auri - Sergio, Mateo y Juanca: https://github.com/DAW1BSergiomg26/Proyecto-Intermodular-Auri_Grupo_Sergio_Mateo_Juanca
- Mi Juego DinoGamer: https://github.com/DAW1BSergiomg26/mi-juego-dinogamer
- Divina Misericordia App: https://github.com/DAW1BSergiomg26/divina-misericordia-app
- 100 Ejercicios Prácticos de Todo un Poco: https://github.com/DAW1BSergiomg26/100-EJERCICIOS-PRACTICOS-DE-TODO-UN-POCO
- Aprende a Programar con Python y Java: https://github.com/DAW1BSergiomg26/APRENDE-APROGRAMAR-CON-PYTHON-JAVA
- Python de 0 a 100: https://github.com/DAW1BSergiomg26/python-de-0-a-100
- Mi App: https://github.com/DAW1BSergiomg26/mi-app
- Ejercicios de BBDD - 10/03/2026: https://github.com/DAW1BSergiomg26/Ejercicios-de-BBDD-10-03-2026

## Catálogo dinámico en JSON

Los proyectos del portfolio se centralizan en `data/projects.json` y se renderizan desde `js/app.js`.

Ventajas de esta estructura:

- El HTML queda más limpio.
- El catálogo es más fácil de mantener.
- Los nuevos proyectos se pueden añadir editando datos, no duplicando bloques completos de HTML.
- Filtros, buscador, estadísticas y tarjetas premium siguen funcionando sobre las tarjetas generadas dinámicamente.
- Existe respaldo defensivo: si el JSON no carga, el script puede usar las tarjetas estáticas existentes.

## Filtros, buscador, estadísticas y tarjetas premium

La sección de proyectos incluye filtros interactivos, buscador por texto libre, dashboard de estadísticas y tarjetas premium generadas con JavaScript.

Filtros disponibles:

- Todos
- Publicados
- Académicos
- Prácticas
- Destacados
- Web
- JavaScript
- Python
- BBDD
- Grupo
- Religioso
- Apps

El buscador permite encontrar proyectos por texto libre y por metadatos internos. Por ejemplo: `Python`, `Auri`, `BBDD`, `Divina`, `CMS`, `JavaScript`, `Naranco` o `DinoGamer`.

El dashboard de estadísticas muestra:

- Total de proyectos catalogados.
- Proyectos publicados.
- Trabajos académicos o de grupo.
- Prácticas y repositorios en evolución.
- Áreas tecnológicas detectadas.
- Proyectos visibles según filtro o búsqueda activa.

Las tarjetas premium añaden:

- Numeración visual de cada proyecto.
- Etiquetas automáticas por categoría.
- Diferenciación entre proyectos publicados, trabajos académicos y prácticas.
- Estados más claros para presentar el catálogo a profesores, compañeros o empresas.
- Mejor hover visual sin romper filtros ni buscador.

## Panel profesional de proyectos destacados

El portfolio incluye un panel superior de proyectos destacados generado desde el campo `featured: true` del catálogo JSON.

Este panel usa profundidad visual con CSS 3D ligero, sin WebGL obligatorio y sin librerías externas. La decisión técnica es mantener una experiencia visual premium, pero rápida, accesible y preparada para móvil.

## PWA ligera y SEO avanzado

El proyecto incluye una configuración ligera para presentación profesional:

- SEO avanzado.
- Open Graph.
- Twitter Card `summary_large_image`.
- Imagen social `og-image.svg`.
- JSON-LD con `ProfilePage`, `Person` e `ItemList`.
- Manifest PWA básico.
- Robots y sitemap publicados.
- Skip link accesible.
- Foco visible para navegación por teclado.

## Auditoría de calidad

La versión v2.3.0 incorpora el archivo `QUALITY_CHECK.md`, que documenta una auditoría técnica del portfolio.

La auditoría revisa:

- Rendimiento.
- Accesibilidad.
- SEO y presentación externa.
- PWA ligera.
- Catálogo JSON.
- Responsive.
- Enlaces principales.
- Criterio 3D aplicado.

Este archivo sirve como checklist profesional antes de publicar nuevas versiones estables.

## Próximos proyectos

La sección **Próximos proyectos** prepara futuras entregas DAW:

- Mini tienda web.
- Laboratorio JavaScript.
- Memoria de proyectos DAW.
- Mejora visual del portfolio.

## Tecnologías usadas

- HTML5
- CSS3
- JavaScript
- JSON
- Git
- GitHub
- GitHub Pages
- Responsive Design
- SEO básico
- PWA ligera

## Estructura

```text
portfolio-daw-sergio/
├─ index.html
├─ favicon.svg
├─ og-image.svg
├─ robots.txt
├─ sitemap.xml
├─ site.webmanifest
├─ QUALITY_CHECK.md
├─ css/
│  ├─ styles.css
│  └─ filters.css
├─ data/
│  └─ projects.json
├─ js/
│  └─ app.js
└─ README.md
```

## Flujo Git

- `main` se mantiene como rama estable.
- Las mejoras se trabajan en ramas `feature/*`.
- Se prueba antes de hacer merge.
- Los checkpoints importantes se guardan con tags.
- Cada versión estable se publica como release.

## Estado

Portfolio DAW publicado en GitHub Pages con base premium, SEO avanzado, Open Graph, PWA ligera, catálogo dinámico en JSON, filtros avanzados, buscador combinado, tarjetas premium, dashboard de estadísticas, panel profesional de proyectos destacados y auditoría de calidad documentada.

## Versionado de assets

Para evitar problemas de caché en GitHub Pages, los archivos CSS y JavaScript se cargan con parámetro de versión.

Versión actual estable: `v2.3.0`.

Ejemplo:

- `css/styles.css?v=2.2.0`
- `css/filters.css?v=2.2.0`
- `js/app.js?v=2.2.0`

Así, cuando se publica una nueva versión, el navegador carga los archivos actualizados y no conserva estilos o scripts antiguos.
