# Sesión 45 — Comparación y cierre del Sub-bloque B

> Modo `SOLO_BASE_Y_DOCS`: este documento registra el cierre comparativo del Sub-bloque B (Vanilla TS vs. React 19 vs. Angular 22), la verificación de paridad funcional y el Architecture Decision Record (ADR). El código fuente converge exactamente con `referencia/pwa-ar-objetos3d-sesion44` tras añadir `"noEmit": true` en `tsconfig.sw.json` y limpiar los `.js` emitidos en `src/` durante la Sesión 44.

## 1. Corrección de cierre de la migración a Angular (`tsconfig.sw.json`)

En la Sesión 44, `scripts/build.mjs` ejecuta `npx tsc -p tsconfig.sw.json` para validar los tipos de `src/sw.ts` con la librería `WebWorker` (ya que `tsconfig.app.json` no compila el Service Worker). Al faltarle `"noEmit": true` a `tsconfig.sw.json`, TypeScript emitía archivos JavaScript compilados junto al código fuente (`src/base.js`, `src/db.js`, `src/descargas.js`, `src/modelos/tipos.js`, `src/sw.js`).
En esta sesión se añade `"noEmit": true` en `tsconfig.sw.json` y se eliminan dichos `.js` residuales de `src/`, manteniendo una auditoría de paridad exacta contra `referencia/pwa-ar-objetos3d-sesion44`.

## 2. Comparativa cuantitativa de empaquetado (observada en compilación de producción)

| Métrica de build observada | Vanilla TS + Vite (S42) | React 19 + Vite (S43) | Angular 22 + esbuild (S44/S45) |
| :--- | :--- | :--- | :--- |
| HTML inicial | `4.29 kB` | `0.93 kB` | Incluido en salida `dist/index.html` |
| CSS | `6.44 kB` (`1.82 kB` gzip) | `6.51 kB` (`1.83 kB` gzip) | `6.44 kB` (`1.53 kB` est. transfer) |
| JS inicial propio / framework | `62.57 kB` (`index`) + `5.71 kB` (`workbox-window`) | `68.76 kB` (`index`) + `221.71 kB` (`react`) + `5.71 kB` (`workbox-window`) | `222.36 kB` (`main`) + `3.56 kB` (`chunk`) = `232.36 kB` inicial total (`65.73 kB` est. transfer) |
| Chunk diferido de 3D (`three`/`visor`) | `482.73 kB` (`three`, `122.01 kB` gzip) | `482.73 kB` (`three`, `122.01 kB` gzip) | `528.26 kB` (`visor`, `110.71 kB` est. transfer) |
| Precaché Workbox (`dist/sw.js`) | `9 entries` (`558.82 KiB`) | `10 entries` (`778.17 KiB`) | `9 entries` (`754.18 KiB`) |

## 3. Lista de verificación de paridad entre las tres arquitecturas

El núcleo compartido (`src/visor.ts`, `src/xr.ts`, `src/sw.ts`, `src/db.ts`, `src/crypto.ts`, `src/sensores.ts`, `src/camara.ts`, `src/gestos.ts`, `src/rastro.ts`, `src/modelos/`, `public/manifest.json` y `public/modelos/*.json`) y los selectores DOM (`#visor`, `#btn-ar`, `#xr-overlay`, `#btn-descargar`, `#btn-instalar`, `.modelo-tabs .tab`, `.modelo-card`) permanecen invariantes en las tres versiones:

1. Carga inicial sin errores JS ni errores de consola.
2. Documento HTML válido con `lang="es"`, `<meta name="description">`, un único `<main>` y un único `<h1>`.
3. `manifest.json` accesible y criterios de instalabilidad válidos (`beforeinstallprompt` + `appinstalled`).
4. Service Worker propio (`sw.js`) registrado y activo, manteniendo control tras recarga.
5. Descarga voluntaria de las 3 fichas JSON (`mvc`, `capas`, `microservicios`) y operación completa offline al perder red.
6. Persistencia en IndexedDB (`progreso`, `descargas`) y cifrado de nota de estudio con Web Crypto (PBKDF2 + AES-GCM) sin perder entradas al cambiar estado en otra tarjeta.
7. Espacio reservado del visor (`aspect-ratio: 16 / 10`) para mantener CLS controlado y renderizado bajo demanda (0 draw calls en reposo).
8. Carga diferida de Three.js fuera del bundle crítico inicial.
9. Selección de modelos (`MVC`, `Capas`, `Microservicios`), inspección de piezas por raycasting / chips y botones `◀ ▶`.
10. Activación de sensores de orientación y cámara de fondo con apagado limpio en `visibilitychange`.
11. Diagnóstico WebXR, arranque de sesión `immersive-ar`, retícula `hit-test`, anclas espaciales (`createAnchor`), gestos táctiles sobre DOM overlay y registro de rastro AR.
12. Compilación parametrizada para subruta (`BASE_URL` en Vite o `--base-href` + `src/base.ts` en Angular).

**Análisis de fallo inducido ("romper una comprobación"):** Si se rompe la reserva de altura del visor (eliminando `aspect-ratio: 16 / 10`) o se omite el `noEmit` / precaché consistente del SW, la auditoría evidencia inmediatamente deterioro en CLS (al montarse el `<canvas>`) o fallo de arranque offline al quedar referencias sin cachear.

## 4. Architecture Decision Record (ADR): Elección de arquitectura para Atlas 3D

- **Contexto:** Atlas 3D combina una capa de plataforma exigente (Three.js, WebGL, WebXR, sensores, cámara, IndexedDB, Web Crypto y Service Worker propio con Background Sync) con una interfaz de estudio e inspección de catálogos.
- **Opciones evaluadas:**
  - **Vanilla TS + Vite (S42):** menor tamaño inicial de JS y control directo del ciclo de vida; exige gestionar manualmente actualizaciones del DOM (`649` líneas previas en `main.ts`) conforme crece la UI.
  - **React 19 + Vite (S43):** excelente modularidad mediante hooks (`useProgreso`, `useAR`, `useSyncExternalStore`) y componentes funcionales; requiere disciplina estricta en efectos y funciones de limpieza para coexistir con `StrictMode` y objetos imperativos como `WebGLRenderer`.
  - **Angular 22 (S44/S45):** inyección de dependencias (`inject`), señales (`signal`, `computed`) y servicios singleton resuelven de forma natural el registro temprano de eventos PWA (`InstalacionService` en `App`), `afterNextRender` para el `<canvas>` y separación en carga diferida (`import("../../visor")`); exige alinear herramientas propias para compilar un Service Worker distinto de `ngsw`.
- **Decisión:** El patrón ganador no depende de un único framework, sino de **aislar el motor WebGL/WebXR/PWA fuera del framework de UI** (`src/visor.ts`, `src/xr.ts`, `src/sw.ts`, `src/db.ts`), dejando el framework (React o Angular) únicamente como capa declarativa e intercambiable según las necesidades del equipo.
