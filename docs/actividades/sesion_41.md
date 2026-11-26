# Sesión 41 (Sesión 15 de 19) — UX/UI de instalación

## Actividad 1 · Para pensar (botón «Ahora no»)

- Un recordatorio persistente de instalación que no respeta el rechazo del usuario genera fatiga visual e intrusión constante, degradando la usabilidad de la aplicación mucho más que omitir un botón personalizado y delegar la instalación al menú nativo del navegador.

## Actividad 2 · Para pensar (`comprobarRed()` contra un recurso no precacheado)

- Si `comprobarRed()` consultara un recurso incluido en el precaché de Workbox (como `index.html` o `/iconos/icon-192.png`), el Service Worker respondería inmediatamente desde Cache Storage con HTTP `200`, reportando falsamente `"llega"` incluso cuando el servidor estuviera caído o el Wi-Fi sin salida a Internet. Por eso debe usarse `cache: "no-store"` sobre un recurso excluido del precaché (o un endpoint de salud) con `AbortController`.

## Actividad 3 y 4 · Rótulos y pruebas que fallan antes de pasar

- **Rótulos en Microservicios:** en el modelo de datos se ajustaron `Cliente` (`rotulo: "frente"`, `pos[2] = 7.6`) y `Bus de mensajes` (`rotulo: "arriba"`), eliminando la colisión visual con la flecha `publica` en la vista por defecto.
- **Uso único de `beforeinstallprompt`:** soltar `evento = null` *antes* de esperar `guardado.userChoice` garantiza que el evento diferido nunca se reutilice dos veces tras un clic.
