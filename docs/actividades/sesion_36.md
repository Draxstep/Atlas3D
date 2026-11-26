# Sesión 36 (Sesión 10 de 18) — APIs de dispositivo en el proyecto (2/2)

## Actividad 1 · Flujo de video abierto vs. captura única

- **Diferencia frente a la foto única (Sesión 24):** un flujo `getUserMedia` abierto de forma continua consume batería, mantiene activo el indicador LED de cámara y obliga a gestionar eventos del ciclo de vida del documento (`visibilitychange`) para detener las pistas (`track.stop()`) al cambiar de pestaña y no reactivarlas sin un clic explícito del usuario.
- **Transparencia WebGL:** requiere `alpha: true` en la creación del `WebGLRenderer` (inmutable tras inicializar el contexto) y alternar `scene.background = null` mientras el `<video>` con `object-fit: cover` está visible detrás del `<canvas>`.
- **Por qué todavía no es RA:** el modelo no está anclado al entorno físico (carece de seguimiento espacial en 6DOF).
