// server.mjs — Servidor de producción para Heroku (Atlas 3D PWA + WebXR).
// Sirve el bundle estático de dist/ respetando PORT, cabeceras HTTPS detrás de proxy,
// reglas de caché seguras para Service Workers (sw.js sin caché) y fallback SPA solo para HTML.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";
const DIST_DIR = path.resolve("dist");
const INDEX_FILE = path.join(DIST_DIR, "index.html");
const IS_PROD = process.env.NODE_ENV === "production";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".wasm": "application/wasm",
  ".txt": "text/plain; charset=utf-8",
};

const HASHED_ASSET_RE = /^\/(?:assets\/.+|[^/]+-[A-Z0-9]{8,}\.(?:m?js|css))$/;

function applyCacheHeaders(res, reqPath) {
  if (reqPath === "/sw.js" || reqPath === "/registerSW.js") {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Service-Worker-Allowed", "/");
    return;
  }
  if (
    reqPath === "/" ||
    reqPath === "/index.html" ||
    reqPath === "/manifest.json" ||
    reqPath === "/manifest.webmanifest"
  ) {
    res.setHeader("Cache-Control", "no-cache");
    return;
  }
  if (HASHED_ASSET_RE.test(reqPath)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return;
  }
  res.setHeader("Cache-Control", "public, max-age=3600");
}

function sendFile(req, res, filePath, reqPath) {
  const ext = path.extname(filePath).toLowerCase();
  res.statusCode = 200;
  res.setHeader("Content-Type", MIME_TYPES[ext] || "application/octet-stream");
  res.setHeader("X-Content-Type-Options", "nosniff");
  applyCacheHeaders(res, reqPath);

  if (req.method === "HEAD") {
    res.end();
    return;
  }
  const stream = fs.createReadStream(filePath);
  stream.on("error", () => {
    if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error");
  });
  stream.pipe(res);
}

const server = http.createServer((req, res) => {
  const method = req.method || "GET";
  if (method !== "GET" && method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8", Allow: "GET, HEAD" });
    res.end("Method Not Allowed");
    return;
  }

  // En Heroku, el router termina TLS y reenvía el esquema original en x-forwarded-proto.
  if (IS_PROD) {
    const protoHeader = req.headers["x-forwarded-proto"];
    const proto = Array.isArray(protoHeader) ? protoHeader[0] : protoHeader;
    if (proto && proto.split(",")[0].trim().toLowerCase() !== "https" && req.headers.host) {
      res.writeHead(301, { Location: `https://${req.headers.host}${req.url || "/"}` });
      res.end();
      return;
    }
  }

  let pathname;
  try {
    const rawPath = (req.url || "/").split("?")[0];
    pathname = decodeURIComponent(rawPath);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad Request");
    return;
  }

  const normalized = path.posix.normalize(pathname);
  const relative = normalized === "/" ? "/index.html" : normalized;
  const candidate = path.resolve(DIST_DIR, `.${relative}`);

  if (candidate !== DIST_DIR && !candidate.startsWith(DIST_DIR + path.sep)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    sendFile(req, res, candidate, relative);
    return;
  }

  // Fallback SPA únicamente para navegación HTML sin extensión de archivo.
  const hasExtension = Boolean(path.posix.extname(pathname));
  const acceptsHtml = (req.headers.accept || "").includes("text/html");
  if (!hasExtension && acceptsHtml && fs.existsSync(INDEX_FILE)) {
    sendFile(req, res, INDEX_FILE, "/index.html");
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(PORT, HOST, () => {
  console.log(`Atlas 3D escuchando en http://${HOST}:${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
});
