/* ─── Planes Integrados — Todos los equipos ──────────────────────── */

let selectedPlanType = null;

const PLAN_SOURCES = (function() {
  const sources = [];

  // Mangas de Embarque
  if (typeof MANGAS_PLANS_EXTENDED !== 'undefined' && MANGAS_PLANS_EXTENDED && Object.keys(MANGAS_PLANS_EXTENDED).length > 0) {
    sources.push({
      name: 'Mangas de Embarque',
      icon: '🛬',
      color: '#0891b2',
      getData: () => {
        try {
          const plans = Object.entries(MANGAS_PLANS_EXTENDED).map(([key, val]) => ({...val, sourceKey: key}));
          return plans || [];
        } catch (e) {
          console.error('Error loading mangas plans:', e);
          return [];
        }
      },
      renderPlan: (plan) => renderMangaPlan(plan)
    });
  }

  // HVAC Plans
  if (typeof HVAC_PLANS !== 'undefined' && HVAC_PLANS && Object.keys(HVAC_PLANS).length > 0) {
    sources.push({
      name: 'HVAC (VRF, Roof Tops, Splits)',
      icon: '❄️',
      color: '#3b82f6',
      getData: () => {
        try {
          return Object.entries(HVAC_PLANS).map(([key, val]) => ({...val, sourceKey: key})) || [];
        } catch (e) {
          console.error('Error loading HVAC plans:', e);
          return [];
        }
      },
      renderPlan: (plan) => renderStandardPlan(plan)
    });
  }

  // Cooling Plans
  if (typeof COOLING_PLANS !== 'undefined' && COOLING_PLANS && Object.keys(COOLING_PLANS).length > 0) {
    sources.push({
      name: 'Chillers',
      icon: '❄️',
      color: '#06b6d4',
      getData: () => {
        try {
          return Object.entries(COOLING_PLANS).map(([key, val]) => ({...val, sourceKey: key})) || [];
        } catch (e) {
          console.error('Error loading cooling plans:', e);
          return [];
        }
      },
      renderPlan: (plan) => renderStandardPlan(plan)
    });
  }

  // Air Treatment Plans
  if (typeof AIRTREATMENT_PLANS !== 'undefined' && AIRTREATMENT_PLANS && Object.keys(AIRTREATMENT_PLANS).length > 0) {
    sources.push({
      name: 'Tratamiento de Aire (UTAs, Cortinas)',
      icon: '🌬️',
      color: '#10b981',
      getData: () => {
        try {
          return Object.entries(AIRTREATMENT_PLANS).map(([key, val]) => ({...val, sourceKey: key})) || [];
        } catch (e) {
          console.error('Error loading air treatment plans:', e);
          return [];
        }
      },
      renderPlan: (plan) => renderStandardPlan(plan)
    });
  }

  // Patio Plans
  if (typeof PATIO_PLANS !== 'undefined' && PATIO_PLANS && Object.keys(PATIO_PLANS).length > 0) {
    sources.push({
      name: 'Patio de Valijas (BHS)',
      icon: '🎀',
      color: '#8b5cf6',
      getData: () => {
        try {
          return Object.entries(PATIO_PLANS).map(([key, val]) => ({...val, sourceKey: key})) || [];
        } catch (e) {
          console.error('Error loading patio plans:', e);
          return [];
        }
      },
      renderPlan: (plan) => renderStandardPlan(plan)
    });
  }

  // Extractores Plans
  if (typeof EXTRACTORES_PLANS !== 'undefined' && EXTRACTORES_PLANS && Object.keys(EXTRACTORES_PLANS).length > 0) {
    sources.push({
      name: 'Extractores y Ventiladores',
      icon: '💨',
      color: '#ec4899',
      getData: () => {
        try {
          return Object.entries(EXTRACTORES_PLANS).map(([key, val]) => ({...val, sourceKey: key})) || [];
        } catch (e) {
          console.error('Error loading extractores plans:', e);
          return [];
        }
      },
      renderPlan: (plan) => renderStandardPlan(plan)
    });
  }

  // Puertas Plans
  if (typeof PUERTAS_PLANS !== 'undefined' && PUERTAS_PLANS && Object.keys(PUERTAS_PLANS).length > 0) {
    sources.push({
      name: 'Puertas Automáticas',
      icon: '🚪',
      color: '#f97316',
      getData: () => {
        try {
          return Object.entries(PUERTAS_PLANS).map(([key, val]) => ({...val, sourceKey: key})) || [];
        } catch (e) {
          console.error('Error loading puertas plans:', e);
          return [];
        }
      },
      renderPlan: (plan) => renderStandardPlan(plan)
    });
  }

  // Fleet Plans
  if (typeof MANT_KM !== 'undefined' && MANT_KM && Array.isArray(MANT_KM) && MANT_KM.length > 0) {
    sources.push({
      name: 'Flota (Por KM)',
      icon: '🚐',
      color: '#1a56a4',
      getData: () => {
        try {
          return MANT_KM || [];
        } catch (e) {
          console.error('Error loading fleet plans:', e);
          return [];
        }
      },
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
      ${planes.map((plan, idx) => {
        const title = plan.modelo || plan.denominacion || plan.nombre || plan.id || 'Plan';
        const freqCount = (plan.intervalos || plan.frecuenciasDetalladas || plan.frecuencias || []).length;
        return `
        <div class="plan-card" data-plan-idx="${idx}">
          <div class="plan-card-header" style="background: ${source.color}20; border-left: 4px solid ${source.color}">
            <span style="color: ${source.color}; font-weight: 700">${title}</span>
          </div>
          <div class="plan-card-preview">
            ${freqCount} frecuencia${freqCount !== 1 ? 's' : ''}
          </div>
        </div>
      `;
      }).join('')}
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

function renderStandardPlan(plan) {
  if (!plan.frecuencias) return '';

  return `
    <div class="mant-section-header">
      <div>
        <h2 class="mant-section-title">${plan.nombre || plan.id || 'Plan'}</h2>
        <p class="mant-section-desc">Mantenimiento preventivo por frecuencia</p>
      </div>
    </div>
    ${(plan.frecuencias || []).map(frec => `
      <div class="manga-freq-section" style="margin-bottom: 20px">
        <div class="manga-freq-header" style="background: ${frec.color}">
          <div>
            <span class="manga-freq-label">Frecuencia</span>
            <span class="manga-freq-badge">${frec.label}</span>
          </div>
        </div>
        <ul class="km-task-list" style="padding: 16px">
          ${(frec.tareas || []).map(tarea => `<li>${tarea}</li>`).join('')}
        </ul>
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

// Initialize se llamará desde maint-planes-app.js cuando sea necesario
// No se inicializa automáticamente para evitar conflictos de timing
