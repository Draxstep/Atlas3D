# Sesión 44 — Actividades teóricas y análisis de migración a Angular 22

> Modo `SOLO_BASE_Y_DOCS`: el código fuente converge a Angular 22 (`@angular/core` `^22.2.0`, `@angular/build` `^22.2.6`, señales y componentes standalone), manteniendo intacto el núcleo compartido (`visor.ts`, `xr.ts`, `sw.ts`, `db.ts`, `crypto.ts`, `modelos/` y `manifest.json`).

## 1. Equivalencias arquitectónicas: React 19 (S43) vs. Angular 22 (S44)

| Concepto | React 19 (Sesión 43) | Angular 22 (Sesión 44) |
| :--- | :--- | :--- |
| Arranque de la app | `createRoot(...).render(<StrictMode><App /></StrictMode>)` | `bootstrapApplication(App, appConfig)` en `src/main.ts` |
| Estado compartido | Hooks (`useProgreso`, `usePanel`, `useAR`, etc.) | Servicios singleton (`@Injectable({ providedIn: "root" })`) con `signal()` y `computed()` |
| Ciclo de vida / DOM | `useEffect(..., [])` + `useRef<HTMLDivElement>` | `afterNextRender()` + `viewChild.required()` en `ZonaVisor` (`section[zonaVisor]`) |
| Limpieza al desmontar | Función de retorno del `useEffect` (`nuevo.destruir()`) | `inject(DestroyRef).onDestroy(() => ...)` en `VisorService`, `InstalacionService` y `App` |
| Chunk separado para Three.js | `manualChunks` en `vite.config.ts` | `const { crearVisor } = await import("../../visor")` en `VisorService.montar()` (chunk perezoso `visor`) |
| Captura temprana de instalación | `useSyncExternalStore` en `useInstalacion.ts` | `inject(InstalacionService)` en el constructor de `App` antes del primer dibujo |

## 2. Por qué se conserva el Service Worker propio en lugar de `ngsw`

Angular incluye su propio Service Worker (`@angular/service-worker` / `ngsw`), útil para precaché declarativo con `ngsw-config.json`. Sin embargo, el Atlas 3D ya implementaba capacidades en `src/sw.ts` que `ngsw` no ofrece de serie:
1. **Background Sync (`sincronizar-fichas`):** reintento automático de descarga de fichas JSON cuando vuelve la conectividad.
2. **Notificaciones interactivas (`notificationclick`):** apertura o enfoque directo de la ruta con `?modelo=<id>`.
3. **Estrategias diferenciadas de Workbox:** separación entre precaché de la app y descarga voluntaria bajo demanda en `public/modelos/*.json`.

Por esa razón, `scripts/build.mjs` encadena:
1. `npx ng build` (genera `dist/` con `@angular/build:application`).
2. `npx tsc -p tsconfig.sw.json` (verifica tipos de `src/sw.ts` con librería `WebWorker`).
3. `node scripts/build-sw.mjs` (empaqueta `src/sw.ts` como `iife` con `esbuild` e inyecta `self.__WB_MANIFEST` mediante `workbox-build` excluyendo `modelos/**`, `sw.js` y `.sw-empaquetado.js`).

En ejecución, `SwService` (`src/app/servicios/sw.service.ts`) registra `${BASE_URL}sw.js` usando `workbox-window` solo fuera de `isDevMode()`.

## 3. Efecto observado con `tsconfig.sw.json` y `src/visor.ts` diferido

- **Carga diferida de Three.js:** En la compilación con `@angular/build:application`, `VisorService.montar()` importa `../../visor` de forma dinámica después de `afterNextRender()`. El resultado produce un paquete inicial cercano a `232.36 kB` (`65.73 kB` estimado de transferencia) y deja `visor` (`528.26 kB`, incluyendo Three.js) como chunk perezoso (`chunk-*.js`).
- **Emisión de archivos JS en `tsc -p tsconfig.sw.json`:** En la configuración inicial de `tsconfig.sw.json` heredada de Vite (donde `tsconfig.json` principal tenía reglas distintas de emisión), al no incluir `"noEmit": true`, el paso `tsc -p tsconfig.sw.json` emite `src/base.js`, `src/db.js`, `src/descargas.js`, `src/modelos/tipos.js` y `src/sw.js` dentro de `src/`. Este detalle se depura en la Sesión 45.
