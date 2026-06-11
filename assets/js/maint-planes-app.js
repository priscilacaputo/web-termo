/* ─── Planes de Mantenimiento — Usar planes integrados ───────────────────────── */

// Este archivo ahora inicializa los planes integrados que ya están definidos en planes-integrados-app.js
// Los planes integrados incluyen: Mangas, HVAC, Chillers, Tratamiento de Aire, Flota

function initMaintPlanesView() {
  // Verificar que los planes integrados estén disponibles
  if (typeof initPlanesIntegrados === 'function') {
    initPlanesIntegrados();
  } else {
    console.warn('initPlanesIntegrados no está disponible. Esperando carga de planes-integrados-app.js');
    // Intentar nuevamente si aún no está cargado
    setTimeout(() => {
      if (typeof initPlanesIntegrados === 'function') {
        initPlanesIntegrados();
      }
    }, 100);
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMaintPlanesView);
} else {
  initMaintPlanesView();
}
