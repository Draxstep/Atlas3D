# Sesión 42 (Sesión 16 de 19) — Lighthouse y cierre del proyecto

## Actividad 1 y 2 · Metodología de medición (`1 cambio → 1 medición`)

- **Por qué es un error cambiar tres cosas y medir una sola vez:** si dos cambios mejoran métricas distintas y uno empeora otra, una medición agregada oculta la causa real de cada efecto (por ejemplo, reservar el espacio del panel y visor baja CLS de `0.523` a `0.050`, pero desplaza el elemento LCP de `p.aviso-demo` al texto dinámico de `#pieza-detalle`, subiendo LCP de `1.7 s` a `2.3 s`).
- Se realizan múltiples corridas (3 o 5) con la misma configuración y se reporta la **mediana** para filtrar la dispersión natural entre ejecuciones.

## Actividad 3 y 4 · Dibujo bajo demanda y LCP

- **Dibujo bajo demanda (`sucio = true`):** evita 60 llamadas WebGL/s cuando la escena permanece inmóvil; si se omite `sucio = true` en `seleccionar()`, el resaltado de piezas no se dibuja hasta que el usuario mueve la cámara o redimensiona.
- **Métrica LCP:** antes de reservar espacio (`Sesión 41`), el bloque estático `.aviso-demo` salía empujado y contaba distinto que en la `Sesión 42`, donde `#pieza-detalle` pasa a ser el mayor bloque visible en viewport; mantener `.pieza-detalle` con su texto inicial estático acercaría LCP sin reintroducir CLS.
