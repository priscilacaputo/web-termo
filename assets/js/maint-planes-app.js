/* ─── Planes de Mantenimiento — Vista General ───────────────────────── */

const MAINT_PLANES_TYPES = [
  { id: 'adelte-pbb', label: 'ADELTE — Manga Hidráulica', icon: '🟢' },
  { id: 'thyssen-2011', label: 'THYSSEN 2011-2013', icon: '🔵' },
  { id: 'thyssen-2018', label: 'THYSSEN 2018+', icon: '🟣' },
  { id: 'team', label: 'TEAM — Manga 2000-2001', icon: '🟠' },
];

let currentPlanType = null;

function initMaintPlanesView() {
  renderPlansTabs();
  if (MAINT_PLANES_TYPES.length > 0) {
    currentPlanType = MAINT_PLANES_TYPES[0].id;
    renderPlansContent();
  }
}

function renderPlansTabs() {
  const tabsContainer = document.getElementById('maint-planes-tabs');
  tabsContainer.innerHTML = MAINT_PLANES_TYPES.map(type => `
    <button class="maint-planes-tab ${type.id === currentPlanType ? 'active' : ''}"
            data-plan-type="${type.id}"
            style="padding:10px 16px;border:2px solid #e5e7eb;border-radius:8px;background:#fff;cursor:pointer;font-weight:600;transition:all .2s">
      ${type.icon} ${type.label}
    </button>
  `).join('');

  tabsContainer.querySelectorAll('.maint-planes-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPlanType = btn.dataset.planType;
      renderPlansTabs();
      renderPlansContent();
    });
  });
}

function renderPlansContent() {
  const content = document.getElementById('maint-planes-content');

  if (!MANGAS_PLANS_EXTENDED || !MANGAS_PLANS_EXTENDED[currentPlanType]) {
    content.innerHTML = '<p style="color:#9ca3af">Plan no disponible</p>';
    return;
  }

  const plan = MANGAS_PLANS_EXTENDED[currentPlanType];

  let html = `
    <div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.06)">
      <div style="margin-bottom:24px">
        <h2 style="margin:0;font-size:24px;font-weight:800;color:#1f2937;margin-bottom:8px">
          Planes de Mantenimiento
        </h2>
        <p style="margin:0;color:#6b7280;font-size:14px">
          Tipo: <strong>${MAINT_PLANES_TYPES.find(t => t.id === currentPlanType)?.label}</strong>
        </p>
      </div>
  `;

  // Render frequencies
  if (plan.frecuenciasDetalladas && plan.frecuenciasDetalladas.length > 0) {
    plan.frecuenciasDetalladas.forEach(freq => {
      const totalTasks = freq.grupos.reduce((sum, g) => sum + g.tareas.length, 0);

      html += `
        <div style="margin-bottom:24px;border-left:4px solid ${freq.color};padding-left:16px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <h3 style="margin:0;font-size:18px;font-weight:700;color:${freq.color}">
              ${freq.label}
            </h3>
            <span style="background:${freq.color}20;color:${freq.color};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600">
              ${freq.grupos.length} grupos · ${totalTasks} tareas
            </span>
          </div>
      `;

      // Render groups
      freq.grupos.forEach(grupo => {
        html += `
          <div style="margin-bottom:16px;background:#f9fafb;padding:12px 16px;border-radius:8px">
            <h4 style="margin:0 0 8px 0;font-size:14px;font-weight:700;color:#374151">
              ${grupo.nombre}
            </h4>
            <ul style="margin:0;padding-left:20px;list-style:disc;color:#555;font-size:13px;line-height:1.6">
        `;

        grupo.tareas.forEach(tarea => {
          html += `<li style="margin-bottom:4px">${tarea}</li>`;
        });

        html += `</ul></div>`;
      });

      html += `</div>`;
    });
  }

  html += `</div>`;
  content.innerHTML = html;
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMaintPlanesView);
} else {
  initMaintPlanesView();
}
