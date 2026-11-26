# Sesión 43 — Actividades teóricas y análisis de migración a React 19

> Modo `SOLO_BASE_Y_DOCS`: el código fuente converge exactamente con `referencia/pwa-ar-objetos3d-sesion43` (React 19 + TypeScript + Vite) sin alterar la interfaz ni los hooks de referencia.

## 1. Comparación estructural Vanilla TS (S42) vs. React 19 (S43)

| Aspecto | Versión Vanilla TS (Sesión 42) | Versión React 19 (Sesión 43) |
| :--- | :--- | :--- |
| Punto de entrada | `src/main.ts` con consultas `querySelector` y oyentes imperativos | `src/main.tsx` monta `<StrictMode><App /></StrictMode>` sobre `#root` |
| Frontera DOM / Three.js | `crearVisor(contenedor)` manipula directamente el DOM | `App.tsx` pasa `contenedor` (`useRef<HTMLDivElement>(null)`) a `ZonaVisor`, que entrega `<div id="visor">` sin hijos declarados aparte de `<video id="fondo-camara">` |
| Estado de UI y datos | Variables locales en `main.ts` y redibujado manual | Estado distribuido en `hooks/` (`useProgreso`, `usePanel`, `useSensores`, `useCamara`, `useAR`, `useConexion`, `useInstalacion`) y componentes declarativos en `componentes/` |
| Registro de Service Worker | `registerSW()` desde `virtual:pwa-register` | Hook `useRegisterSW({ immediate: true, onOfflineReady, onRegisterError })` desde `virtual:pwa-register/react` (expone `offlineReady`) |
| Chunks en build de producción | `index` (~62.57 kB) + `three` (~482.73 kB) + `workbox-window` (~5.71 kB) | `index` (~68.76 kB) + `react` (~221.71 kB, `manualChunks`) + `three` (~482.73 kB) + `workbox-window` (~5.71 kB); precaché de 10 entradas (~778.17 KiB) |

### Impacto esperado en Lighthouse (Performance / FCP / TBT)
- **Separación de chunks (`manualChunks`):** Vite aísla `react` + `react-dom` en un bundle dedicado (`react-*.js`) y `three` en `three-*.js`, preservando el tamaño estable del chunk propio de la app cuando cambian componentes de UI.
- **Carga inicial (JS adicional):** Al incorporar `react` + `react-dom` (~68.70 kB gzip) respecto a Vanilla TS, el tiempo de evaluación de scripts iniciales crece ligeramente frente a la Sesión 42, manteniendo idéntica la reserva de espacio del visor (`aspect-ratio: 16 / 10`) y el renderizado bajo demanda en `visor.ts` para proteger CLS y ahorro de batería.

## 2. ¿Qué ocurre si se omite `nuevo.destruir()` en `StrictMode`?

En `src/main.tsx`, `<App />` se envuelve con `<StrictMode>`. En modo desarrollo, React ejecuta intencionalmente el ciclo *montar → limpiar → volver a montar* del `useEffect` de `src/App.tsx`:

```ts
useEffect(() => {
  const nuevo = crearVisor(contenedor.current!);
  setVisor(nuevo);
  return () => {
    nuevo.destruir(); // sin esta limpieza, StrictMode dejaría dos <canvas> WebGL
    setVisor(null);
  };
}, []);
```

Si se omitiera `nuevo.destruir()`:
1. El primer montaje crea un `<canvas>` con un `WebGLRenderer` y registra oyentes sobre `window` y `#visor`.
2. Al desmontar de prueba en `StrictMode`, el `<canvas>` y el contexto WebGL quedarían huérfanos dentro de `<div id="visor">`.
3. El segundo montaje añadiría un segundo `<canvas>` debajo o encima del anterior, duplicando contextos WebGL, memoria GPU y oyentes de puntero/redimensionamiento.

## 3. Ubicación de un contador de visitas en `useProgreso`

- El estado persistente en IndexedDB (modelos vistos, favoritos, notas cifradas y descargas) ya se centraliza en `src/hooks/useProgreso.ts` apoyado en `src/db.ts`.
- Para añadir un contador global o por modelo (sin contaminar componentes presentacionales como `Catalogo.tsx`), el lugar natural es:
  1. **Persistencia (`src/db.ts`):** extender el almacén en IndexedDB (incrementando `VERSION` si cambia el esquema o guardando una entrada dedicada en el store de metadatos/progreso) con funciones puras de lectura e incremento atómico en transacción `readwrite`.
  2. **Estado reactivo (`src/hooks/useProgreso.ts`):** exponer el contador junto a `progreso` y `descargados` cargándolo dentro de `recargar()` y llamando al incremento desde un `useEffect` protegido (o tras `abrirBaseDeDatos()` con una referencia `useRef` para no contar doble bajo `StrictMode`).

## 4. Momento de registro de `beforeinstallprompt` con `useSyncExternalStore`

En `src/hooks/useInstalacion.ts`, el enlace con `src/instalar.ts` utiliza `useSyncExternalStore(suscribir, foto)`, donde `suscribir` invoca `iniciarInstalacion(avisar)`:

- **Por qué no perder el evento:** `useSyncExternalStore` ejecuta la suscripción inmediatamente al montar el componente (`ZonaInstalar` en el primer render). Sin embargo, en conexiones o recargas muy rápidas, si el navegador disparara `beforeinstallprompt` *antes* de hidratar/montar el árbol de React (mientras se descarga o evalúa el bundle), un `addEventListener("beforeinstallprompt", ...)` registrado solo dentro de un componente podría llegar tarde.
- **Implicación arquitectónica:** Por ello `src/instalar.ts` mantiene el estado (`evento`, `rechazada`, `recienInstalada`) fuera de React como variables de módulo y devuelve una función de limpieza en `iniciarInstalacion()`. Si en un proyecto grande el montaje de React se difiriera, bastaría inicializar la captura de `beforeinstallprompt` en el arranque del módulo (o en `main.tsx`) antes de `createRoot(...)` para retener el evento incluso previo al primer montaje de `ZonaInstalar`.
