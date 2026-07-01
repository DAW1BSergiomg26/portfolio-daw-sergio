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

## Curaduría profesional del catálogo

La versión v2.4.0 mejora el catálogo para que cada proyecto sea más defendible y fácil de evaluar.

Cada proyecto del JSON incorpora o refuerza metadatos como:

- `priority`: orden recomendado de presentación.
- `level`: nivel o estado real del proyecto.
- `learning`: aprendizaje principal que demuestra.
- `portfolioRole`: papel del proyecto dentro del portfolio.
- `featured`: selección más intencional de proyectos destacados.
- `technologies`: tecnologías y áreas más precisas.
- `categories`: categorías compatibles con filtros avanzados.

El objetivo de esta curaduría es que el portfolio no sea solo una lista de repositorios, sino un catálogo profesional con intención, jerarquía y lectura clara.




## Modal profesional de detalle por proyecto

La versión v2.7.0 añade una ficha completa en formato modal para cada proyecto del catálogo.

El modal permite consultar la defensa completa sin saturar las tarjetas principales:

- Título del proyecto.
- Qué hice.
- Qué aprendí.
- Por qué importa dentro del portfolio.
- Estado real y metadatos.
- Tecnologías principales.
- Enlaces del proyecto.
- Cierre con botón, tecla Escape o clic fuera del panel.

Esta mejora refuerza la presentación profesional del portfolio sin añadir WebGL pesado ni dependencias externas.
## Pulido UX del detalle profesional

La versión v2.6.0 mejora el bloque desplegable de cada proyecto para convertirlo en una pequeña defensa académica y profesional.

El detalle queda organizado con una lógica más clara:

- Qué hice.
- Qué aprendí.
- Por qué importa dentro del portfolio.
- Estado real del proyecto.
- Tecnologías principales.

El objetivo es que cada tarjeta ayude a explicar el trabajo en una revisión con profesor, empresa o entrevista inicial.
## Sistema de detalle expandido por proyecto

La versión v2.5.0 añade un bloque desplegable en cada tarjeta del catálogo.

Este bloque permite mostrar información profesional sin saturar la vista principal:

- Qué aprendí en cada proyecto.
- Rol del proyecto dentro del portfolio.
- Estado o nivel real del proyecto.
- Tecnologías principales.
- Metadatos internos compatibles con búsqueda.

El objetivo es que cada tarjeta sea más defendible en una revisión académica, técnica o profesional.
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

## PWA instalable con Service Worker

La versión v3.2.0 convierte el portfolio en una Progressive Web App instalable:

- `sw.js` registrado desde `index.html`, `proyecto.html` y `entrada.html`.
- Precacheo del shell estático (HTML, CSS, JS, JSON, manifest, favicon e imagen social).
- Estrategia `network-first` para datos JSON, con fallback a cache offline.
- Estrategia `cache-first` para assets estáticos, con página offline como respaldo.
- `site.webmanifest` actualizado con `id`, `scope`, `start_url`, modo `standalone` e icono maskable SVG.
- Limpieza automática de caches antiguas en cada nueva versión.
- Service Worker autodetecta la ruta base (`/portfolio-daw-sergio/` en producción, `/` en local).

## Blog técnico

La versión v3.3.0 añade una sección de blog para documentar aprendizajes y buenas prácticas:

- Listado de entradas en `index.html#blog` renderizado desde `data/blog.json`.
- Página individual `entrada.html?slug=<slug>` para leer cada artículo completo.
- Contenido bilingüe ES/EN dentro del mismo JSON.
- Etiquetas, categoría, fecha y tiempo de lectura.
- Navegación accesible y diseño coherente con el resto del portfolio.

## Panel de administración

La versión v3.4.0 incluye un panel interno accesible desde `admin.html`:

- Autenticación simple con contraseña hasheada (SHA-256).
- Gestión local de proyectos y entradas de blog mediante `localStorage`.
- Crear, editar y eliminar proyectos y posts desde una interfaz unificada.
- Exportar todos los datos a un archivo JSON para respaldo o publicación.
- Importar un archivo JSON para restaurar o actualizar datos.
- Restaurar datos originales desde `data/projects.json` y `data/blog.json`.
- La web pública lee primero `localStorage` si existe, luego los JSON originales.

> Nota: al tratarse de GitHub Pages (estático), los cambios del panel se guardan solo en el navegador local. Para publicarlos hay que exportar el JSON y actualizar los archivos del repositorio.

## Formulario de contacto

La versión v3.5.0 añade un formulario de contacto profesional en la sección `#contacto`:

