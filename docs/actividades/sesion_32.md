# Sesión 32 (Sesión 6 de 18) — Caché de modelos 3D (3/3)

## Actividad 1 · Enrutamiento de estrategias y límite del offline manual

- **Enrutamiento aplicado en `public/sw.js`:**
  - `/iconos/*` → `cacheFirst()` (activos binarios inmutables).
  - `/api/*` → `networkFirst()` (preparado para datos dinámicos del catálogo).
  - Resto del shell (`/`, `/index.html`, `/manifest.json`) → `staleWhileRevalidate()`.
- **Por qué esto no equivale todavía a "funciona sin conexión":** elegir la estrategia adecuada define *cómo* se responde cada petición, pero no resuelve *qué* rutas conoce de antemano el `sw.js`. Vite genera nombres de bundle con hash (`assets/index-<hash>.js`) en cada compilación y rutas virtuales en desarrollo (`/src/main.ts`, `/@vite/client`). El precaché automático generado post-build llega con Workbox en la **Sesión 34**.
