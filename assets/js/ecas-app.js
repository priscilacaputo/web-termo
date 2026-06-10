/* ─── ECAs — Incendios ─────────────────────── */

let ecasFiltered      = [...ECAS_DATA];
let ecasView          = 'grid';
let ecasSearch        = '';
let ecasTipoFilter    = '';
let ecasSistemaFilter = '';
let ecasPisoFilter    = '';
let ecasInitialized   = false;

/* ─── Init ───────────────────────────────────────────────── */
function initECAS() {
  if (ecasInitialized) return;

  const statsEl = document.getElementById('ecas-stats');
  const searchEl = document.getElementById('ecas-search');
  const filterTipoEl = document.getElementById('ecas-filter-tipo');

  if (!statsEl || !searchEl || !filterTipoEl) {
    console.warn('ECAs elements not found, retrying...');
    setTimeout(initECAS, 100);
    return;
  }

  renderECASStats();
  buildECASFilters();
  applyECASFilters();

  searchEl.addEventListener('input', function () {
    ecasSearch = this.value.trim().toLowerCase();
    const clearBtn = document.getElementById('ecas-clear-search');
    if (clearBtn) clearBtn.style.display = ecasSearch ? 'flex' : 'none';
    applyECASFilters();
  });

  const clearSearchEl = document.getElementById('ecas-clear-search');
  if (clearSearchEl) {
    clearSearchEl.addEventListener('click', function () {
      ecasSearch = '';
      searchEl.value = '';
      this.style.display = 'none';
      applyECASFilters();
    });
  }

  filterTipoEl.addEventListener('change', function () {
    ecasTipoFilter = this.value;
    applyECASFilters();
  });

  const filterSistemaEl = document.getElementById('ecas-filter-sistema');
  if (filterSistemaEl) {
    filterSistemaEl.addEventListener('change', function () {
      ecasSistemaFilter = this.value;
      applyECASFilters();
    });
  }

  const filterPisoEl = document.getElementById('ecas-filter-piso');
  if (filterPisoEl) {
    filterPisoEl.addEventListener('change', function () {
      ecasPisoFilter = this.value;
      applyECASFilters();
    });
  }

  document.querySelectorAll('#page-ecas .aac-view-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#page-ecas .aac-view-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      ecasView = this.dataset.view;
      renderECAS();
    });
  });

  ecasInitialized = true;
  console.log('ECAs initialized with', ECAS_DATA.length, 'items');
}

// Inicializar cuando el DOM está listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initECAS);
} else {
  initECAS();
}

/* ─── Análisis de datos ──────────────────────────────────── */
function analyzeECASData() {
  const byBuilding = {};
  const byFloor = {};

  ECAS_DATA.forEach(e => {
    // Extraer edificio del ubicacion
    const ubicMatch = e.ubicacion.match(/Ed[^P]*/i) || e.ubicacion.match(/Hall/i) || ['Otro'];
    const building = ubicMatch[0].trim();

    // Usar piso del registro
    const floor = e.piso;

    // Contar por edificio
    byBuilding[building] = (byBuilding[building] || 0) + 1;

    // Contar por piso
    byFloor[floor] = (byFloor[floor] || 0) + 1;
  });

  return {
    byBuilding: Object.entries(byBuilding).sort((a, b) => b[1] - a[1]),
    byFloor: Object.entries(byFloor).sort((a, b) => {
      const order = ['PB', '1', '2', '3', '4', '5', '6'];
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    })
  };
}

