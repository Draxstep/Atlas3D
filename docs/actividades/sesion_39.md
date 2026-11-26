# Sesión 39 (Sesión 13 de 18) — Realidad aumentada con WebXR (2/2)

## Actividad 1 · El plan B, desactivado pieza por pieza

| Combinación | Mensaje de ayuda | ¿Anclado? | Posición inicial |
| :--- | :--- | :--- | :--- |
| Con `hit-test` + `anchors` | `Toca la pantalla para colocar el cubo.` → `Cubo colocado...` | Sí (`anclado: sí`) | Sobre la superficie (`y = -1.4` en suelo a `-1.6 m`) |
| Sin `anchors` | Igual (con hit-test normal) | No (`anclado: no`) | Sobre la superficie, fijo en espacio `local` |
| Sin `hit-test` | `Este dispositivo no ofrece hit-test: el cubo está a 1,5 m delante...` | No (`anclado: no`) | `(0, -0.3, -1.5)` delante de la cámara |
| Sin ambas | Igual que sin `hit-test` | No (`anclado: no`) | `(0, -0.3, -1.5)` delante de la cámara |

- **Para pensar:** sin `anchors`, el usuario no nota ninguna diferencia inmediata en pruebas cortas; solo se percibe tras caminar varios segundos si el sistema de seguimiento reubica el mapa mundial y el objeto deriva respecto a la mesa. Es positivo porque no bloquea al usuario, siempre que la línea de estado informe honestamente `anclado: no`.

## Actividad 2 y 3 · Análisis teórico de retícula y «Quitar cubo»

- **Normal de superficie en `pose.transform.matrix`:** la columna 2 (índices `4`, `5`, `6`) representa el eje `+Y` local de la pose; verificar `Math.abs(m[5]) > 0.8` distingue superficies horizontales (pisos/mesas) de paredes verticales.
- **`beforexrselect` en botón «Quitar cubo»:** si se olvida cancelar `beforexrselect`, tocar el botón dispararía también un `select` sobre la escena, recolocando inmediatamente el objeto en lugar de dejar la escena vacía. Además, incrementar el contador de `turno` invalida cualquier `createAnchor()` aún en vuelo para evitar que un ancla tardía reaparezca tras quitar el modelo.
