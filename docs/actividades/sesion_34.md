# Sesión 34 (Sesión 8 de 18) — Workbox en el proyecto

## Actividad 1 · Migración de `public/sw.js` manual a `vite-plugin-pwa` (`generateSW`)

- **Por qué resuelve el límite abierto desde la Sesión 29:** `vite-plugin-pwa` ejecuta Workbox *después* de `vite build`, cuando los archivos reales con hash en `dist/` (`assets/index-<hash>.js`, `assets/index-<hash>.css`) ya existen.
- En el `dist/sw.js` generado:
  - Los activos de nombre fijo (`index.html`, `manifest.json`, `iconos/*.png`) reciben un campo `revision` calculado por Workbox.
  - Los activos cuyo nombre ya contiene el hash de Vite (`assets/index-*.js`, `assets/index-*.css`) llevan `revision: null` porque su propia URL cambia en cada build modificado.
- **Límite restante:** IndexedDB persiste datos locales de forma independiente al Service Worker, pero todavía no existe una capa de sincronización con servidor (el Atlas 3D opera 100 % en el dispositivo).
