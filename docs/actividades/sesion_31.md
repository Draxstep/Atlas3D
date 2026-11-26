# Sesión 31 (Sesión 5 de 18) — Caché de modelos 3D (2/3)

## Actividad 1 · Estrategias `Cache Only`, `Network Only` y `Cache First`

| Estrategia | Comportamiento | Uso típico en el Atlas 3D |
| :--- | :--- | :--- |
| `cacheOnly` | Solo consulta Cache Storage; no va a la red | Activos estrictamente precacheados e inmutables |
| `networkOnly` | Siempre va a la red | Peticiones que nunca deben servirse desde caché |
| `cacheFirst` | Devuelve caché si existe; si no, pide a red, clona y guarda con `cache.put()` | Íconos PNG y futuros archivos de modelos bajo demanda |

- A diferencia de la Sesión 30, `cacheFirst()` persiste las respuestas nuevas que no estaban en el precaché inicial para que la segunda petición no toque la red.