/* ─── Stats ──────────────────────────────────────────────── */
function renderECASStats() {
  const total      = ECAS_DATA.length;
  const sprinklers = ECAS_DATA.filter(e => e.tipo === 'Sprinkler').length;
  const hidrantes  = ECAS_DATA.filter(e => e.tipo === 'Hidrante').length;

  const cards = [
    { label: 'Total ECAs',    value: total,      icon: '🔥', color: '#dc2626' },
    { label: 'Sprinklers',    value: sprinklers, icon: '💧', color: '#059669' },
    { label: 'Hidrantes',     value: hidrantes,  icon: '🚨', color: '#2563eb' },
  ];

  document.getElementById('ecas-stats').innerHTML = cards.map(c => `
    <div class="stat-card" style="--stat-color:${c.color}">
      <span class="stat-label">${c.label}</span>
      <span class="stat-value">${c.value}</span>
      <span class="stat-icon">${c.icon}</span>
    </div>
  `).join('');

  // Renderizar análisis
  renderAnalysisSection();
}

/* ─── Filters ────────────────────────────────────────────── */
function buildECASFilters() {
  const sistemas = [...new Set(ECAS_DATA.map(e => e.sistema))].filter(Boolean).sort();
  const pisos    = [...new Set(ECAS_DATA.map(e => e.piso))].sort();

  const selSistema = document.getElementById('ecas-filter-sistema');
  const selPiso    = document.getElementById('ecas-filter-piso');

  sistemas.forEach(s => {
    const o = document.createElement('option');
    o.value = s; o.textContent = s;
    selSistema.appendChild(o);
  });
  pisos.forEach(p => {
    const o = document.createElement('option');
    o.value = p; o.textContent = p;
    selPiso.appendChild(o);
  });
}

function applyECASFilters() {
  ecasFiltered = ECAS_DATA.filter(e => {
    if (ecasTipoFilter && e.tipo !== ecasTipoFilter) return false;
    if (ecasSistemaFilter && e.sistema !== ecasSistemaFilter) return false;
    if (ecasPisoFilter && e.piso !== ecasPisoFilter) return false;
    if (ecasSearch) {
      const hay = [e.equipo, e.ubicacion, e.sistema, e.sap]
        .join(' ').toLowerCase();
      if (!hay.includes(ecasSearch)) return false;
    }
    return true;
  });
  renderECAS();
}

/* ─── Render dispatcher ──────────────────────────────────── */
function renderECAS() {
  const isData = ecasView === 'grid' || ecasView === 'table';

  document.getElementById('ecas-result-count').textContent =
    isData ? `${ecasFiltered.length} de ${ECAS_DATA.length} ECAs` : '';

  document.getElementById('ecas-grid').classList.toggle('hidden',       ecasView !== 'grid');
  document.getElementById('ecas-table-wrap').classList.toggle('hidden', ecasView !== 'table');

  if (ecasView === 'grid')  renderECASGrid();
  if (ecasView === 'table') renderECASTable();
}

