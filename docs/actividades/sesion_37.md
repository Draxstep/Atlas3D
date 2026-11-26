# Sesión 37 (Sesión 11 de 18) — Avisos y descargas en segundo plano

## Actividad 1 · Para pensar (`globIgnores: ["modelos/**"]` en `vite.config.ts`)

- Con `globIgnores: ["modelos/**"]`, Workbox precachea **8 entradas** (~514 KiB): HTML, JS, CSS, manifest e íconos, excluyendo las fichas JSON.
- Si se quita `globIgnores: ["modelos/**"]`, el precaché sube a **11 entradas**: las tres fichas se descargan automáticamente al instalar el Service Worker. Aunque la app parezca «funcionar», la descarga voluntaria bajo demanda y el botón «Descargar fichas» pierden todo sentido porque el usuario ya pagó el costo de red desde la primera visita.

## Actividad 3 · ¿Cuándo NO notificar?

Regla del proyecto: *una notificación del sistema solo se justifica cuando el usuario no está mirando la app y necesita enterarse*.
- **Aviso útil que aportaría valor:** avisar si una actualización crítica del catálogo (por ejemplo, una nueva ficha o corrección de arquitectura) terminó de descargarse en segundo plano mientras el usuario estaba fuera de la pestaña.
- **Aviso que sería ruido:** emitir una notificación del sistema cada vez que el usuario cambia de pestaña de modelo o marca un favorito mientras la ventana ya está visible y enfocada.
