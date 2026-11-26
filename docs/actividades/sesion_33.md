# Sesión 33 (Sesión 7 de 18) — IndexedDB en el proyecto

## Esquema de `atlas3d-progreso-db` (versión 1)

- **Object Store `progreso`:** `keyPath: "modeloId"` (clave natural de cada modelo del catálogo, sin `autoIncrement`).
- **Índices:**
  - `porFavorito` (`favorito`, no único): permite consultar favoritos con `IDBKeyRange.only(true)` y un cursor sin escanear toda la tabla.
  - `porUltimaVisita` (`ultimaVisita`, no único): permite ordenar por última visita reciente.
- **Cifrado selectivo:** `favorito` y `ultimaVisita` permanecen en texto plano para poder indexarse y consultarse; solo `notaCifrada` (+ `notaIv`) se cifra con AES-GCM usando una clave derivada vía PBKDF2 (100 000 iteraciones, SHA-256).
