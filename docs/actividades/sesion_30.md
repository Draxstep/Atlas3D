# Sesión 30 (Sesión 4 de 18) — Caché de modelos 3D (1/3)

## Actividad 1 · `cache.put()` manual y versionado `atlas3d-v2`

- **Por qué `cache.put()` en lugar de depender solo de `cache.addAll()`:** `addAll()` es atómico (si una sola URL falla, rechaza toda la instalación). Iterar con `fetch()` + `cache.put()` permite manejar fallos individuales cuando existan activos pesados o descargados bajo demanda.
- **Limpieza en `activate`:** Al subir `CACHE_NAME` de `atlas3d-v1` a `atlas3d-v2`, `caches.keys()` lista los cachés del origen y `caches.delete()` elimina los obsoletos, conservando en Cache Storage únicamente `atlas3d-v2` con las 6 entradas (3 rutas de shell + 3 íconos PNG).
