# Sesión 35 (Sesión 9 de 18) — APIs de dispositivo en el proyecto (1/2)

## Actividad 1 · Visor 3D y sensores de orientación

- **Mejora progresiva invertida:** El control manual con `OrbitControls` (ratón o dedo) es la base disponible en cualquier equipo; los sensores `deviceorientation` (`beta` → eje X, `gamma` → eje Y) son la mejora progresiva.
- **Rotación relativa y calibración:** La primera lectura establece la referencia neutra; `calibrar()` fija la postura actual como cero y emite `(0, 0)` de inmediato para evitar depender de un nuevo evento físico.
- **Suavizado (`0.15`):**
  - Un factor bajo (`0.05`) filtra casi todo el temblor de la mano, pero introduce un retraso perceptible al inclinar rápido.
  - Un factor alto (`0.40`) responde de inmediato, pero deja pasar micro-vibraciones del acelerómetro/giroscopio.
  - El valor `0.15` ofrece un equilibrio fluido a 60 fps.
- **Peso en el precaché:** Al importar `three` por primera vez, el precaché pasa de ~25 KiB a ~507 KiB.