- Campos de nombre, email, asunto y mensaje con validación nativa y personalizada.
- Envío vía `fetch` a un endpoint configurable (por defecto preparado para Formspree).
- Mensajes de éxito, error y estado de carga traducidos al inglés y al español.
- Modo demostración: si no se configura un endpoint real, el formulario muestra un aviso informativo.
- Estilos coherentes con el diseño glassmorphism del portfolio.

Para activar el envío real, crea una cuenta en [Formspree](https://formspree.io), crea un formulario y sustituye `YOUR_FORM_ID` en la constante `CONTACT_FORM_ENDPOINT` de `js/app.js` y en el atributo `action` del formulario de `index.html`.

## SEO avanzado

El proyecto incluye configuración para presentación profesional:

- SEO avanzado.
- Open Graph.
- Twitter Card `summary_large_image`.
- Imagen social `og-image.svg`.
- JSON-LD con `ProfilePage`, `Person` e `ItemList`.
- Robots y sitemap publicados.
- Skip link accesible.
- Foco visible para navegación por teclado.
- Atributos `hreflang` para español e inglés.

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
├─ proyecto.html
├─ entrada.html
├─ admin.html
├─ favicon.svg
├─ og-image.svg
├─ robots.txt
├─ sitemap.xml
├─ site.webmanifest
├─ sw.js
├─ .gitignore
├─ QUALITY_CHECK.md
├─ css/
│  ├─ styles.css
│  └─ filters.css
├─ data/
│  ├─ projects.json
│  ├─ lang.json
│  └─ blog.json
├─ js/
│  ├─ app.js
│  ├─ proyecto.js
│  ├─ blog.js
│  └─ admin.js
└─ README.md
```

## Flujo Git

- `main` se mantiene como rama estable.
- Las mejoras se trabajan en ramas `feature/*`.
- Se prueba antes de hacer merge.
- Los checkpoints importantes se guardan con tags.
- Cada versión estable se publica como release.

## Estado

Portfolio DAW publicado en GitHub Pages con base premium, SEO avanzado, Open Graph, PWA instalable con Service Worker, blog técnico bilingüe, panel de administración local, formulario de contacto funcional, catálogo dinámico en JSON, filtros avanzados, buscador combinado, tarjetas premium, dashboard de estadísticas, panel profesional de proyectos destacados, auditoría de calidad documentada, curaduría profesional del catálogo, páginas individuales de proyecto, timeline profesional e internacionalización completa ES/EN.

## Internacionalización (i18n)

La versión v3.1.0 convierte el portfolio en una plataforma bilingüe preparada para mercado global.

Características:

- Selector de idioma integrado en la cabecera (ES/EN).
- Traducción completa de toda la interfaz estática.
- Motor de traducción basado en `data/lang.json`.
- Contenido dinámico traducible: contador, filtros, dashboard, modal y detalles de proyectos.
- Arquitectura preparada para proyectos bilingües mediante campos opcionales `_en` en `data/projects.json`.
- Todos los proyectos del catálogo traducidos al inglés (v3.1.1).
- Optimizaciones Lighthouse (v3.1.2): carga prioritaria de fuentes, reserva de espacio contra CLS, atributos hreflang y etiquetas ARIA mejoradas.
- PWA instalable con Service Worker (v3.2.0): precacheo del shell, soporte offline y caches por versión.
- Blog técnico bilingüe (v3.3.0): sección de apuntes, artículos individuales y contenido traducido en `data/blog.json`.
- Panel de administración (v3.4.0): gestión local de proyectos y blog, exportación/importación JSON y autenticación simple.
- Enlace directo al panel en el footer (v3.4.2).
- Formulario de contacto funcional (v3.5.0): validación, envío vía Formspree y traducción ES/EN completa.

## Versionado de assets

Para evitar problemas de caché en GitHub Pages, los archivos CSS, JavaScript y JSON se cargan con parámetro de versión.

Versión actual estable: `v3.5.0`.

Ejemplo:

- `css/styles.css?v=3.6.2`
- `css/filters.css?v=3.6.2`
- `js/app.js?v=3.6.2`
- `js/proyecto.js?v=3.6.2`
- `js/blog.js?v=3.6.2`
- `js/admin.js?v=3.6.2`
- `data/projects.json?v=3.6.2`
- `data/lang.json?v=3.6.2`
- `data/blog.json?v=3.6.2`
- `sw.js` (se actualiza mediante cambio de `CACHE_NAME` interno)

Así, cuando se publica una nueva versión, el navegador carga los archivos actualizados y no conserva estilos, scripts o datos antiguos.
