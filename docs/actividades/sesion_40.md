# Sesión 40 (Sesión 14 de 19) — Modelos de arquitectura en 3D

## Actividad 1 · Representación declarativa (`Pieza` y `Enlace`)

- **Para pensar (arquitectura hexagonal / orientada a eventos):** `Pieza` y `Enlace` permiten modelar puertos como cajas laterales, adaptadores como cilindros/cajas externas y el dominio central como núcleo; sin embargo, no expresan jerarquías anidadas (contenedores dentro de contenedores como un hexágono envolvente) ni flujos bidireccionales curvos sin usar dos enlaces paralelos con `desvio`.

## Actividad 2 · Auditoría de rótulos y superposiciones

- A escala `0.25` (modelo normalizado en `1.6` m → `0.40` m), un rótulo de altura relativa `0.4 * k` sobre `Microservicios` (`lado ≈ 14`, `k ≈ 2.33`, factor normalización `≈ 0.095`) resulta en texto físico de ~3.5 cm de altura, legible cómodamente a partir de escala `0.45–0.55` (~6–8 cm).
- **Remedios propuestos para los rótulos que se pisan en Microservicios:**
  1. Cambiar la posición del rótulo en datos (`Bus de mensajes` → `rotulo: "arriba"`, `Cliente` → `rotulo: "frente"` y `distancia: 0.9`), implementado en la Sesión 41.
  2. Mostrar las etiquetas de enlaces únicamente cuando se selecciona alguna de las piezas conectadas.

## Actividad 3 · Para pensar sobre la migración de IndexedDB (`v2 → v3`)

- La guarda `event.oldVersion >= 1 && event.oldVersion < 3` protege a los usuarios nuevos (`oldVersion === 0`, almacenes recién creados vacíos) evitando lecturas innecesarias.
- Quitar `reiniciarDescarga` dejaría el almacén `descargas` marcando `mvc`, `capas` y `microservicios` como `"listo"` aunque Cache Storage (`modelos-3d`) aún contuviera solo `modelo-demo-{1,2,3}.json`, rompiendo la lectura offline hasta forzar otra descarga.
