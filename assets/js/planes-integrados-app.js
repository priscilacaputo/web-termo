/* ─── Planes Integrados — Todos los equipos ──────────────────────── */

let selectedPlanType = null;

const PLAN_SOURCES = (function() {
  const sources = [];

  if (typeof MANGAS_PLANS_EXTENDED !== 'undefined' && MANGAS_PLANS_EXTENDED) {
    sources.push({
      name: 'Mangas de Embarque',
      icon: '🛬',
      color: '#0891b2',
      getData: () => Object.entries(MANGAS_PLANS_EXTENDED).map(([key, val]) => ({...val, sourceKey: key})) || [],
      renderPlan: (plan) => renderMangaPlan(plan)
    });
  }

  if (typeof MANT_KM !== 'undefined' && MANT_KM) {
    sources.push({
      name: 'Vehículos (Por KM)',
      icon: '🚐',
      color: '#1a56a4',
      getData: () => MANT_KM || [],
      renderPlan: (plan) => renderFlotaPlan(plan)
    });
  }

  return sources;
})();

function initPlanesIntegrados() {
  const tabsContainer = document.getElementById('maint-planes-tabs');
  const contentContainer = document.getElementById('maint-planes-content');

  // Render tabs
  tabsContainer.innerHTML = PLAN_SOURCES.map((src, i) => `
    <button class="mant-tab ${i === 0 ? 'active' : ''}" data-tab="${i}" style="border-bottom: 3px solid ${src.color}">
      ${src.icon} ${src.name}
    </button>
  `).join('');

  // Tab switching
  tabsContainer.querySelectorAll('.mant-tab').forEach((tab, i) => {
    tab.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.mant-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderPlanesTab(i, contentContainer);
    });
  });

  // Show first tab by default
  if (PLAN_SOURCES.length > 0) {
    renderPlanesTab(0, contentContainer);
  }
}

function renderPlanesTab(tabIndex, container) {
  if (!PLAN_SOURCES || !PLAN_SOURCES[tabIndex]) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>Planes no disponibles</p>
      </div>
    `;
    return;
  }

  const source = PLAN_SOURCES[tabIndex];
  let planes = [];
  try {
    planes = source.getData() || [];
  } catch (e) {
    console.error('Error loading planes:', e);
  }

  if (!planes || planes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>No hay planes disponibles para ${source.name.toLowerCase()}</p>
      </div>
    `;
    return;
  }

  const html = `
    <div class="planes-grid">
      ${planes.map((plan, idx) => `
        <div class="plan-card" data-plan-idx="${idx}">
          <div class="plan-card-header" style="background: ${source.color}20; border-left: 4px solid ${source.color}">
            <span style="color: ${source.color}; font-weight: 700">${plan.modelo || plan.denominacion || 'Plan'}</span>
          </div>
          <div class="plan-card-preview">
            ${(plan.intervalos || plan.frecuenciasDetalladas || []).length} frecuencias
          </div>
        </div>
      `).join('')}
    </div>
    <div id="plan-detail" style="margin-top: 32px"></div>
  `;

  container.innerHTML = html;

  // Add click handlers
  container.querySelectorAll('.plan-card').forEach((card, idx) => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.plan-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const plan = planes[idx];
      const detailContainer = container.querySelector('#plan-detail');
      detailContainer.innerHTML = source.renderPlan(plan);
    });
  });

  // Show first plan by default
  if (planes.length > 0) {
    container.querySelector('.plan-card').classList.add('active');
    const detailContainer = container.querySelector('#plan-detail');
    detailContainer.innerHTML = source.renderPlan(planes[0]);
  }
}

function renderMangaPlan(plan) {
  if (!plan.frecuenciasDetalladas) return '';

  return `
    <div class="mant-section-header">
      <div>
        <h2 class="mant-section-title">${plan.id || 'Plan de Manga'}</h2>
        <p class="mant-section-desc">Mantenimiento preventivo por frecuencia</p>
      </div>
    </div>
    ${plan.frecuenciasDetalladas.map(frec => `
      <div class="manga-freq-section" style="margin-bottom: 20px">
        <div class="manga-freq-header" style="background: ${frec.color}">
          <div>
            <span class="manga-freq-label">Frecuencia</span>
            <span class="manga-freq-badge">${frec.label}</span>
          </div>
        </div>
        <div class="manga-grupo-grid">
          ${frec.grupos.map(grupo => `
            <div class="manga-grupo">
              <div class="manga-grupo-nombre">${grupo.nombre}</div>
              <ul class="km-task-list">
                ${grupo.tareas.map(tarea => `<li>${tarea}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;
}

function renderFlotaPlan(plan) {
  const vehTags = (plan.vehiculos || []).map(eq => {
    const v = typeof FLOTA_DATA !== 'undefined' ? FLOTA_DATA.find(x => x.equipo === eq) : null;
    return `<span class="equipo-tag" title="${v ? v.denominacion : ''}">${eq}</span>`;
  }).join(' ');

  return `
    <div class="mant-section-header">
      <div>
        <h2 class="mant-section-title">${plan.modelo}</h2>
        <p class="mant-section-desc">Condición: ${plan.condicion || 'Estándar'}</p>
        ${vehTags ? `<div style="margin-top: 8px; display: flex; gap: 6px; flex-wrap: wrap">${vehTags}</div>` : ''}
      </div>
    </div>
    ${(plan.intervalos || []).map(int => `
      <div class="km-interval" style="margin-bottom: 16px">
        <div class="km-interval-header">
          <span class="km-badge">${int.km ? int.km.toLocaleString('es-AR') + ' km' : int.nombre || 'Intervalo'}</span>
          <span class="km-count">${(int.tareas || []).length} tarea${(int.tareas || []).length !== 1 ? 's' : ''}</span>
        </div>
        <ul class="km-task-list">
          ${(int.tareas || []).map(t => {
            const parts = t.split(': ');
            if (parts.length > 1) {
              return `<li><span class="task-cat">${parts[0]}:</span> ${parts.slice(1).join(': ')}</li>`;
            }
            return `<li>${t}</li>`;
          }).join('')}
        </ul>
      </div>
    `).join('')}
  `;
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlanesIntegrados);
} else {
  initPlanesIntegrados();
}