/* ─── Grid ───────────────────────────────────────────────── */
function renderECASGrid() {
  const container = document.getElementById('ecas-grid');

  if (!ecasFiltered.length) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">🔍</div>
      <p>No se encontraron ECAs con los filtros aplicados.</p>
    </div>`;
    return;
  }

  const tipoColor = { 'Sprinkler': '#059669', 'Hidrante': '#dc2626' };

  container.innerHTML = ecasFiltered.map(e => {
    const color = tipoColor[e.tipo] || '#6b7280';
    return `<div class="aac-card">
      <div class="aac-card-header">
        <span class="aac-card-code" style="background:${color}20;color:${color}">${e.equipo}</span>
        <span class="aac-tipo-badge" style="background:${color}18;color:${color};border-color:${color}35">${e.tipo}</span>
      </div>
      <div class="aac-card-denom">${e.ubicacion}</div>
      <div class="aac-card-meta">
        <span class="aac-fab-text"><strong>Sistema:</strong> ${e.sistema}</span>
      </div>
      <div class="aac-card-footer">
        <span class="aac-zona-badge" style="background:#f3f4f6;color:#374151"><strong>Piso:</strong> ${e.piso}</span>
        <span class="aac-sector-text" title="${e.alimenta}"><strong>Alimenta:</strong> ${e.alimenta.substring(0, 30)}...</span>
      </div>
    </div>`;
  }).join('');
}

/* ─── Table ──────────────────────────────────────────────── */
function renderECASTable() {
  const tbody = document.getElementById('ecas-tbody');

  if (!ecasFiltered.length) {
    tbody.innerHTML = `<tr><td colspan="6">
      <div class="empty-state"><div class="empty-icon">🔍</div>
      <p>No se encontraron ECAs con los filtros aplicados.</p></div>
    </td></tr>`;
    return;
  }

  const tipoColor = { 'Sprinkler': '#059669', 'Hidrante': '#dc2626' };

  tbody.innerHTML = ecasFiltered.map(e => {
    const color = tipoColor[e.tipo] || '#6b7280';
    return `<tr>
      <td><span class="equipo-tag">${e.equipo}</span></td>
      <td><span class="aac-tipo-badge" style="background:${color}15;color:${color};border-color:${color}30">${e.tipo}</span></td>
      <td>${e.ubicacion}</td>
      <td><strong>${e.piso}</strong></td>
      <td>${e.sistema}</td>
      <td>${e.alimenta}</td>
    </tr>`;
  }).join('');
}

/* ─── Análisis visual ────────────────────────────────────── */
function renderAnalysisSection() {
  const container = document.getElementById('ecas-analysis-section');
  if (!container) return;

  const analysis = analyzeECASData();

  let html = `
    <div style="margin-top:32px; padding-top:24px; border-top:2px solid var(--color-border)">
      <h3 style="color:var(--color-navy); font-weight:700; margin-bottom:20px; font-size:18px">📊 Distribución de ECAs</h3>

      <!-- Por Edificio -->
      <div style="margin-bottom:32px">
        <h4 style="color:var(--color-text); font-weight:600; margin-bottom:12px; font-size:15px">🏢 Por Edificio</h4>
        <div style="display:grid; gap:8px">
  `;

  const maxBuilding = Math.max(...analysis.byBuilding.map(([_, count]) => count));

  analysis.byBuilding.forEach(([building, count]) => {
    const percentage = Math.round((count / maxBuilding) * 100);
    html += `
      <div style="padding:12px; background:var(--color-surface); border-radius:8px; border-left:3px solid #3b82f6">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px">
          <span style="font-weight:600; color:var(--color-text)">${building}</span>
          <span style="font-weight:700; font-size:16px; color:#3b82f6">${count}</span>
        </div>
        <div style="width:100%; height:6px; background:var(--color-border); border-radius:3px; overflow:hidden">
          <div style="height:100%; background:linear-gradient(90deg,#3b82f6,#60a5fa); width:${percentage}%"></div>
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </div>

      <!-- Por Piso -->
      <div>
        <h4 style="color:var(--color-text); font-weight:600; margin-bottom:12px; font-size:15px">🏗️ Por Piso</h4>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px">
  `;

  const maxFloor = Math.max(...analysis.byFloor.map(([_, count]) => count));
  const floorColors = {
    'PB': '#ef4444',
    '1': '#f97316',
    '2': '#eab308',
    '3': '#84cc16',
    '4': '#22c55e',
    '5': '#10b981',
    '6': '#14b8a6'
  };

  analysis.byFloor.forEach(([floor, count]) => {
    const percentage = Math.round((count / maxFloor) * 100);
    const color = floorColors[floor] || '#6b7280';
    html += `
      <div style="padding:14px; background:var(--color-surface); border-radius:10px; border-top:3px solid ${color}; text-align:center">
        <div style="font-weight:700; font-size:24px; color:${color}; margin-bottom:6px">${floor}</div>
        <div style="font-weight:600; color:var(--color-text); font-size:14px">${count} equipos</div>
        <div style="width:100%; height:4px; background:var(--color-border); border-radius:2px; margin-top:8px; overflow:hidden">
          <div style="height:100%; background:${color}; width:${percentage}%"></div>
        </div>
      </div>
    `;
  });

  html += `
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}
