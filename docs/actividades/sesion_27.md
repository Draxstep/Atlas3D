# Sesión 27 (Sesión 1 de 18) — Arranque del proyecto y su manifiesto

## Mapa de arquitectura objetivo (Capas + MVC)

El código de `src/` evolucionará progresivamente hacia cuatro capas estrictas donde cada capa solo importa de la capa inmediatamente inferior:

```text
src/
├── dominio/       // Modelo: definición de PatronArquitectura y ArbolCatalogo
├── datos/         // Semilla de patrones iniciales
├── vista/         // Escena 3D (Three.js), lista del catálogo y constructores
└── controlador/   // ControladorVisor: coordina Modelo y Vista
```

En correspondencia con MVC:
- **Modelo:** `dominio/` + `datos/`
- **Vista:** `vista/`
- **Controlador:** `controlador/`

## Verificación del `manifest.json` en Sesión 27

- En Vite, los archivos estáticos en `public/` (`public/manifest.json`, `public/iconos/*.png`) se sirven directamente desde la raíz `/` sin procesamiento de bundler.
- En DevTools → Application → Manifest:
  - Nombre, nombre corto, `start_url: "/"`, `display: "standalone"` e íconos (`192x192`, `512x512`, `512x512` `maskable`) validan correctamente.
  - El criterio de instalabilidad de Service Worker permanece pendiente hasta la **Sesión 28**.
