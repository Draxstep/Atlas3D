# Sesión 29 (Sesión 3 de 18) — Service Worker del proyecto (2/2)

## Actividad 2 y 3 · Detective de red y diagnóstico del modo offline real

- **Rutas servidas desde `(ServiceWorker)`:** `/`, `/index.html` y `/manifest.json`, precacheadas durante el evento `install` en `CORE_ASSETS`.
- **Rutas servidas desde la red o caché HTTP:** `/src/main.ts`, `/@vite/client` (en desarrollo) o `/assets/index-<hash>.js` (en producción).
- **¿Por qué falla la pantalla al recargar en modo Offline?**
  1. En `npm run dev`, Vite transforma `/src/main.ts` e inyecta `/@vite/client` al vuelo; no son archivos estáticos listables en `CORE_ASSETS`. Sin red, `main.ts` falla y `#app` queda vacío.
  2. En `npm run build`, Vite genera bundles con hash en el nombre (`assets/index-<hash>.js`) que cambian en cada compilación. Escribirlos a mano en `CORE_ASSETS` es frágil y se resuelve generando el precaché automáticamente con Workbox (Sesión 34).
