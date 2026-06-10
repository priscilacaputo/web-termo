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
