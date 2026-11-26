# Sesión 38 (Sesión 12 de 18) — Realidad aumentada con WebXR (1/2)

## Actividad 1 · Mapa de soporte WebXR (`diagnosticarAR()`)

| Dispositivo / Navegador | Mensaje esperado | ¿Botón habilitado? |
| :--- | :--- | :--- |
| Escritorio Chrome/Edge (sin emulador) | `Este dispositivo no admite realidad aumentada en el navegador...` | No (`sin-ar`) |
| Escritorio Chrome/Edge (con emulador AR) | `Este dispositivo puede abrir una sesión de realidad aumentada.` | Sí (`disponible`) |
| Firefox escritorio o Safari iPhone | `Este navegador no ofrece WebXR...` | No (`sin-webxr`) |
| Página servida por HTTP sin localhost | `La realidad aumentada exige HTTPS o localhost.` | No (`contexto-inseguro`) |
| Android Chrome + Google Play Services for AR | `Este dispositivo puede abrir una sesión de realidad aumentada.` | Sí (`disponible`) |

- **Por qué separar `sin-webxr` de `sin-ar`:** en un navegador que sí implementa `navigator.xr` pero responde `false` a `isSessionSupported("immersive-ar")`, el usuario puede activar el emulador o comprobar compatibilidad ARCore; en Safari/Firefox ni siquiera existe la API WebXR.

## Actividad 3 · Razonar en metros (`local` frente a `local-floor`)

- En `(0.5, 0, -1)` a escala `0.1`, el cubo mide **16 cm** de arista y queda **1 m delante** (`-Z`) y **0.5 m a la derecha** (`+X`), a la altura inicial de la cámara.
- **`local` vs `local-floor`:** `local` ubica el origen `(0, 0, 0)` donde empieza el dispositivo (altura de los ojos/mano) y casi todos los móviles lo soportan; `local-floor` intenta situar `y = 0` en el plano del suelo real, por lo que exige estimación de altura y puede fallar (`NotSupportedError`) en dispositivos sin estimación de piso.
