import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="arranque">
    <h1>Atlas 3D de Arquitectura de Software</h1>
    <p>Proyecto inicializado con Vite, TypeScript, Three.js y Web App Manifest.</p>
  </main>
`;

// Registro del Service Worker — Sesión 28.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => console.log("SW registrado:", reg.scope))
    .catch((err) => console.error("Error al registrar SW:", err));
}
