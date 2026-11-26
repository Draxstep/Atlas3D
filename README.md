# Atlas 3D de Arquitectura de Software

Progressive Web App (PWA) interactiva en **3D y Realidad Aumentada (WebXR)** para explorar modelos didácticos de arquitectura de software, con funcionamiento sin conexión, persistencia local cifrada y despliegue en producción sobre Heroku.

- **Aplicación desplegada en Heroku:** [https://atlas3d-0aef6e960081.herokuapp.com/](https://atlas3d-0aef6e960081.herokuapp.com/)

---

## Características principales

- **Catálogo 3D procedural (Three.js):** modelos interactivos de **Patrón MVC** (`mvc.json`), **Arquitectura en capas** (`capas.json`) y **Microservicios** (`microservicios.json`) generados desde definiciones de piezas y enlaces (`src/modelos/`), con selección por toque (*raycasting*), chips y botones `◀ ▶`.
- **Realidad Aumentada con WebXR (`immersive-ar`):** diagnóstico de capacidades (`src/xr.ts`), detección de superficies con *hit-test* y retícula, anclas espaciales, gestos táctiles sobre *DOM overlay* (`src/gestos.ts`), además de modo con cámara de fondo (`src/camara.ts`) y sensores de orientación (`src/sensores.ts`).
- **PWA y soporte offline (`src/sw.ts`):** Service Worker propio empaquetado con `esbuild` y `workbox-build` (`injectManifest`), registro vía `workbox-window`, descarga voluntaria de fichas JSON con *Background Sync*, instalación guiada (`src/instalar.ts`) e indicador de estado de conexión (`src/conexion.ts`).
- **Progreso y notas cifradas:** almacenamiento en IndexedDB (`src/db.ts`) para modelos vistos, favoritos y notas de estudio cifradas con Web Crypto PBKDF2 + AES-GCM (`src/crypto.ts`).
- **Arquitectura Angular 22:** UI modular basada en componentes standalone y servicios con señales (`src/app/`), con carga perezosa del visor Three.js (`import("../../visor")`) y espacio reservado para evitar saltos de diseño.

---

## Requisitos e instalación local

- **Node.js:** `^22.22.3`, `^24.15.0` o superior (`package.json` especifica `"engines": { "node": "24.x" }`).

```bash
npm install
```

### Comandos disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Levanta el servidor de desarrollo de Angular (`ng serve`) en `http://localhost:4200` (sin Service Worker). |
| `npm run build` | Ejecuta `scripts/build.mjs`: compila la app (`ng build`), valida tipos de `src/sw.ts` (`tsconfig.sw.json`) y empaqueta `dist/sw.js` (`scripts/build-sw.mjs`). |
| `npm start` | Inicia `server.mjs` en producción sirviendo `dist/` en `process.env.PORT` (por defecto `3000`). |
| `npm run preview` | Previsualiza `dist/` localmente con `npx serve dist -l 4173`. |

---

## Despliegue en Heroku

El proyecto incluye [`Procfile`](Procfile) (`web: npm start`) y [`server.mjs`](server.mjs), un servidor HTTP nativo en Node.js diseñado para entorno Heroku:

- Escucha en `0.0.0.0` usando el puerto dinámico `process.env.PORT`.
- Redirige HTTP a HTTPS (`301`) cuando `NODE_ENV=production` y `x-forwarded-proto !== "https"`.
- Sirve `/sw.js` sin caché (`Cache-Control: no-cache, no-store, must-revalidate` y `Service-Worker-Allowed: /`) y `index.html` / `manifest.json` con `no-cache`.
- Aplica caché inmutable (`max-age=31536000, immutable`) a los bundles con hash y fallback SPA solo para navegación HTML sin extensión.

URL en producción: [https://atlas3d-0aef6e960081.herokuapp.com/](https://atlas3d-0aef6e960081.herokuapp.com/)

```bash
git push heroku main
```

---

## Estructura del proyecto

- `src/app/` — Componentes y servicios standalone de Angular 22.
- `src/visor.ts`, `src/xr.ts`, `src/modelos/` — Visor 3D, sesión WebXR y generador procedural de modelos.
- `src/sw.ts`, `src/db.ts`, `src/crypto.ts`, `src/descargas.ts`, `src/avisos.ts` — Service Worker, IndexedDB, cifrado, descargas y avisos.
- `public/` — `manifest.json`, íconos PWA y fichas JSON (`public/modelos/`).
- `scripts/` — Pipeline de compilación de Angular y del Service Worker (`build.mjs`, `build-sw.mjs`).
- `server.mjs`, `Procfile` — Servidor estático de producción y proceso web para Heroku.
- `docs/actividades/` — Notas y entregables teóricos de las sesiones 27 a 45.

---

## Limitaciones conocidas

- Safari en iPhone/iPad no soporta WebXR `immersive-ar`.
- Los gestos sobre el *DOM overlay* requieren un navegador móvil compatible con WebXR y ARCore (en emuladores de escritorio no se activa `:xr-overlay`).
